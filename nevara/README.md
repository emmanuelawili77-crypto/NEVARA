# NÉVARA website

Static site, no build step. Upload this folder to any static host (Netlify, Cloudflare Pages, Vercel, GitHub Pages, cPanel).

## Before you go live
1. Open `js/config.js` and fill in: `whatsappNumber` (orders), `formEndpoint` (contact form + newsletter, free at formspree.io), `email`, `phone`, and your social profile URLs. Anything left empty is hidden or shows a "not connected yet" message.
2. Open `js/products.js` and replace the sample names, prices, sizes and descriptions with your real ones. Put product photos in `images/products/`.
3. Once you have a domain, add `<link rel="canonical">`, `og:image` (absolute URL, use `images/og-image.jpg`) and a `sitemap.xml`.

## Notes
- Cart and wishlist are saved in the visitor's browser. There is no online payment: orders are sent via WhatsApp or the form endpoint and confirmed with the customer.
- `_headers` sets security headers and caching (Netlify / Cloudflare Pages).
- Test locally: `python3 -m http.server 8000` in this folder.
