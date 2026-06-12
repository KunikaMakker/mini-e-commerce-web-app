import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartProvider, useCart } from '../stores/CartContext';

function QuantityReader() {
  const { cart, updateQuantity } = useCart();

  return (
    <>
      <span data-testid="quantity">{cart[0]?.quantity ?? 0}</span>
      <button onClick={() => updateQuantity('1-Black-M', 99)}>Set high quantity</button>
    </>
  );
}

describe('CartContext quantity handling', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('caps the quantity at the available stock limit', () => {
    localStorage.setItem(
      'mini_eshop_cart_items',
      JSON.stringify([
        {
          id: '1-Black-M',
          productId: 1,
          title: 'Test Item',
          image: 'https://example.com/test.png',
          price: 10,
          color: 'Black',
          size: 'M',
          quantity: 2,
          stockLimit: 3,
        },
      ])
    );

    render(
      <CartProvider>
        <QuantityReader />
      </CartProvider>
    );

    expect(screen.getByTestId('quantity')).toHaveTextContent('2');

    fireEvent.click(screen.getByRole('button', { name: /set high quantity/i }));

    expect(screen.getByTestId('quantity')).toHaveTextContent('3');
  });
});
