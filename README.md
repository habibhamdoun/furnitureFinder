# Furniture Finder

A modern cross-platform app to browse, search, and shop for furniture. Built with Expo, React Native, and TypeScript.

---

## 🚀 Installation & Running

1. **Clone the repository**

   ```bash
   git clone https://github.com/habibhamdoun/furnitureFinder.git
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the app**

   ```bash
   npm start
   # or
   npx expo start
   ```

> Requires [Node.js](https://nodejs.org/), [npm](https://www.npmjs.com/), and [Expo CLI](https://docs.expo.dev/get-started/installation/) (install with `npm install -g expo-cli`).

---

## Features Implemented

- **User Authentication**
  - Simple login flow (demo credentials)
  - Persistent user session

- **Product Browsing**
  - Home screen with featured items and categories
  - Products tab with full product list
  - Product detail view with images, description, and price

- **Search & Filter**
  - Search products by name or description
  - Filter by price range
  - Sort by price or name

- **Favorites**
  - Add/remove products to favorites
  - View all favorite products in a dedicated tab
  - Favorites are persisted per user

- **Shopping Cart**
  - Add/remove products to cart
  - Update item quantities
  - View cart total and item count
  - Demo checkout flow (no real payment)

- **Profile & Settings**
  - View user profile
  - Switch between light and dark theme
  - Update profile image (demo)
  - Logout

- **Modern UI/UX**
  - Responsive design for mobile and web
  - Custom splash screen
  - Toast notifications for actions
  - Smooth navigation with bottom tabs

---

## Project Structure

- `app/` — App screens and navigation (file-based routing)
- `components/` — Reusable UI components
- `hooks/` — Custom React hooks (auth, cart, favorites, theme)
- `services/` — API and data fetching logic
- `constants/` — Static data and color themes
- `assets/` — Images and fonts

---

## Notes

- This is a demo app. No real backend or payment integration.
- All data is stored locally using AsyncStorage.
- For development only. Not production-ready.

---

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
