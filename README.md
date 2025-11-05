<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🌟 Gentle Ωmega AI - Career Center Platform

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-gentleomegaai.space-00D9FF?style=for-the-badge)](https://gentleomegaai.space)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI_Powered-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev)

**🚀 An AI-powered career platform offering professional training, workshops, and events with seamless user experience**

[View in AI Studio](https://ai.studio/apps/drive/1mTVnvpcWhYWqV5mphL6LQgrAqzX-I7oS) • [Report Bug](https://github.com/aamirshehzad9/GentleOmegaAI/issues) • [Request Feature](https://github.com/aamirshehzad9/GentleOmegaAI/issues)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🎨 Key Highlights](#-key-highlights)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [🔑 Environment Setup](#-environment-setup)
- [🎯 Usage](#-usage)
- [🌐 Deployment](#-deployment)
- [📱 Pages Overview](#-pages-overview)
- [🔐 Authentication](#-authentication)
- [💳 Payment Integration](#-payment-integration)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📞 Contact](#-contact)

---

## ✨ Features

### 🎓 **Core Functionality**
- **AI-Powered Career Guidance** - Google Gemini integration for intelligent recommendations
- **Event Management** - Browse and book professional workshops, seminars, and training sessions
- **Secure Payment Gateway** - Integrated checkout system for event bookings
- **User Authentication** - Multiple login options including QR code, social logins, and email/phone
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices
- **Dark Mode UI** - Modern, eye-friendly interface with cyan accent theme

### 🔐 **Authentication Features**
- 📱 **QR Code Login** - Quick authentication via QR code scanning
- 🔑 **Social Login Integration**:
  - Google Sign-In
  - Apple ID
  - Telegram
  - Microsoft Account
  - GitHub OAuth
  - Passkey Support
- 📧 **Email/Phone Registration** - Traditional signup with terms acceptance

### 💼 **Platform Features**
- 🏠 **Dynamic Homepage** - Hero section, testimonials, gallery, and event previews
- 🗓️ **Events & Workshops** - Detailed event listings with booking functionality
- 🍽️ **Menu System** - Service catalog and offerings
- 💰 **Payment Checkout** - Professional payment form with multiple methods (Card/PayPal)
- 📊 **Dashboard** - User management and analytics (coming soon)

---

## 🎨 Key Highlights

```
🎯 Modern UI/UX Design        🚀 Lightning Fast Performance
🔒 Secure Authentication      💳 Payment Integration Ready
📱 Fully Responsive           🌓 Dark Theme Optimized
🤖 AI-Powered Features        ⚡ Vite-Powered Development
```

---

## 🛠️ Tech Stack

### **Frontend Framework**
- ⚛️ **React 19.2.0** - Latest React with modern hooks and performance optimizations
- 📘 **TypeScript 5.8.2** - Type-safe development with full IntelliSense support
- ⚡ **Vite 6.2.0** - Next-generation frontend tooling with HMR

### **Styling & UI**
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🎬 **Framer Motion 11.3.1** - Smooth animations and transitions
- 🎯 **Lucide React** - Beautiful, consistent icon system

### **Authentication & Backend**
- 🔐 **Firebase** (Ready for integration)
  - Authentication (Google, Apple, GitHub, Microsoft, Telegram)
  - Firestore Database
  - Cloud Hosting
- 🤖 **Google Gemini API** - AI-powered features and recommendations

### **Additional Libraries**
- 📱 **QRCode.react** - QR code generation for quick login
- 🌐 **React Router** - Client-side routing (custom implementation)

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn package manager
- Google Gemini API key ([Get one here](https://ai.google.dev))

### **One-Line Setup**
```bash
git clone https://github.com/aamirshehzad9/GentleOmegaAI.git && cd GentleOmegaAI && npm install && npm run dev
```

---

## 📦 Installation

### **Step-by-Step Guide**

1️⃣ **Clone the repository**
```bash
git clone https://github.com/aamirshehzad9/GentleOmegaAI.git
cd GentleOmegaAI
```

2️⃣ **Install dependencies**
```bash
npm install
```

3️⃣ **Set up environment variables**
```bash
# Create .env.local file in root directory
echo GEMINI_API_KEY=your_api_key_here > .env.local
```

4️⃣ **Start development server**
```bash
npm run dev
```

5️⃣ **Open in browser**
```
http://localhost:3000
```

---

## 🔑 Environment Setup

Create a `.env.local` file in the project root:

```env
# Google Gemini API Key (Required)
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration (Optional - for production)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

**🔗 Get Your API Keys:**
- [Google Gemini API](https://ai.google.dev) - AI features
- [Firebase Console](https://console.firebase.google.com) - Authentication & hosting

---

## 🎯 Usage

### **Development Commands**

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type checking
npm run type-check

# Lint code
npm run lint
```

### **Project Structure**

```
GentleOmegaAI/
├── components/           # React components
│   ├── home/            # Homepage sections
│   ├── Header.tsx       # Navigation header
│   ├── Footer.tsx       # Footer component
│   ├── HomePage.tsx     # Main landing page
│   ├── MenuPage.tsx     # Services menu
│   ├── LoginPage.tsx    # Authentication (login)
│   ├── SignupPage.tsx   # User registration
│   ├── PaymentCheckout.tsx  # Payment processing
│   └── DashboardPlaceholder.tsx  # Admin dashboard
├── public/              # Static assets
│   └── logo.png         # Gentle Omega AI logo
├── constants.tsx        # App configuration & constants
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main app component & routing
├── index.tsx           # Application entry point
├── .env.local          # Environment variables (create this)
├── firebase.json       # Firebase hosting config
├── .firebaserc         # Firebase project reference
└── DEPLOYMENT_GUIDE.md # Detailed deployment instructions
```

---

## 🌐 Deployment

### **Deploy to Firebase Hosting**

This project is configured for automatic deployment via GitHub Actions.

**🔧 Setup (One-time)**

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase project:
```bash
firebase init hosting
```

4. Deploy:
```bash
npm run build
firebase deploy
```

**📖 For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

### **Custom Domain Setup**
This project is configured for: **gentleomegaai.space**

After deployment, configure DNS:
- Type: `A` → Value: Firebase IP addresses
- Type: `CNAME` → Value: Your Firebase hosting URL

---

## 📱 Pages Overview

| Page | Route | Description | Status |
|------|-------|-------------|--------|
| 🏠 **Home** | `/` | Landing page with hero, features, testimonials | ✅ Live |
| 🍽️ **Menu** | `/menu` | Services and offerings catalog | ✅ Live |
| 📊 **Dashboard** | `/dashboard` | Admin panel (placeholder) | 🚧 Coming Soon |
| 🔐 **Login** | `/login` | User authentication with QR/social login | ✅ Live |
| ✍️ **Signup** | `/signup` | New user registration | ✅ Live |
| 💳 **Checkout** | `/checkout` | Payment processing for bookings | ✅ Live |

---

## 🔐 Authentication

### **Login Options**

**Quick Login:**
- 📱 QR Code scanning (mobile app integration ready)
- 🔑 Social providers (Google, Apple, GitHub, Microsoft, Telegram)
- 🎫 Passkey support

**Traditional Login:**
- 📧 Email address
- 📱 Phone number
- 🔒 Secure password authentication

### **Signup Features**
- Terms of Service acceptance required
- Privacy Policy acknowledgment
- Email/Phone verification (Phase 2)
- Social signup integration ready

**🚧 Note:** Firebase Authentication integration planned for Phase 2

---

## 💳 Payment Integration

### **Current Features**
- Professional checkout UI matching PayPro Global design
- Card payment support
- PayPal integration ready
- Billing information collection
- Business purchase option
- Coupon code support
- Real-time order summary

### **Supported Payment Methods**
- 💳 Credit/Debit Cards
- 💰 PayPal
- 🏢 Business invoicing (coming soon)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### **Ways to Contribute**
1. 🐛 Report bugs
2. 💡 Suggest new features
3. 📝 Improve documentation
4. 🔧 Submit pull requests

### **Development Workflow**

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m 'Add some AmazingFeature'

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

### **Code Style Guidelines**
- Use TypeScript for type safety
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic
- Test before submitting PR

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

### **Project Owner**
👤 **Aamir Shehzad**

- 🐙 GitHub: [@aamirshehzad9](https://github.com/aamirshehzad9)
- 📧 Email: contact@gentleomegaai.space
- 🌐 Website: [gentleomegaai.space](https://gentleomegaai.space)

### **Support**
- 🐛 Issues: [GitHub Issues](https://github.com/aamirshehzad9/GentleOmegaAI/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/aamirshehzad9/GentleOmegaAI/discussions)

---

## 🌟 Show Your Support

If you find this project helpful, please give it a ⭐️ on GitHub!

### **Share the Project**
[![Twitter](https://img.shields.io/badge/Share_on-Twitter-1DA1F2?style=for-the-badge&logo=twitter)](https://twitter.com/intent/tweet?text=Check%20out%20Gentle%20Omega%20AI%20Career%20Platform!&url=https://github.com/aamirshehzad9/GentleOmegaAI)
[![LinkedIn](https://img.shields.io/badge/Share_on-LinkedIn-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/sharing/share-offsite/?url=https://github.com/aamirshehzad9/GentleOmegaAI)

---

## 🗺️ Roadmap

### **Phase 1 (Current)** ✅
- [x] Core UI/UX Implementation
- [x] Authentication Pages
- [x] Payment Checkout
- [x] Firebase Hosting Setup
- [x] Logo & Branding

### **Phase 2 (Next)** 🚧
- [ ] Firebase Authentication Integration
- [ ] Firestore Database Setup
- [ ] Real Social Login Implementation
- [ ] User Profile Management
- [ ] Email Verification

### **Phase 3 (Future)** 📅
- [ ] Payment Gateway Integration (Stripe/PayPal)
- [ ] Event Booking System
- [ ] Admin Dashboard
- [ ] Email Notifications
- [ ] Analytics & Reporting

---

<div align="center">

### 💼 Built with passion for empowering careers through AI

**Gentle Ωmega AI** | Transforming Career Development with Artificial Intelligence

[![Made with React](https://img.shields.io/badge/Made_with-React-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Powered by Gemini](https://img.shields.io/badge/Powered_by-Google_Gemini-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![Hosted on Firebase](https://img.shields.io/badge/Hosted_on-Firebase-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com)

---

⭐ **Star this repo** if you like what you see! ⭐

</div>
