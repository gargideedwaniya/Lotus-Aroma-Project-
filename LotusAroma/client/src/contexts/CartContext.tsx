import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number, size: string) => void;
  updateItemQuantity: (id: number, size: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedItems = localStorage.getItem('cart');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  const addItem = (item: CartItem) => {
    setItems((currentItems) => {
      // Check if item already exists in cart (with same id AND size)
      const existingItemIndex = currentItems.findIndex(
        (i) => i.id === item.id && i.size === item.size
      );
      
      if (existingItemIndex >= 0) {
        // If item exists, update quantity
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        return updatedItems;
      } else {
        // If item doesn't exist, add it
        return [...currentItems, item];
      }
    });
  };
  
  const removeItem = (id: number, size: string) => {
    setItems((currentItems) => 
      currentItems.filter((item) => !(item.id === id && item.size === size))
    );
  };
  
  const updateItemQuantity = (id: number, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id, size);
      return;
    }
    
    setItems((currentItems) => 
      currentItems.map((item) => 
        item.id === id && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };
  
  const clearCart = () => {
    setItems([]);
  };
  
  const value = {
    items,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
