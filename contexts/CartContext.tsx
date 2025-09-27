
import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { CartItem, GuestOrder, MenuItem, SelectedOption } from '../types';

interface CartContextType {
  guests: GuestOrder[];
  addGuest: () => void;
  addItemToSeat: (seat: number, item: MenuItem, qty: number, options: SelectedOption[], notes: string) => void;
  removeItemFromSeat: (seat: number, cartItemId: string) => void;
  updateItemQuantity: (seat: number, cartItemId: string, newQty: number) => void;
  getSeatSubtotal: (seat: number) => number;
  getTotalItems: () => number;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  allergies: string[];
  toggleAllergy: (allergy: string) => void;
  clearCart: () => void;
  tableId: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode, tableId: string }> = ({ children, tableId }) => {
  const [guests, setGuests] = useState<GuestOrder[]>([{ seat: 1, items: [] }]);
  const [orderNotes, setOrderNotes] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);
  
  const addGuest = () => {
    setGuests(prev => [...prev, { seat: prev.length + 1, items: [] }]);
  };

  const addItemToSeat = (seat: number, item: MenuItem, qty: number, options: SelectedOption[], notes: string) => {
    const newCartItem: CartItem = {
      id: `${Date.now()}-${Math.random()}`,
      menuItem: item,
      qty,
      options,
      notes
    };

    setGuests(prev => prev.map(g => 
      g.seat === seat 
      ? { ...g, items: [...g.items, newCartItem] }
      : g
    ));
  };

  const removeItemFromSeat = (seat: number, cartItemId: string) => {
    setGuests(prev => prev.map(g => 
        g.seat === seat
        ? { ...g, items: g.items.filter(item => item.id !== cartItemId) }
        : g
    ));
  };
  
  const updateItemQuantity = (seat: number, cartItemId: string, newQty: number) => {
    if(newQty <= 0) {
      removeItemFromSeat(seat, cartItemId);
      return;
    }
    setGuests(prev => prev.map(g =>
      g.seat === seat
      ? { ...g, items: g.items.map(item => item.id === cartItemId ? {...item, qty: newQty} : item) }
      : g
    ));
  };

  const getSeatSubtotal = (seat: number): number => {
    const guest = guests.find(g => g.seat === seat);
    if (!guest) return 0;
    return guest.items.reduce((total, item) => {
        const optionsPrice = item.options.reduce((sum, opt) => sum + (opt.price_delta || 0), 0);
        return total + (item.menuItem.price + optionsPrice) * item.qty;
    }, 0);
  };
  
  const getTotalItems = () => {
    return guests.reduce((total, guest) => total + guest.items.reduce((seatTotal, item) => seatTotal + item.qty, 0), 0);
  };

  const toggleAllergy = (allergy: string) => {
    setAllergies(prev => 
      prev.includes(allergy)
      ? prev.filter(a => a !== allergy)
      : [...prev, allergy]
    );
  };

  const clearCart = () => {
    setGuests([{ seat: 1, items: [] }]);
    setOrderNotes('');
    setAllergies([]);
  };

  const contextValue = useMemo(() => ({
    guests,
    addGuest,
    addItemToSeat,
    removeItemFromSeat,
    updateItemQuantity,
    getSeatSubtotal,
    getTotalItems,
    orderNotes,
    setOrderNotes,
    allergies,
    toggleAllergy,
    clearCart,
    tableId
  }), [guests, orderNotes, allergies, tableId]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
