import { httpRouter } from "convex/server";
// @ts-ignore - Generated types will be available when convex dev runs
import { httpAction } from "./_generated/server";
// @ts-ignore - Generated types will be available when convex dev runs
import { internal } from "./_generated/api";
import { Webhook } from "svix";

const http = httpRouter();

// Clerk webhook endpoint
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("Missing CLERK_WEBHOOK_SECRET");
      return new Response("Webhook secret not configured", { status: 500 });
    }

    // Get the headers
    const svix_id = request.headers.get("svix-id");
    const svix_timestamp = request.headers.get("svix-timestamp");
    const svix_signature = request.headers.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Missing svix headers", { status: 400 });
    }

    // Get the body
    const payload = await request.text();

    // Verify the webhook
    const wh = new Webhook(webhookSecret);
    let evt: any;

    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return new Response("Invalid signature", { status: 400 });
    }

    // Handle the webhook
    const eventType = evt.type;

    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;

      await ctx.runMutation(internal.users.upsertUser, {
        clerkId: id,
        email: email_addresses[0]?.email_address || "",
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
      });
    } else if (eventType === "user.deleted") {
      const { id } = evt.data;

      await ctx.runMutation(internal.users.deleteUser, {
        clerkId: id,
      });
    }

    return new Response("Webhook processed", { status: 200 });
  }),
});

export default http;
