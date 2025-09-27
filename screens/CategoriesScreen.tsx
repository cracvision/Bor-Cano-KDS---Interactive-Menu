
import React from 'react';
import { menuCategories, menuItems } from '../data/menuData';
import { MenuCategory } from '../types';
import Header from '../components/Header';

interface CategoriesScreenProps {
  onNavigate: (category: MenuCategory) => void;
  onCartClick: () => void;
}

const specialsCategory: MenuCategory = {
  category_id: 'specials',
  name: 'Especiales del Día',
  position: 0,
  visible: true
};

const CategoriesScreen: React.FC<CategoriesScreenProps> = ({ onNavigate, onCartClick }) => {
  const specialsCount = menuItems.filter(item => item.is_special).length;

  const handleCategoryClick = (category: MenuCategory) => {
    onNavigate(category);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header title="Menú" onCartClick={onCartClick} />
      <main className="p-4 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Special Card */}
          <div
            className="col-span-2 md:col-span-3 lg:col-span-4 p-6 rounded-2xl bg-gradient-to-br from-purple-800 via-indigo-900 to-gray-900 cursor-pointer transform hover:scale-[1.02] transition-transform duration-300 shadow-lg"
            onClick={() => handleCategoryClick(specialsCategory)}
          >
            <h2 className="text-3xl font-bold text-white mb-2">Especiales del Día</h2>
            <p className="text-purple-200">{specialsCount} platos recomendados por nuestro chef.</p>
          </div>
          
          {/* Category Cards */}
          {menuCategories.filter(c => c.visible).sort((a,b) => a.position - b.position).map(category => (
            <div
              key={category.category_id}
              className="aspect-square flex flex-col justify-end p-4 rounded-2xl bg-gray-800 cursor-pointer transform hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-purple-500/30"
              onClick={() => handleCategoryClick(category)}
            >
              <h3 className="text-xl font-bold text-white">{category.name}</h3>
              <p className="text-sm text-gray-400">
                {menuItems.filter(item => item.category_id === category.category_id).length} platos
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CategoriesScreen;
