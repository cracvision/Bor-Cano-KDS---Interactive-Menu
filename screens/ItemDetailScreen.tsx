
import React, { useState, useEffect, useMemo } from 'react';
import { MenuItem, MenuOption, OptionGroup, SelectedOption } from '../types';
import { useCart } from '../contexts/CartContext';
import Header from '../components/Header';
import Badge from '../components/Badge';
import AudioIcon from '../components/icons/AudioIcon';
import PlusIcon from '../components/icons/PlusIcon';
import MinusIcon from '../components/icons/MinusIcon';

interface ItemDetailScreenProps {
  item: MenuItem;
  onBack: () => void;
  onCartClick: () => void;
}

const GuestTabs: React.FC<{
  guestsCount: number;
  currentSeat: number;
  onSeatChange: (seat: number) => void;
  onAddGuest: () => void;
}> = ({ guestsCount, currentSeat, onSeatChange, onAddGuest }) => {
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
      <button
        onClick={onAddGuest}
        className="flex items-center justify-center w-10 h-10 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors"
      >
        <PlusIcon className="w-5 h-5" />
      </button>
    </div>
  );
};


const ItemDetailScreen: React.FC<ItemDetailScreenProps> = ({ item, onBack, onCartClick }) => {
  const { guests, addGuest, addItemToSeat } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: SelectedOption[]}>({});
  const [notes, setNotes] = useState('');
  const [currentSeat, setCurrentSeat] = useState(1);
  const [isAddToCartDisabled, setAddToCartDisabled] = useState(false);

  useEffect(() => {
    const requiredGroups = item.option_groups.filter(g => g.required);
    if (requiredGroups.length === 0) {
      setAddToCartDisabled(false);
      return;
    }
    const allRequiredSelected = requiredGroups.every(group => 
        selectedOptions[group.group_id] && selectedOptions[group.group_id].length > 0
    );
    setAddToCartDisabled(!allRequiredSelected);
  }, [selectedOptions, item.option_groups]);

  const handleOptionChange = (group: OptionGroup, option: MenuOption) => {
    setSelectedOptions(prev => {
        const newSelection = { ...prev };
        const selection: SelectedOption = {
            group_id: group.group_id,
            group_name: group.name,
            option_id: option.option_id,
            option_name: option.name,
            price_delta: option.price_delta || 0,
        };

        if (group.type === 'single') {
            newSelection[group.group_id] = [selection];
        } else { // multiple
            const current = newSelection[group.group_id] || [];
            const existingIndex = current.findIndex(o => o.option_id === option.option_id);

            if (existingIndex > -1) { // It's checked, so uncheck it
                newSelection[group.group_id] = current.filter(o => o.option_id !== option.option_id);
            } else { // It's not checked, so check it
                if (!group.max || current.length < group.max) {
                    newSelection[group.group_id] = [...current, selection];
                }
            }
        }
        return newSelection;
    });
  };

  const isOptionSelected = (groupId: string, optionId: string) => {
    return selectedOptions[groupId]?.some(o => o.option_id === optionId) || false;
  };

  const totalItemPrice = useMemo(() => {
    const optionsPrice = Object.values(selectedOptions).flat().reduce((sum, opt) => sum + (opt.price_delta || 0), 0);
    return (item.price + optionsPrice) * quantity;
  }, [item, quantity, selectedOptions]);

  const handleAddToCart = () => {
    if(isAddToCartDisabled) return;
    const finalOptions = Object.values(selectedOptions).flat();
    addItemToSeat(currentSeat, item, quantity, finalOptions, notes);
    onBack();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title={item.name} onBack={onBack} onCartClick={onCartClick} />
      
      <main className="flex-grow">
        <div className="relative">
          <img src={item.photo_url} alt={item.name} className="w-full h-64 object-cover" />
          <div className="absolute top-4 right-4 flex gap-2">
            {item.is_special && <Badge type="special" />}
            {item.badges.map(badge => <Badge key={badge} type={badge} />)}
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">{item.name}</h1>
            <button onClick={() => alert(`Reproduciendo audio: ${item.description}`)} className="p-3 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors">
              <AudioIcon className="w-6 h-6 text-purple-300" />
            </button>
          </div>
          <p className="text-lg text-gray-300">{item.description}</p>

          {item.option_groups.map(group => (
            <div key={group.group_id} className="border-t border-gray-700 pt-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                {group.name}
                {group.required && <span className="text-xs font-medium text-purple-400 bg-gray-700 px-2 py-0.5 rounded-full">Obligatorio</span>}
              </h3>
              <p className="text-sm text-gray-400 mb-2">{group.type === 'single' ? 'Elige 1' : `Elige hasta ${group.max || group.options.length}`}</p>
              <div className="space-y-2">
                {group.options.map(option => (
                  <label key={option.option_id} className="flex items-center p-3 bg-gray-800 rounded-lg cursor-pointer">
                    <input
                      type={group.type === 'single' ? 'radio' : 'checkbox'}
                      name={group.group_id}
                      checked={isOptionSelected(group.group_id, option.option_id)}
                      onChange={() => handleOptionChange(group, option)}
                      className="h-5 w-5 text-purple-500 bg-gray-700 border-gray-600 focus:ring-purple-600"
                    />
                    <span className="ml-3 text-lg text-gray-200 flex-grow">{option.name}</span>
                    {option.price_delta ? (
                      <span className="text-md text-purple-300">
                        {option.price_delta > 0 ? `+$${option.price_delta.toFixed(2)}` : `-$${Math.abs(option.price_delta).toFixed(2)}`}
                      </span>
                    ) : null}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-xl font-semibold">Notas para Cocina</h3>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: poco ajo, sin cebolla..."
              className="w-full mt-2 p-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 bg-gray-800 p-4 border-t border-gray-700 shadow-2xl">
        <div className="mb-4">
            <h3 className="text-md font-semibold mb-2">Añadir para:</h3>
            <GuestTabs guestsCount={guests.length} currentSeat={currentSeat} onSeatChange={setCurrentSeat} onAddGuest={addGuest} />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"><MinusIcon /></button>
            <span className="text-2xl font-bold w-10 text-center">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"><PlusIcon /></button>
          </div>
          <button onClick={handleAddToCart}
            disabled={isAddToCartDisabled}
            className="flex-grow text-lg font-bold text-white px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:text-gray-400 transition-all duration-300"
          >
            Añadir {isAddToCartDisabled ? '(Completa opciones)' : `$${totalItemPrice.toFixed(2)}`}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ItemDetailScreen;
