<div align="center">

# ✨ NoorAtelier — AI-Powered Smart Wardrobe

**Your personal AI fashion stylist. Organize, style, and try on outfits — powered by Google Gemini.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

</div>

---

## 🌟 Overview

**NoorAtelier** is a full-stack AI wardrobe management and fashion assistant web application. It combines a beautiful, responsive UI with the power of **Google Gemini AI** to help users organize their clothing, plan weekly outfits, get personalized style advice, and virtually try on clothes using AI-generated imagery.

> Built with love for fashion-forward individuals who want a smarter, more organized wardrobe.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🔐 **Google Authentication** | Sign in with Google via Firebase Auth or use email/password |
| 👗 **Smart Wardrobe** | Add, categorize, and browse your clothing items with rich metadata |
| 🤖 **AI Fashion Assistant** | Chat with Gemini AI for outfit ideas, style tips, and fashion advice |
| 🪞 **Virtual Try-On** | Upload your photo and see how selected clothes look on you using AI image generation |
| 📅 **Weekly Planner** | Plan your outfits day-by-day for the entire week |
| 📱 **Social Feed** | Share outfit ideas and get inspired by the community |
| 🌙 **Dark / Light Mode** | Seamless theme switching with persistent preferences |
| 👤 **User Profile** | Manage your profile, style preferences, and body measurements |
| ⚙️ **Settings** | Customize notifications, privacy, and app preferences |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** — Latest React with concurrent features
- **TypeScript 5.8** — Full type safety across the codebase
- **Vite 6** — Lightning-fast build tool and dev server
- **Tailwind CSS** — Utility-first styling with custom design tokens

### AI & Backend
- **Google Gemini AI** (`@google/genai`) — Multi-modal AI for fashion advice and virtual try-on
- **Firebase** — Authentication (Google OAuth + email/password) and cloud storage
- **Gemini Vision** — Image analysis for wardrobe item recognition

### Architecture
- **React Context API** — Global state management for user and wardrobe data
- **Component-based design** — Modular, reusable UI components
- **Service layer** — Abstracted Firebase and Gemini API interactions

---

## 📁 Project Structure

```
nooratelier-ai-wardrobe/
├── components/
│   ├── AIAssistant.tsx      # Floating AI chat panel powered by Gemini
│   ├── AddItemModal.tsx     # Multi-step modal for adding wardrobe items
│   ├── Header.tsx           # Top navigation bar
│   └── Sidebar.tsx          # Collapsible navigation sidebar
├── contexts/
│   ├── UserContext.tsx      # Authentication & user profile state
│   └── WardrobeContext.tsx  # Wardrobe items global state
├── services/
│   ├── firebase.ts          # Firebase Auth & Firestore configuration
│   └── geminiService.ts     # Google Gemini AI API integration
├── views/
│   ├── Auth.tsx             # Login & registration page
│   ├── Dashboard.tsx        # Home dashboard with stats & suggestions
│   ├── Wardrobe.tsx         # Wardrobe browsing & management
│   ├── VirtualTryOn.tsx     # AI-powered virtual try-on experience
│   ├── WeeklyPlanner.tsx    # Drag-and-drop weekly outfit planner
│   ├── SocialFeed.tsx       # Community outfit inspiration feed
│   ├── Profile.tsx          # User profile & measurements
│   └── Settings.tsx         # App preferences & account settings
├── types.ts                 # Shared TypeScript type definitions
├── App.tsx                  # Root component & routing logic
└── index.html               # App entry point
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** v18 or higher
- A **Google Gemini API Key** — Get one free at [Google AI Studio](https://aistudio.google.com/app/apikey)
- A **Firebase Project** — Set up at [Firebase Console](https://console.firebase.google.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/nooratelier.git
   cd nooratelier
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser 🎉

---

## 🔮 AI Features In Depth

### 🤖 AI Fashion Assistant
The floating chat panel uses **Google Gemini Pro** to answer style questions, suggest outfit combinations from your existing wardrobe, and provide personalized fashion advice based on occasion, weather, or mood.

### 🪞 Virtual Try-On
Upload a photo of yourself and select items from your wardrobe. Gemini's multi-modal vision model generates a realistic visualization of how the clothing would look on you — no physical fitting room needed.

### 👗 Smart Item Recognition
When adding clothing to your wardrobe, the AI can analyze photos to automatically suggest item categories, colors, and style tags.

---

## 🧪 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/YOUR_USERNAME/nooratelier/issues).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👩‍💻 Author

**Akanksha** — [@your_github](https://github.com/YOUR_USERNAME)

> *"Fashion is the armor to survive the reality of everyday life."* — Bill Cunningham

---

<div align="center">

⭐ **If you like this project, give it a star!** ⭐

</div>
