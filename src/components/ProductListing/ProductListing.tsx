import React, { useCallback, useState } from "react";
import { Product } from "../../types";
import { enrichProduct } from "../../data/variants";
import { useFetch } from "../../hooks/useFetch";
import { ProductCard } from "../ProductCard/ProductCard";
import { Loader } from "../Loader/Loader";
import { ErrorState } from "../ErrorState/ErrorState";
import styles from "./ProductListing.module.scss";

export const ProductListing: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const transformProducts = useCallback((data: any[]) => data.map((item: any) => enrichProduct(item)), []);

  const { data: products = [], loading, error, refetch } = useFetch<Product[]>(
    "https://fakestoreapi.com/products",
    {
      transform: transformProducts,
    }
  );

  // Filter Categories Mapper
  const categoriesList = [
    { id: "all", label: "All Items" },
    { id: "women's clothing", label: "Women's" },
    { id: "men's clothing", label: "Men's" },
    { id: "jewelery", label: "Jewelry" },
    { id: "electronics", label: "Electronics" },
  ];

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter((p) => p.category === activeCategory);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <div className={styles.heroPre}>Curated Everyday Objects</div>
          <h1 className={styles.heroTitle}>Studio Collections</h1>
        </div>
        <div className={styles.filterBarSkeleton}></div>
        <Loader type="skeleton" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className={`${styles.container} fade-in`}>
      <div className={styles.heroSection}>
        <span className={styles.heroPre}>Curated Everyday Objects</span>
        <h1 className={styles.heroTitle}>Studio Collections</h1>
        <p className={styles.heroDesc}>
          Thoughtfully crafted essentials designed to complement a modern lifestyle,
          merging structural precision with sensory material comfort.
        </p>
      </div>

      <div className={styles.filterWrap}>
        <div className={styles.filterBar}>
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.activeFilter : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className={styles.counter}>
          {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className={styles.noItems}>
          <p>No products found in this selection.</p>
        </div>
      ) : (
        <div className={styles.grid} id="products-listing-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
