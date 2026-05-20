# 🌧️ Handa – Disaster Preparedness App

A mobile app for Filipino communities to report and monitor real-time hazards such as floods, storms, earthquakes, and landslides.

## ✨ Features

- 🗺️ Interactive map with severity-colored markers
- 📸 User-submitted hazard reports with optional photos
- 🔍 Searchable and filterable reports list
- 🤖 AI assistant powered by Groq for short, actionable safety advice in Taglish
- 📱 Mobile-friendly and community-centered design

---

# 📱 Run the App with Expo Go

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or newer)
- [Expo Go](https://expo.dev/go) on your iOS or Android device
- A code editor such as VS Code

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/handa-disaster-app.git
cd handa-disaster-app
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Set Up Environment Variables

Create a `.env` file in the project root directory.

Use the following template and replace the placeholder values with your own keys:

```env
GROQ_API_KEY=your_groq_api_key_here
EXPO_PUBLIC_BACKEND_URL=http://your-backend-url:3000
```

### Notes

- `GROQ_API_KEY` is required for the AI assistant feature.
- `EXPO_PUBLIC_BACKEND_URL` is optional and only needed if push notifications are enabled.
- For basic app usage (map, reports, AI assistant), you may leave the backend URL empty.

## 4. Start the Development Server

```bash
npx expo start --clear
```

## 5. Open the App on Your Device

### Android
- Open the Expo Go app
- Scan the QR code displayed in the terminal or browser

### iOS
- Open the Camera app
- Scan the QR code
- Open the link using Expo Go

---

# 🛠️ Tech Stack

- React Native
- Expo
- Groq API
- JavaScript / TypeScript

---

# 📷 Sample Use Cases

- Report flooding in your area
- Monitor nearby hazards
- View severity levels on the map
- Ask the AI assistant for emergency tips
- Browse recent community reports

---

# 📄 License

This project is for educational and community preparedness purposes.
