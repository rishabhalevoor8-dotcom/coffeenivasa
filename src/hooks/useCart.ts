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
    setItems((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((name: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.name === name);
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.name === name ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter((i) => i.name !== name);
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemQuantity = useCallback(
    (name: string) => items.find((i) => i.name === name)?.quantity || 0,
    [items]
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/[₹,]/g, ''));
    return sum + price * item.quantity;
  }, 0);

  const generateWhatsAppMessage = useCallback(() => {
    if (items.length === 0) return '';
    
    let message = `🛒 *New Order from Coffee Nivasa Website*\n\n`;
    message += `*Order Details:*\n`;
    message += `─────────────────\n`;
    
    items.forEach((item, index) => {
      const itemTotal = parseInt(item.price.replace(/[₹,]/g, '')) * item.quantity;
      message += `${index + 1}. ${item.name}\n`;
      message += `   Qty: ${item.quantity} × ${item.price} = ₹${itemTotal}\n`;
    });
    
    message += `─────────────────\n`;
    message += `*Total: ₹${totalPrice}*\n\n`;
    message += `Please confirm my order. Thank you! 🙏`;
    
    return encodeURIComponent(message);
  }, [items, totalPrice]);

  const whatsappOrderUrl = `https://wa.me/919663025408?text=${generateWhatsAppMessage()}`;

  return {
    items,
    addItem,
    removeItem,
    clearCart,
    getItemQuantity,
    totalItems,
    totalPrice,
    whatsappOrderUrl,
  };
}
