# Cloudflare DNS Setup for caddy.team

## 🔧 DNS Records Configuration

### Step 1: Login to Cloudflare
1. Go to https://dash.cloudflare.com
2. Select your domain: **caddy.team**
3. Click on **DNS** in the left sidebar

### Step 2: Add These DNS Records

Delete any existing A, AAAA, or CNAME records for @ and www, then add:

| Type | Name | Content | Proxy Status | TTL |
|------|------|---------|--------------|-----|
| **A** | `@` | `76.76.21.21` | 🟠 Proxied | Auto |
| **CNAME** | `www` | `cname.vercel-dns.com` | 🟠 Proxied | Auto |

### Alternative Configuration (if A record doesn't work):

| Type | Name | Content | Proxy Status | TTL |
|------|------|---------|--------------|-----|
| **CNAME** | `@` | `cname.vercel-dns.com` | 🟠 Proxied | Auto |
| **CNAME** | `www` | `cname.vercel-dns.com` | 🟠 Proxied | Auto |

**Note**: Some Cloudflare plans don't allow CNAME on root domain (@). If that's the case, use the A record.

### Step 3: Add These Additional Records (Optional but Recommended)

| Type | Name | Content | TTL |
|------|------|---------|-----|
| **TXT** | `@` | `v=spf1 include:_spf.google.com ~all` | Auto |
| **TXT** | `_vercel` | `vc-domain-verify=caddy.team,<verification-code>` | Auto |

### Step 4: Configure Cloudflare Settings

#### SSL/TLS Settings:
1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode to **Full (strict)**

#### Page Rules (Optional):
1. Go to **Rules** → **Page Rules**
2. Create rule: `*caddy.team/*`
   - Always Use HTTPS: ON
   - Automatic HTTPS Rewrites: ON

#### Security Settings:
1. Go to **Security** → **Settings**
2. Set Security Level: **Medium**
3. Enable **Bot Fight Mode**

#### Speed Settings:
1. Go to **Speed** → **Optimization**
2. Enable **Auto Minify** for JavaScript, CSS, HTML
3. Enable **Brotli**

### Step 5: Update Vercel Configuration

In your project directory, update `vercel.json`:

```json
{
  "domains": ["caddy.team", "www.caddy.team"],
  // ... rest of your config
}
```

### Step 6: Verify Setup

Run these commands to verify:

```bash
# Check DNS propagation
dig caddy.team
dig www.caddy.team

# Check with Vercel
npx vercel domains inspect caddy.team

# Force SSL certificate generation
curl -I https://caddy.team
```

## 🎯 Expected Results

After configuration (may take 5-30 minutes):

- ✅ https://caddy.team → Your Vercel app
- ✅ https://www.caddy.team → Your Vercel app
- ✅ http:// automatically redirects to https://
- ✅ SSL certificate from Cloudflare
- ✅ DDoS protection from Cloudflare
- ✅ Global CDN from both Cloudflare and Vercel

## 🚨 Troubleshooting

### "Invalid Configuration" Error
- Make sure Cloudflare proxy (orange cloud) is ON
- Wait 5-10 minutes for propagation
- Try using CNAME instead of A record

### SSL Certificate Error
- Check SSL/TLS mode is set to "Full (strict)"
- Wait up to 24 hours for certificate generation
- Clear browser cache

### Site Not Loading
1. Check DNS propagation: https://dnschecker.org/#A/caddy.team
2. Verify Vercel deployment is successful
3. Check Cloudflare is not blocking traffic

### Verification Command
```bash
# This should return Vercel headers
curl -I https://caddy.team -H "Host: caddy.team"
```

## 📱 Quick Links

- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Vercel Domains**: https://vercel.com/charles-projects-29e54aed/caddy/settings/domains
- **DNS Checker**: https://dnschecker.org/#A/caddy.team
- **SSL Test**: https://www.ssllabs.com/ssltest/analyze.html?d=caddy.team

---

Last Updated: 2025-01-14
Status: Ready for configuration