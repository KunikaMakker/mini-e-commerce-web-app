# Curated Essentials - Mini E-Commerce Storefront
A high-performance, polished mini e-commerce storefront showcasing luxury design principles, modular Sass structure, and deep-linked state synchronization. Built using **React**, **Vite (TypeScript)**, and dedicated **Sass/SCSS Modules** without Tailwind CSS.

---

## 🎨 Design Philosophy & Features
1.  **Dynamic Infinite Sizing & Grid layout**: Responsive card layout displaying product images, brands, names, and original crossout pricing fetched dynamically.
2.  **Deterministic Variant State Mesh**: Generates deterministic colors, sizes, and stock values based on product IDs.
3.  **Visual Stock Configurations**: Sizes show active states, low stock (warning accents with item count left), or custom sold-out styling (crossed out with selection disabled).
4.  **Deep Linkable Detail Layouts**: Selected color swatches and size buttons are synchronized directly to URL queries.
5.  **Tactile Cart Drawer actions**: Slides in seamlessly, allowing real-time quantity adjustments (capped at available variant stock), items removal, and bill totals calculation. Cart state is rehydrated automatically from `localStorage`.
6.  **Simulated Network Friction (Bonus Challenge)**: Intentionally wires up card "Quick Add" and Detail "Add to Cart" to an asynchronous mock function with a simulated delay and an occasional 4% random network error state, which gracefully triggers responsive error-retry components in the UI.

---

## 🛠️ Technology Stack

*   **Runtime**: React 18+ (Hooks only, no class components)
*   **Module Bundler**: Vite (TypeScript type stripped)
*   **Styling**: Pure Sass/SCSS Modules (`*.module.scss`), nested styles, responsive breakpoint mixins (zero Tailwind, zero CSS-in-JS).
*   **State Containers**: React Context API
*   **Routing & Deep Linking**: React Router v6

---

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
