# Handa – Disaster Preparedness App

## What it does

Handa is a mobile app (React Native + Expo) for Filipino communities to report and
monitor local hazards — floods, storms, earthquakes, and landslides.

- Shows nearby hazard reports as severity-colored markers on a map centered on your location.
- Lets anyone submit a report with hazard type, severity, barangay, description, and an optional photo.
- Lists all reports with free-text search and filters by type and severity.
- Includes "Handa AI", a Groq-powered assistant that answers preparedness questions in short Taglish advice.
- Ships with an optional Express backend for Expo push notifications.

Hazard data is served from bundled mock reports by default (`USE_MOCK` in
`src/services/hazardService.ts`); your own reports are added on top of them.

## How to run it

Requirements: Node.js 18+, and the [Expo Go](https://expo.dev/go) app on your phone.

1. Clone and install:

   ```bash
   git clone https://github.com/ninoninonino19/Handa.git
   cd Handa
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   GROQ_API_KEY=your_groq_api_key_here
   EXPO_PUBLIC_BACKEND_URL=http://your-backend-url:3000
   ```

   `GROQ_API_KEY` is needed for the AI assistant. `EXPO_PUBLIC_BACKEND_URL` is only
   needed for push notifications and can be left out; the map, reports, and search
   work without either.

3. Start the dev server:

   ```bash
   npx expo start --clear
   ```

4. Open it on your device:
   - **Android:** open Expo Go and scan the QR code from the terminal.
   - **iOS:** scan the QR code with the Camera app and open the link in Expo Go.

Grant the location permission when prompted — the map needs it to center on you.

### Optional: push notification backend

```bash
cd backend
npm install
npm start          # listens on port 3000
```

It exposes `POST /register-token` (register an Expo push token) and
`POST /send-notification` (broadcast `{ title, body, data }` to registered devices).

## How to use it

**Map tab**

- Pan and zoom to browse hazards; marker color shows severity (green = low, orange = medium, red = high).
- Tap a marker to open the full report.
- Tap the locate button to recenter on your position.
- Tap the report button to file a hazard: pick a type and severity, enter the barangay
  and a description, optionally attach a photo from the camera or gallery, then submit.
  The report is pinned at your current location and appears on the map and list right away.
- Tap the AI button to ask Handa AI about evacuation, emergency kits, or hazard-specific
  precautions, and get a short Taglish answer.

**List tab**

- Scroll recent reports with type, severity badge, barangay, description, and time.
- Search by barangay or description text.
- Tap the filter button to narrow by hazard type and severity, or reset all filters.
- Pull down to refresh.
