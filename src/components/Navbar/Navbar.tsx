import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../../stores/CartContext";
import styles from "./Navbar.module.scss";

export const Navbar: React.FC = () => {
  const { cartCount, setCartOpen, isCartOpen } = useCart();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Brand Logo */}
        <Link to="/" className={styles.logo}>
          ESSENTIALS <span className={styles.tag}>STUDIO</span>
        </Link>

        {/* Action Controls */}
        <nav className={styles.navActions}>
          <button 
            type="button"
            className={styles.cartButton}
            onClick={() => setCartOpen(!isCartOpen)}
            aria-label="Open Cart"
            id="navbar-cart-trigger"
          >
            <ShoppingBag size={20} strokeWidth={1.8} />
            {cartCount > 0 && (
              <span className={styles.badge} id="cart-badge-count">
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
