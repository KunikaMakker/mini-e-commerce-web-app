import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Check, AlertTriangle } from "lucide-react";
import { Product } from "../../types";
import { getProductVariants } from "../../data/variants";
import { useCart } from "../../stores/CartContext";
import styles from "./ProductCard.module.scss";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [addState, setAddState] = useState<"idle" | "success" | "error">("idle");

  const variants = getProductVariants(product.id, product.category);

  const availableVariant = variants.stockCombinations.find((combo) => combo.stock > 0);
  const isSoldOut = !availableVariant;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault(); // Stop navigation to detail page
    if (isSoldOut || !availableVariant || isAdding) return;

    setIsAdding(true);
    setAddState("idle");

    await new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const isFailure = Math.random() < 0.04; // 4% simulated failure rate
        if (isFailure) {
          reject(new Error("Network connection flubbed"));
        } else {
          resolve();
        }
      }, 700);
    })
      .then(() => {
        addToCart({
          productId: product.id,
          title: product.title,
          image: product.image,
          price: product.price,
          color: availableVariant.color,
          size: availableVariant.size,
          quantity: 1,
          stockLimit: availableVariant.stock,
        });
        setAddState("success");
      })
      .catch((err) => {
        console.warn("Cart integration failed simulated network failure:", err);
        setAddState("error");
      })
      .finally(() => {
        setIsAdding(false);
        setTimeout(() => {
          setAddState("idle");
        }, 1500);
      });
  };

  let discountPercentage = 0;
  if (product.originalPrice) {
    discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }

  return (
    <div className={styles.card} id={`product-card-${product.id}`}>
      <div className={styles.imageWrapper}>
        <Link to={`/product/${product.id}`} className={styles.imageLink}>
          <img 
            src={product.image} 
            alt={product.title} 
            className={styles.image} 
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </Link>

        {isSoldOut && (
          <div className={styles.soldOutBadge} id={`soldout-badge-${product.id}`}>
            Sold Out
          </div>
        )}

        {!isSoldOut && product.originalPrice && (
          <div className={styles.saleBadge}>
            Sale -{discountPercentage}%
          </div>
        )}
      </div>

      <div className={styles.details}>
        <div className={styles.brand}>{product.brand}</div>
        
        <Link to={`/product/${product.id}`} className={styles.titleLink}>
          <h3 className={styles.title} title={product.title}>
            {product.title}
          </h3>
        </Link>

        <div className={styles.purchaseRow}>
          <div className={styles.priceColumn}>
            {product.originalPrice ? (
              <div className={styles.priceRow}>
                <span className={styles.slashedPrice}>
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className={styles.salePrice}>
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className={styles.normalPrice}>
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            type="button"
            className={`${styles.quickAddBtn} ${
              addState === "success" ? styles.successBtn : addState === "error" ? styles.errorBtn : ""
            }`}
            onClick={handleQuickAdd}
            disabled={isSoldOut || isAdding}
            aria-label="Quick Add to Cart"
          >
            {isAdding ? (
              <span className={styles.miniSpinner}></span>
            ) : addState === "success" ? (
              <Check size={14} strokeWidth={3} />
            ) : addState === "error" ? (
              <AlertTriangle size={14} strokeWidth={2.5} />
            ) : (
              <ShoppingCart size={14} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
