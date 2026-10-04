# linkedin-antiprom

Lightweight Chrome/Chromium extension that hides promoted posts from the LinkedIn feed.

## Quick install (for developers)

1. Install dependencies:

```bash
npm install
```

2. Build the extension bundle (outputs go to `dist/`):

```bash
npm run build
```

3. Load the extension in Chrome/Edge/Brave:

- Open `chrome://extensions`
- Enable **Developer mode**
- Click **Load unpacked** and select the `dist` directory created by the build

After loading, visit `https://www.linkedin.com/feed/` — promoted posts should be hidden.

## Quick install (for non-developers)

1. Download the built `dist` folder from the repository release or branch.
2. Open `chrome://extensions` in Chrome/Edge/Brave.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the downloaded `dist` folder.
5. Visit `https://www.linkedin.com/feed/` to confirm the extension is active.

## Options

The extension includes an options page where you can:

- enable or disable hiding of **Promoted** posts
- enable or disable hiding of **Suggested** posts
- enter custom comma-separated keywords or company names to hide matching feed cards

To access options, open the extension details in your browser and click **Extension options** or right-click the extension icon and choose **Options**.

## Notes

- The build produces `dist/index.global.js` (the bundled content script) and copies `manifest.json` into `dist/` so the folder can be loaded as an unpacked extension.
- The extension looks for the text "promoted" (case-insensitive) to detect promoted posts. It may need updates for localization or structural changes to LinkedIn's markup.
