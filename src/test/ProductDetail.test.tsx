import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockProduct, mockVariants } = vi.hoisted(() => ({
  mockProduct: {
    id: 1,
    title: 'Test Product',
    price: 10,
    description: 'A product for testing.',
    category: 'electronics',
    image: 'https://example.com/test.png',
    rating: { rate: 4.5, count: 8 },
    brand: 'Demo Brand',
    originalPrice: 12,
  },
  mockVariants: {
    colors: ['Midnight Black'],
    sizes: ['S', 'M'],
    swatches: { 'Midnight Black': '#000000' },
    stockCombinations: [
      { color: 'Midnight Black', size: 'S', stock: 0 },
      { color: 'Midnight Black', size: 'M', stock: 1 },
    ],
  },
}));

vi.mock('../hooks/useFetch', () => ({
  useFetch: vi.fn(() => ({
    data: mockProduct,
    loading: false,
    error: null,
    refetch: vi.fn(),
  })),
}));

vi.mock('../stores/CartContext', () => ({
  useCart: () => ({ addToCart: vi.fn() }),
}));

vi.mock('../components/Loader/Loader', () => ({
  Loader: () => <div>Loading</div>,
}));

vi.mock('../components/ErrorState/ErrorState', () => ({
  ErrorState: () => <div>Error</div>,
}));

vi.mock('../data/variants', async () => {
  const actual = await vi.importActual<typeof import('../data/variants')>('../data/variants');

  return {
    ...actual,
    enrichProduct: (data: unknown) => data,
    getProductImages: vi.fn(() => ['img-1', 'img-2', 'img-3']),
    getProductVariants: vi.fn(() => mockVariants),
  };
});

import { ProductDetail } from '../components/ProductDetail';

describe('ProductDetail variant behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('marks sold-out variants and disables the add-to-cart CTA', () => {
    render(
      <MemoryRouter initialEntries={['/product/1?color=Midnight+Black&size=S']}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Select size S')).toBeDisabled();
    expect(screen.getByText('Sold Out')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled();
  });
});
