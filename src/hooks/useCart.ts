import { useState, useCallback } from 'react';

export interface CartItem {
  name: string;
  price: string;
  quantity: number;
  isVeg: boolean;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: { name: string; price: string; isVeg: boolean }) => {
    setItems((current) => {
      const existingItem = current.find((i) => i.name === item.name);
      if (existingItem) {
        return current.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((name: string) => {
    setItems((current) => {
      const existingItem = current.find((i) => i.name === name);
      if (existingItem && existingItem.quantity > 1) {
        return current.map((i) =>
          i.name === name ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return current.filter((i) => i.name !== name);
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemQuantity = useCallback(
    (name: string) => {
      return items.find((i) => i.name === name)?.quantity || 0;
    },
    [items]
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/[₹,]/g, ''));
    return sum + price * item.quantity;
  }, 0);

  return {
    items,
    addItem,
    removeItem,
    clearCart,
    getItemQuantity,
    totalItems,
    totalPrice,
  };
}
