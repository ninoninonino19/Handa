// app.config.js
import 'dotenv/config';  // reads .env file into process.env

export default {
  expo: {
    name: "Handa",
    slug: "Handa",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "handa",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
        package: "com.ninoe.handa",
        googleServicesFile: "./google-services.json",
        adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      ios: {
        bundleIdentifier: "com.ninoe.handa",
        supportsTablet  : true
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000"
          }
        }
      ]
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    // 👇 This is where we inject the secrets
    extra: {
      groqApiKey: process.env.GROQ_API_KEY,
      backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL,
         eas: {
            projectId: "f323dc6e-c499-428d-9719-aa7ff1e2c5ae"
         }
    }
  }
};