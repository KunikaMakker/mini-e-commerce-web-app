import React, { useState } from "react";
import { X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../../stores/CartContext";
import styles from "./CartDrawer.module.scss";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartTotal,
    clearCart,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate real server order dispatch
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      clearCart();
    }, 1800);
  };

  const closeDrawer = () => {
    setCartOpen(false);
    // Reset success banner state shortly after closing
    setTimeout(() => {
      setCheckoutComplete(false);
    }, 300);
  };

  return (
    <div className={styles.backdrop} onClick={closeDrawer} id="cart-drawer-backdrop">
      <div 
        className={styles.drawer} 
        onClick={(e) => e.stopPropagation()}
        id="cart-drawer-container"
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Your Cart</h2>
          <button 
            type="button" 
            className={styles.closeBtn} 
            onClick={closeDrawer}
            aria-label="Close Cart"
          >
            <X size={20} />
          </button>
        </div>

        {checkoutComplete ? (
          <div className={styles.successState}>
            <div className={styles.successSymbol}>✓</div>
            <h3>Order Received</h3>
            <p>Thank you for your order. We have received your purchase and are preparing your collection.</p>
            <button className={styles.shopBtn} onClick={closeDrawer}>
              Continue Browsing
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyMsg}>Your shopping cart is currently empty.</p>
            <button className={styles.shopBtn} onClick={closeDrawer}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Scrollable list */}
            <div className={styles.itemList}>
              {cart.map((item) => (
                <div key={item.id} className={styles.cartItem} id={`cart-item-${item.id}`}>
                  <div className={styles.imageBox}>
                    <img src={item.image} alt={item.title} referrerPolicy="no-referrer" />
                  </div>
                  
                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeader}>
                      <h4 className={styles.itemName}>{item.title}</h4>
                      <button 
                        type="button" 
                        className={styles.removeBtn}
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className={styles.itemVariant}>
                      Color: {item.color} • Size: {item.size}
                    </p>

                    <div className={styles.itemRow}>
                      <div className={styles.qtyPicker}>
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stockLimit}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className={styles.itemPrice}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                    {item.quantity >= item.stockLimit && (
                      <p className={styles.stockAlert}>Capped at available variant stock ({item.stockLimit} left)</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span className={styles.freeLabel}>Calculated at next step</span>
              </div>
              <div className={styles.separator}></div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>

              <button 
                type="button" 
                className={styles.checkoutBtn}
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <span className={styles.loaderBtn}>Checking Out...</span>
                ) : (
                  <>
                    Secure Checkout
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
