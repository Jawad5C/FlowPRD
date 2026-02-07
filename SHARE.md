# Sharing FlowPRD for Testing

Use this when you want to send a link so someone else can test the app. **They do not need a Gemini account** — the backend uses your API key.

## Quick steps (you run these)

1. **Start the app** (both backend and frontend):
   - **Terminal 1:** `cd backend && source venv/bin/activate && python app.py`
   - **Terminal 2:** `cd frontend && npm run dev`

2. **Get a public link** with [ngrok](https://ngrok.com) (free):
   - Install: `brew install ngrok` (Mac) or download from https://ngrok.com/download
   - Run: `ngrok http 3000`
   - Copy the **HTTPS** URL it shows (e.g. `https://abc123.ngrok-free.app`)

3. **Send that URL** to your collaborator. They open it in a browser and use the app; each "Transform" uses 1 of your Gemini requests.

## Request limit

- Your Gemini free tier has a **20 requests per day** limit.
- Each time anyone (you or your collaborator) clicks **Transform**, that counts as 1 request.
- Check remaining usage: [Google AI Studio](https://aistudio.google.com/app/apikey) → your key → usage/quota.

## Same WiFi option

If your collaborator is on the same network, you can skip ngrok and share your machine’s IP:

- Find your IP: `ipconfig getifaddr en0` (Mac) or check System Settings → Network.
- Share: `http://YOUR_IP:3000` (e.g. `http://192.168.1.5:3000`).

They must use this while your backend and frontend are running.
