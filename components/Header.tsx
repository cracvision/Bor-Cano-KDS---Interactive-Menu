
import React from 'react';
import { useCart } from '../contexts/CartContext';
import CartIcon from './icons/CartIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  onCartClick?: () => void;
  showCart?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, onBack, onCartClick, showCart = true }) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 bg-gray-900 bg-opacity-80 backdrop-blur-md z-10 p-4 flex items-center justify-between shadow-lg shadow-purple-900/10">
      <div className="flex items-center gap-4">
        {onBack && (
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <ChevronLeftIcon className="w-6 h-6 text-purple-400" />
          </button>
        )}
        <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
      </div>
      {showCart && onCartClick && (
        <button onClick={onCartClick} className="relative p-2 rounded-full hover:bg-gray-700 transition-colors">
          <CartIcon className="w-7 h-7 text-purple-400" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      )}
    </header>
  );
};

export default Header;
