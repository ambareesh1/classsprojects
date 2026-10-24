# CLASSS Projects — Vercel-ready website

## Deploy using GitHub

1. Extract this project ZIP.
2. Upload the contents of the `classsprojects-vercel` folder to a new GitHub repository. `package.json` and `vercel.json` should be in the repository root.
3. In Vercel select Add New → Project and import that repository.
4. Framework Preset: Other. Root Directory: repository root. Node.js: 24.x.
5. Build settings are included in `vercel.json`: Install Command `npm ci`, Build Command `npm run build`, Output Directory `dist`.
6. Click Deploy. Vercel provides a hosted URL.
7. To use `classsprojects.in`, add it under the project's Settings → Domains and apply the DNS records Vercel displays at your registrar.

No environment variables are required for this version.

## Deploy using the Vercel CLI

From this folder run `npx vercel`, then `npx vercel --prod` after linking the intended Vercel project.

## Verify locally

Run `npm ci` and `npm run build`, then `npx serve dist`.

The ZIP includes all React source, the dependency lockfile, build script, images and static files. No ChatGPT hosting dependencies, credentials, Git history or node_modules are included.

## Google Sheets enquiries

1. Create a Google Form with Name, Mobile, Email, Institution/company, Service, Requirement, Delivery city, Target date and optional attachment.
2. In Responses choose Link to Sheets and create/select your response spreadsheet.
3. Publish the form for your intended audience and copy the responder URL.
4. Set `googleFormUrl` in `dist/config.js` to that published URL and redeploy.
5. Send a test response and verify the row in the linked Sheet.

The website redirects to the Google Form when configured. Visitors must complete and submit the Google Form; the website does not claim that the local fields have been saved or transfer them automatically. Until configured, the site prepares a WhatsApp enquiry with the entered details. File attachments can be shared in WhatsApp or in Google Forms; Forms file uploads may require Google sign-in.

WhatsApp number: +91 98451 67856.

## Content

Based on the provided 19-page CLASSS Projects Developer Brief. Product photography is representative. Project concepts are labeled as illustrative; pricing, availability, lead time and delivery are enquiry-based. See `dist/image-credits.html` for credits.

## Framework recommendation

For a longer-lived multi-page marketing site, move these React components to Next.js with `output: 'export'`, dedicated project URLs and generated metadata. This temporary version uses a static React build to minimize infrastructure.

## Image asset storage

The ESP32 photo is stored losslessly as numbered Base64 parts in `assets-source/` for upload compatibility. `npm run build` restores the original photo to `dist/assets/esp32.jpg` automatically. Keep all parts in the repository; no additional setup is required.
