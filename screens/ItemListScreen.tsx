
import React from 'react';
import { menuItems } from '../data/menuData';
import { MenuCategory, MenuItem } from '../types';
import Header from '../components/Header';
import Badge from '../components/Badge';
import AudioIcon from '../components/icons/AudioIcon';

interface ItemListScreenProps {
  category: MenuCategory;
  onNavigate: (item: MenuItem) => void;
  onBack: () => void;
  onCartClick: () => void;
}

const ItemListScreen: React.FC<ItemListScreenProps> = ({ category, onNavigate, onBack, onCartClick }) => {
  const items = category.category_id === 'specials'
    ? menuItems.filter(item => item.is_special)
    : menuItems.filter(item => item.category_id === category.category_id && item.visible);

  const handleAudioClick = (e: React.MouseEvent, item: MenuItem) => {
      e.stopPropagation();
      alert(`Reproduciendo audio para ${item.name}:\n"${item.description}"`);
  };

  return (
    <div className="min-h-screen">
      <Header title={category.name} onBack={onBack} onCartClick={onCartClick} />
      <main className="p-4">
        {items.length === 0 ? (
          <p className="text-center text-gray-400 mt-8">No hay platos en esta categoría.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(item => (
              <div key={item.item_id} onClick={() => onNavigate(item)} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex cursor-pointer transition-transform transform hover:scale-105">
                <img src={item.photo_url} alt={item.name} className="w-1/3 h-full object-cover"/>
                <div className="p-4 flex flex-col justify-between w-2/3">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-white">{item.name}</h3>
                      <p className="text-lg font-semibold text-purple-400">${item.price.toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {item.is_special && <Badge type="special" />}
                        {item.badges.map(badge => <Badge key={badge} type={badge} />)}
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                      <button onClick={(e) => handleAudioClick(e, item)} className="p-2 rounded-full hover:bg-purple-500/20 transition-colors">
                          <AudioIcon className="w-6 h-6 text-purple-400"/>
                      </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ItemListScreen;
