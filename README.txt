HLL Artillery - install guide

1. Upload this whole folder (all 5 files) to a static host, for example:
   - Netlify Drop (drag the unzipped folder onto the page)
   - GitHub Pages, or Cloudflare Pages
   The site must be served over https.
2. Open your new web address in Chrome on your phone.
3. Chrome menu > "Install app" (or "Add to Home screen").
   The app opens full screen and works offline after the first load.

Updating: replace the files on the host. If the old version keeps showing,
change the cache name in sw.js (hll-arty-v1 -> hll-arty-v2) and re-upload.
