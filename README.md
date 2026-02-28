# MediStore Frontend 💊

> Your Trusted Online Medicine Shop - Customer Interface

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://medistore-client-eta.vercel.app)
[![Frontend Repo](https://img.shields.io/badge/GitHub-Frontend-blue?style=for-the-badge&logo=github)](https://github.com/ambakhtiar/MediStore-Frontend)
[![Backend Repo](https://img.shields.io/badge/GitHub-Backend-green?style=for-the-badge&logo=github)](https://github.com/ambakhtiar/MediStore-Backend)

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Admin Credentials](#admin-credentials)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About

MediStore is a full-stack e-commerce web application for purchasing over-the-counter (OTC) medicines. This repository contains the **frontend** built with Next.js 15, TypeScript, and Tailwind CSS.

**Live Demo:** [https://medistore-client-eta.vercel.app](https://medistore-client-eta.vercel.app)

**Video Demo:** [Watch on Google Drive](https://drive.google.com/file/d/1rUm70KWWNz2Up-CCXjgP0KVZCTt18e9q/view?usp=sharing)

## ✨ Features

### 🌐 Public Features
- 🏠 Homepage with hero section, featured medicines, categories, and testimonials
- 🛍️ Browse all medicines with advanced search and filters
- 🔍 Search by name, category, price range, manufacturer, and stock availability
- 📄 View detailed medicine information
- 📱 Fully responsive design with dark mode support
- 🎨 Custom 404 Not Found page

### 👤 Customer Features
- 🔐 Secure registration and login system
- 🛒 Add medicines to cart with quantity management
- 💳 Checkout with shipping address (Cash on Delivery)
- 📦 View order history with pagination
- 🔎 Track order status in real-time
- ⭐ Leave reviews and ratings for delivered products
- ✏️ Edit and delete own reviews
- 👨‍💼 Manage profile information
- ❌ Order cancellation (before confirmation)
- 🚫 Banned users prevented from login with clear message

### 🏪 Seller Features
- 📊 Dashboard with sales statistics and analytics
- 📝 Add, edit, and delete medicines
- 📦 Manage inventory and stock levels
- 🛍️ View incoming orders with details
- 🔄 Update order status (Processing → Shipped → Delivered)
- 📈 View sales performance

### 👑 Admin Features
- 🎛️ Comprehensive dashboard with platform statistics
- 👥 Manage all users (customers and sellers)
- 🚫 Ban/Unban users (banned users cannot login)
- 💊 View and manage all medicines
- 📦 View and manage all orders
- 🏷️ CRUD operations for medicine categories
- ⭐ View all product reviews

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Form Handling:** TanStack Form
- **State Management:** React Hooks 
- **Authentication:** Better Auth
- **Icons:** Lucide React
- **HTTP Client:** Fetch API
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Backend server running (see [backend repo](https://github.com/ambakhtiar/MediStore-Backend))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ambakhtiar/MediStore-Frontend.git
cd MediStore-Frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration (see [Environment Variables](#environment-variables))

4. **Run development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open in browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Auth routes
│   │   ├── login/
│   │   └── register/
│   ├── admin/             # Admin dashboard routes
│   │   ├── categories/
│   │   ├── orders/
│   │   └── users/
│   ├── seller/            # Seller dashboard routes
│   │   ├── dashboard/
│   │   ├── medicines/
│   │   └── orders/
│   ├── shop/              # Public shop routes
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── orders/            # Order management
│   ├── reviews/           # Review system
│   ├── api/               # API routes (middleware)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── not-found.tsx      # Custom 404 page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── modules/          # Feature-specific components
│   │   ├── homepage/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── review/
│   │   └── dashboard/
│   └── layout/           # Layout components
│       ├── Navbar.tsx
│       └── Footer.tsx
├── lib/                   # Utility functions
│   ├── auth-client.ts    # Better Auth client
│   └── utils.ts          # Helper functions
├── services/             # API service layer
│   ├── medicine.service.ts
│   ├── order.service.ts
│   ├── category.service.ts
│   └── review.service.ts
├── actions/              # Server actions
│   ├── category.action.ts
│   ├── order.action.ts
│   └── review.action.ts
└── types/                # TypeScript types
    ├── medicine.type.ts
    ├── order.type.ts
    └── user.type.ts
```

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# App Configuration (optional)
NEXT_PUBLIC_APP_NAME=MediStore
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Environment Variables Explanation

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Better Auth base URL | Yes |
| `NEXT_PUBLIC_APP_NAME` | Application name | No |
| `NEXT_PUBLIC_APP_URL` | Frontend base URL | No |

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub**
```bash
git push origin main
```

2. **Import project in Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Configure environment variables
- Deploy

3. **Set environment variables in Vercel**
- Go to Project Settings → Environment Variables
- Add all variables from `.env.local`
- Redeploy if needed

### Build for Production

```bash
npm run build
npm run start
```

## 🔑 Admin Credentials

For testing admin features:

```
Email: admin@medistore.com
Password: 11223344
```

**Note:** These are demo credentials for assignment evaluation. Change them in production.

## 📸 Screenshots

### Homepage
![Homepage]("/public/medistore_home_page.jpeg")

### Shop Page
![Seller Dashboard]("/public/medistore_seller_dashboard.jpeg")

### Admin Dashboard
![Admin Dashboard]("/public/medistore_admin_dashboard.jpeg")

## 🤝 Contributing

This is an academic project for Programming Hero Assignment 4. Contributions are welcome for educational purposes.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is created for educational purposes as part of Programming Hero Full-Stack Web Development Course.

## 🔗 Links

- **Backend Repository:** [MediStore-Backend](https://github.com/ambakhtiar/MediStore-Backend)
- **Live Frontend:** [medistore-client-eta.vercel.app](https://medistore-client-eta.vercel.app)
- **Live Backend:** [medistore-server-sepia.vercel.app](https://medistore-server-sepia.vercel.app)
- **Demo Video:** [Google Drive](https://drive.google.com/file/d/1rUm70KWWNz2Up-CCXjgP0KVZCTt18e9q/view?usp=sharing)

## 👨‍💻 Developer

**Abdullah Muhammad Bakhtiar**
- GitHub: [@ambakhtiar](https://github.com/ambakhtiar)
- Project: MediStore - Programming Hero Assignment 4

---

Made with ❤️ for Programming Hero Assignment 4 