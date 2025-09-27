
import React, { useState, useMemo } from 'react';
import { useCart } from '../contexts/CartContext';
import Header from '../components/Header';
import { ALLERGY_OPTIONS, SERVICE_CHARGE_RATE, TAX_RATE } from '../constants';
import { OrderPayload, SelectedOption } from '../types';
import PlusIcon from '../components/icons/PlusIcon';
import MinusIcon from '../components/icons/MinusIcon';
import TrashIcon from '../components/icons/TrashIcon';

interface CartScreenProps {
  onBack: () => void;
  onConfirm: (orderId: string, payload: OrderPayload) => void;
}

const GuestTabs: React.FC<{
  guestsCount: number;
  currentSeat: number;
  onSeatChange: (seat: number) => void;
}> = ({ guestsCount, currentSeat, onSeatChange }) => {
  return (
    <div className="flex items-center space-x-2 pb-4 overflow-x-auto">
      {Array.from({ length: guestsCount }, (_, i) => i + 1).map(seat => (
        <button
          key={seat}
          onClick={() => onSeatChange(seat)}
          className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors whitespace-nowrap ${
            currentSeat === seat
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Persona {seat}
        </button>
      ))}
    </div>
  );
};

const CartScreen: React.FC<CartScreenProps> = ({ onBack, onConfirm }) => {
  const { guests, getSeatSubtotal, removeItemFromSeat, updateItemQuantity, orderNotes, setOrderNotes, allergies, toggleAllergy, tableId, clearCart } = useCart();
  const [currentSeat, setCurrentSeat] = useState(1);

  const subtotal = useMemo(() => guests.reduce((total, guest) => total + getSeatSubtotal(guest.seat), 0), [guests, getSeatSubtotal]);
  const taxes = subtotal * TAX_RATE;
  const serviceCharge = subtotal * SERVICE_CHARGE_RATE;
  const total = subtotal + taxes + serviceCharge;

  const currentGuestOrder = guests.find(g => g.seat === currentSeat);
  
  const generateOrderId = () => `M-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  const handleConfirm = () => {
    const orderId = generateOrderId();
    const payload: OrderPayload = {
      order_id: orderId,
      table_id: tableId,
      channel: 'menu',
      customer_name: `Mesa ${tableId}`, // Mock
      priority: 'normal',
      notes: orderNotes,
      allergies,
      guests: guests
        .filter(g => g.items.length > 0)
        .map(g => ({
          seat: g.seat.toString(),
          items: g.items.map(cartItem => ({
            item_id: cartItem.menuItem.item_id,
            name: cartItem.menuItem.name,
            qty: cartItem.qty,
            price_unit: cartItem.menuItem.price,
            options: cartItem.options,
            notes: cartItem.notes,
          })),
        })),
      totals: { subtotal, taxes, service_charge: serviceCharge, total }
    };
    onConfirm(orderId, payload);
    clearCart();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Tu Orden" onBack={onBack} showCart={false} />
      
      {guests.reduce((acc, g) => acc + g.items.length, 0) === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
            <h2 className="text-2xl font-bold text-white">Tu carrito está vacío</h2>
            <p className="text-gray-400 mt-2">Añade algunos platos del menú para empezar.</p>
            <button onClick={onBack} className="mt-6 text-lg font-semibold text-white px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                Volver al Menú
            </button>
        </div>
      ) : (
        <>
          <main className="flex-grow p-4 space-y-6">
            <GuestTabs guestsCount={guests.length} currentSeat={currentSeat} onSeatChange={setCurrentSeat} />
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Platos de Persona {currentSeat}</h3>
              {currentGuestOrder && currentGuestOrder.items.length > 0 ? (
                <ul className="divide-y divide-gray-700">
                  {currentGuestOrder.items.map(item => {
                    const itemPriceWithOptions = item.menuItem.price + item.options.reduce((sum, opt) => sum + (opt.price_delta || 0), 0);
                    return (
                        <li key={item.id} className="py-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-bold text-lg text-white">{item.menuItem.name}</p>
                                    <div className="text-sm text-gray-400">
                                        {item.options.map(opt => <div key={opt.option_id}>- {opt.option_name}</div>)}
                                        {item.notes && <div className="italic mt-1">"{item.notes}"</div>}
                                    </div>
                                </div>
                                <p className="font-semibold text-lg text-purple-300">${(itemPriceWithOptions * item.qty).toFixed(2)}</p>
                            </div>
                             <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateItemQuantity(currentSeat, item.id, item.qty - 1)} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"><MinusIcon className="w-4 h-4" /></button>
                                    <span className="font-bold w-6 text-center">{item.qty}</span>
                                    <button onClick={() => updateItemQuantity(currentSeat, item.id, item.qty + 1)} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"><PlusIcon className="w-4 h-4" /></button>
                                </div>
                                <button onClick={() => removeItemFromSeat(currentSeat, item.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        </li>
                    )
                  })}
                </ul>
              ) : <p className="text-gray-400">Esta persona no ha añadido platos.</p>}
            </div>

            <div className="bg-gray-800 p-4 rounded-lg space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-2">Alergias</h3>
                <div className="flex flex-wrap gap-2">
                  {ALLERGY_OPTIONS.map(allergy => (
                    <button key={allergy} onClick={() => toggleAllergy(allergy)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${allergies.includes(allergy) ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                      {allergy}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Notas Generales de la Orden</h3>
                <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Ej: Celebrando un cumpleaños"
                    className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg space-y-2 text-lg">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-400"><span>IVU ({ (TAX_RATE * 100).toFixed(0) }%)</span><span>${taxes.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-400"><span>Servicio ({ (SERVICE_CHARGE_RATE * 100).toFixed(0) }%)</span><span>${serviceCharge.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-2xl border-t border-gray-700 pt-2 mt-2 text-purple-300"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </main>
          
          <footer className="sticky bottom-0 bg-gray-800 p-4 border-t border-gray-700">
            <button onClick={handleConfirm} className="w-full text-xl font-bold text-white px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              Enviar a Cocina
            </button>
          </footer>
        </>
      )}
    </div>
  );
};

export default CartScreen;
