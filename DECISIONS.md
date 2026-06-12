# Architectural Decisions & Trade-Offs

## 1. Deterministic Variant Modeling
**The Challenge**: The *Fake Store API* lacks native SKU variants such as size, color, and stock level. To support swatches, low-stock states, sold-out combinations, and deep-linkable URLs, the product variant model needed to be generated rather than hardcoded.

**The Options**:
*   **Option A**: Hardcode variant lists directly in local state or mock product data.
*   **Option B**: Generate variants deterministically from the product ID and category schema, including high-contrast swatches, size options, stock values, and supporting imagery.

**Our Choice**: We chose **Option B**. Using a deterministic hashing approach (for example, `id * 11 + idx * 17`) keeps the variant set stable across page transitions, deep links, and cart rehydration. It also makes it possible to reproduce realistic states such as "Low Stock" and "Sold Out" in a consistent way.

---

## 2. Deep-Linkable Variant State
**The Challenge**: The selected color and size should remain preserved when a product page URL is shared or reloaded.

**The Options**:
*   **Option A**: Encode the variant state in route path parameters such as `/product/:id/:color/:size`.
*   **Option B**: Store the selected variant in query parameters such as `?color=Charcoal&size=M` using `useSearchParams`.

**Our Choice**: We chose **Option B**. Query parameters fit modern e-commerce patterns for variant selection better than route path parameters, while also making fallback handling for missing or invalid values more straightforward and robust.

---

## 3. What We Would Improve with More Time
1.  **Server-Side API Caching**: Add a cache or proxy in front of the public *Fake Store API* to reduce rate-limit issues and improve resilience.
2.  **Vitest Variant Assertions**: Add tests to confirm that sold-out variants are correctly disabled and display the expected status.
3.  **Mobile Drawer Interactions**: Improve the cart drawer with swipe-to-close behavior and smoother mobile interactions.
