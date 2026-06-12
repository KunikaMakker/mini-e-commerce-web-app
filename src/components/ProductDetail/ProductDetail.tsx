import React, { useCallback, useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Check, AlertTriangle, Sparkles } from "lucide-react";
import { Product } from "../../types";
import { getProductVariants, getProductImages, enrichProduct } from "../../data/variants";
import { useFetch } from "../../hooks/useFetch";
import { useCart } from "../../stores/CartContext";
import { Loader } from "../Loader/Loader";
import { ErrorState } from "../ErrorState/ErrorState";
import styles from "./ProductDetail.module.scss";

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState<string>("");

  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);
  const [actionState, setActionState] = useState<"idle" | "success" | "error">("idle");

  const productId = Number(id);
  const productUrl = Number.isNaN(productId)
    ? null
    : `https://fakestoreapi.com/products/${productId}`;

  const transformProduct = useCallback((data: any) => enrichProduct(data), []);

  const {
    data: fetchedProduct,
    loading,
    error: fetchError,
    refetch,
  } = useFetch<Product | null>(productUrl, {
    transform: transformProduct,
  });

  useEffect(() => {
    if (!fetchedProduct) {
      if (Number.isNaN(productId)) {
        setProduct(null);
      }
      return;
    }

    setProduct(fetchedProduct);

    const imgs = getProductImages(fetchedProduct.id, fetchedProduct.category, fetchedProduct.image);
    setImages(imgs);
    setActiveImage(fetchedProduct.image);

    const vars = getProductVariants(fetchedProduct.id, fetchedProduct.category);
    let colorVal = searchParams.get("color");
    let sizeVal = searchParams.get("size");

    const hasValidColor = Boolean(colorVal && vars.colors.includes(colorVal));
    const hasValidSize = Boolean(sizeVal && vars.sizes.includes(sizeVal));

    if (!hasValidColor || !hasValidSize) {
      const firstInStock = vars.stockCombinations.find((combo) => combo.stock > 0) || vars.stockCombinations[0];

      if (!hasValidColor) colorVal = firstInStock.color;
      if (!hasValidSize) sizeVal = firstInStock.size;
    }

    const nextColor = colorVal || vars.colors[0];
    const nextSize = sizeVal || vars.sizes[0];

    setSelectedColor(nextColor);
    setSelectedSize(nextSize);

    if (searchParams.get("color") !== nextColor || searchParams.get("size") !== nextSize) {
      setSearchParams({ color: nextColor, size: nextSize }, { replace: true });
    }
  }, [fetchedProduct, productId, searchParams, setSearchParams]);

  const handleVariantChange = (color: string, size: string) => {
    setSelectedColor(color);
    setSelectedSize(size);
    setQuantity(1); // Reset selected quantity to 1 when changing variants
    setSearchParams({ color, size }, { replace: true });
  };

  if (loading) {
    return <Loader type="page" />;
  }

  const errorMessage = Number.isNaN(productId)
    ? "Invalid Product Identifier."
    : fetchError || "Failed to retrieve this product detail.";

  if (fetchError || !product) {
    return (
      <div className={styles.errorContainer}>
        <ErrorState message={errorMessage} onRetry={refetch} />
        <Link to="/" className={styles.backButton}>
          <ArrowLeft size={16} /> Go Back to Store
        </Link>
      </div>
    );
  }

  const variants = getProductVariants(product.id, product.category);

  const getStockCountForSize = (sizeName: string) => {
    const match = variants.stockCombinations.find(
      (c) => c.color === selectedColor && c.size === sizeName
    );
    return match ? match.stock : 0;
  };

  const currentVariantStock = getStockCountForSize(selectedSize);
  const isVariantSoldOut = currentVariantStock === 0;

  const handleAddToCart = async () => {
    if (isVariantSoldOut || isAdding) return;

    setIsAdding(true);
    setActionState("idle");

    await new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const failTrigger = Math.random() < 0.04; // 4% simulated error rate
        if (failTrigger) {
          reject(new Error("Database connection transaction timed out."));
        } else {
          resolve();
        }
      }, 800);
    })
      .then(() => {
        addToCart({
          productId: product.id,
          title: product.title,
          image: product.image,
          price: product.price,
          color: selectedColor,
          size: selectedSize,
          quantity: quantity,
          stockLimit: currentVariantStock,
        });
        setActionState("success");
      })
      .catch((err) => {
        console.warn("Async Add to Cart simulation failed:", err);
        setActionState("error");
      })
      .finally(() => {
        setIsAdding(false);
        setTimeout(() => {
          setActionState("idle");
        }, 1800);
      });
  };

  return (
    <div className={`${styles.wrapper} fade-in`}>
      <div className={styles.navRow}>
        <Link to="/" className={styles.backLink}>
          <ArrowLeft size={16} strokeWidth={1.8} />
          Back to Collections
        </Link>
      </div>

      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div className={styles.mainCanvas}>
            <img 
              src={activeImage} 
              alt={product.title} 
              className={styles.mainImage} 
              referrerPolicy="no-referrer" 
            />
            {product.originalPrice && !isVariantSoldOut && (
              <span className={styles.saleTag}>SPECIAL EDITION</span>
            )}
          </div>
          
          <div className={styles.thumbnails}>
            {images.map((imgUrl, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.thumbBtn} ${activeImage === imgUrl ? styles.activeThumb : ""}`}
                onClick={() => setActiveImage(imgUrl)}
                aria-label={`View thumbnail ${index + 1}`}
              >
                <img src={imgUrl} alt="Product detail perspective" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.infoCol}>
          <div className={styles.identity}>
            <span className={styles.categoryName}>{product.category}</span>
            <div className={styles.brandTitleRow}>
              <span className={styles.brandName}>{product.brand}</span>
              <h1 className={styles.title} id="product-detail-title">{product.title}</h1>
            </div>

            <div className={styles.priceContainer}>
              {product.originalPrice ? (
                <div className={styles.priceSplit}>
                  <span className={styles.currentSalePrice}>
                    ${product.price.toFixed(2)}
                  </span>
                  <span className={styles.originalSlashedPrice}>
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className={styles.discountBadge}>
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </div>
              ) : (
                <span className={styles.singularPrice}>
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.optionSection}>
            <h4 className={styles.optionLabel}>
              Color: <span className={styles.optionValue}>{selectedColor}</span>
            </h4>
            <div className={styles.swatchGrid} id="color-swatch-list">
              {variants.colors.map((color) => {
                const swatchBackground = variants.swatches[color] || "#CCCCCC";
                const isActive = selectedColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    className={`${styles.swatchBtn} ${isActive ? styles.activeSwatch : ""}`}
                    style={{ background: swatchBackground }}
                    onClick={() => handleVariantChange(color, selectedSize)}
                    title={color}
                    aria-label={`Select color ${color}`}
                  ></button>
                );
              })}
            </div>
          </div>

          <div className={styles.optionSection}>
            <h4 className={styles.optionLabel}>
              Size: <span className={styles.optionValue}>{selectedSize}</span>
            </h4>
            <div className={styles.sizeGrid} id="size-swatch-list">
              {variants.sizes.map((size) => {
                const stock = getStockCountForSize(size);
                const isSizeSoldOut = stock === 0;
                const isLowStock = stock > 0 && stock <= 3;
                const isActive = selectedSize === size;

                let sizeStyleClass = styles.sizeBtn;
                if (isActive) {
                  sizeStyleClass += ` ${styles.activeSize}`;
                }
                if (isSizeSoldOut) {
                  sizeStyleClass += ` ${styles.soldOutSize}`;
                } else if (isLowStock) {
                  sizeStyleClass += ` ${styles.lowStockSize}`;
                }

                return (
                  <button
                    key={size}
                    type="button"
                    className={sizeStyleClass}
                    onClick={() => !isSizeSoldOut && handleVariantChange(selectedColor, size)}
                    disabled={isSizeSoldOut}
                    aria-label={`Select size ${size}`}
                  >
                    <span className={styles.sizeNameLabel}>{size}</span>
                    {isSizeSoldOut && <span className={styles.stockLabelLine}>Sold Out</span>}
                    {isLowStock && <span className={styles.stockLabelLine}>{stock} left</span>}
                    {!isSizeSoldOut && !isLowStock && <span className={styles.stockLabelLine}>In Stock</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.purchaseControls}>
            <div className={styles.quantitySection}>
              <span className={styles.qtyLabel}>Quantity:</span>
              <div className={styles.quantityPickerBtn}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isVariantSoldOut}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className={styles.quantityValueText}>{isVariantSoldOut ? 0 : quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(currentVariantStock, quantity + 1))}
                  disabled={quantity >= currentVariantStock || isVariantSoldOut}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {actionState === "error" && (
              <div className={styles.actionNoticeError} id="action-error-toast">
                <AlertTriangle size={16} />
                <span>Quick Add failed due to simulated network friction. Please retry.</span>
              </div>
            )}

            <button
              type="button"
              className={`${styles.cartCTA} ${
                actionState === "success" ? styles.successCTA : actionState === "error" ? styles.errorCTA : ""
              }`}
              onClick={handleAddToCart}
              disabled={isVariantSoldOut || isAdding}
              id="detail-add-to-cart-cta"
            >
              {isAdding ? (
                <span className={styles.btnSpinner}></span>
              ) : actionState === "success" ? (
                <>
                  <Check size={18} />
                  Added To Cart
                </>
              ) : actionState === "error" ? (
                <>
                  <AlertTriangle size={18} />
                  Retry Add
                </>
              ) : isVariantSoldOut ? (
                "Sold Out In Selected Variant"
              ) : (
                <>
                  <ShoppingCart size={18} />
                  Add to Cart — ${(product.price * quantity).toFixed(2)}
                </>
              )}
            </button>

            {!isVariantSoldOut && (
              <p className={styles.deliveryStatus}>
                <Sparkles size={14} className={styles.sparkle} />
                {currentVariantStock <= 3 
                  ? `Hurry, only ${currentVariantStock} pieces of this variant are remaining.`
                  : "Complimentary direct courier shipping included with this collection."}
              </p>
            )}
          </div>

          <div className={styles.divider}></div>

          <div className={styles.descriptionSection}>
            <h4 className={styles.descTitle}>Product Specifications</h4>
            <p className={styles.descBody}>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
