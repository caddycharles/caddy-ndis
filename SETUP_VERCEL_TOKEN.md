# ⚠️ IMPORTANT: Set Up Vercel Token

## Quick Setup (1 minute)

1. **Open this link:** https://vercel.com/account/tokens

2. **Create a new token:**
   - Token Name: `caddy-ndis-deploy`
   - Scope: Full Account
   - Expiration: Never (or 1 year)
   - Click "Create"

3. **Copy the token** (it starts with something like `2qR...`)

4. **Run this command in your terminal:**
   ```bash
   gh secret set VERCEL_TOKEN --repo="caddycharles/caddy-ndis"
   ```
   Then paste the token when prompted.

5. **Delete this file** after setting the token:
   ```bash
   rm SETUP_VERCEL_TOKEN.md
   ```

## Alternative: Use Environment Variable

If you prefer, add to your `.env.local`:
```
VERCEL_TOKEN=your-token-here
```

Then run:
```bash
source .env.local
gh secret set VERCEL_TOKEN --body="$VERCEL_TOKEN" --repo="caddycharles/caddy-ndis"
```

---

**Why is this needed?** GitHub Actions needs this token to deploy to Vercel on your behalf.