# Curated Essentials - Mini E-Commerce Storefront
A high-performance, polished mini e-commerce storefront showcasing luxury design principles, modular Sass structure, and deep-linked state synchronization. Built using **React**, **Vite (TypeScript)**, and dedicated **Sass/SCSS Modules** without Tailwind CSS.

## 🌐 Live Demo
Open the deployed version here:
https://mini-e-commerce-web-app.vercel.app/

---

## 🎨 Design Philosophy & Features
1.  **Dynamic Product Grid**: Displays product images, brand names, prices, and sale styling pulled from the Fake Store API.
2.  **Deterministic Variant State Mesh**: Generates deterministic colors, sizes, and stock values based on product IDs to keep SKU behavior consistent.
3.  **Visual Stock Configurations**: Sizes show active states, low-stock warnings, or sold-out styling with disabled controls.
4.  **Deep-Linkable Product Detail Pages**: Selected color and size values are synchronized directly to the URL query string.
5.  **Persistent Cart State**: The shopping cart is saved in `localStorage`, so items remain available across refreshes.
6.  **Simulated Network Friction**: The add-to-cart flow includes a brief async delay and a small error simulation to demonstrate graceful UI recovery.

## 🧭 Design Decisions & Trade-Offs
- The variant model is generated deterministically rather than hardcoded to keep the UI reproducible and easy to test.
- Query-string variant selection is preferred over path-based parameters because it fits e-commerce flows and simplifies URL state handling.
- The app uses the public Fake Store API directly, which keeps setup simple but means external availability and rate limits are outside the project’s control.
- The cart drawer uses local persistence for convenience, but a real production app would usually add a backend or server-side cart sync.

---

## 🛠️ Technology Stack

*   **Runtime**: React 18+ (Hooks only, no class components)
*   **Module Bundler**: Vite (TypeScript type stripped)
*   **Styling**: Pure Sass/SCSS Modules (`*.module.scss`), nested styles, responsive breakpoint mixins (zero Tailwind, zero CSS-in-JS).
*   **State Containers**: React Context API
*   **Routing & Deep Linking**: React Router v6

---

## 📁 Folder Structure
- src/components/ — reusable UI blocks such as the navbar, product cards, and cart drawer
- src/data/ — variant generation and product enrichment logic
- src/hooks/ — custom hooks such as the fetch layer
- src/stores/ — cart context and shopping cart state management
- src/styles/ — shared Sass variables and global styles
- src/test/ — component and cart behavior tests

## ⚙️ Installation & Local Setup

Deploy and test this storefront locally in seconds:

1.  **Clone the Repository**:
    ```bash
    git clone <repository-link>
    cd mini-e-commerce-web-app
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Boot the development server**:
    ```bash
    npm run dev
    ```
    *Open [http://localhost:3000](http://localhost:3000) to view the storefront.*

4.  **Production Compile & Build**:
    ```bash
    npm run build
    ```
    *Build completed outputs are saved inside the `dist/` directory.*

5.  **Code Verification**:
    ```bash
    npm run lint
    ```
    *Runs strict TypeScript static analysis to ensure type safety.*
