
import React, { useState, useEffect } from 'react';
import { CartProvider } from './contexts/CartContext';
import { MenuCategory, MenuItem } from './types';
import WelcomeScreen from './screens/WelcomeScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import ItemListScreen from './screens/ItemListScreen';
import ItemDetailScreen from './screens/ItemDetailScreen';
import CartScreen from './screens/CartScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';

export type Screen = 'welcome' | 'categories' | 'itemList' | 'itemDetail' | 'cart' | 'confirmation';

export interface NavigationState {
  category?: MenuCategory;
  item?: MenuItem;
  orderId?: string;
  orderPayload?: object;
}

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [tableId, setTableId] = useState<string>('mesa_indefinida');
  const [navState, setNavState] = useState<NavigationState>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    if (table) {
      setTableId(table);
    }
  }, []);
  
  const navigate = (newScreen: Screen, state: NavigationState = {}) => {
    setScreen(newScreen);
    setNavState(prevState => ({ ...prevState, ...state }));
  };

  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return <WelcomeScreen tableId={tableId} onNavigate={() => navigate('categories')} />;
      case 'categories':
        return <CategoriesScreen onNavigate={(category) => navigate('itemList', { category })} onCartClick={() => navigate('cart')} />;
      case 'itemList':
        return <ItemListScreen category={navState.category!} onNavigate={(item) => navigate('itemDetail', { item })} onBack={() => navigate('categories')} onCartClick={() => navigate('cart')} />;
      case 'itemDetail':
        return <ItemDetailScreen item={navState.item!} onBack={() => navigate('itemList', { category: navState.category })} onCartClick={() => navigate('cart')} />;
      case 'cart':
        return <CartScreen onBack={() => window.history.length > 1 ? window.history.back() : navigate('categories')} onConfirm={(orderId, payload) => navigate('confirmation', { orderId, orderPayload: payload })} />;
      case 'confirmation':
        return <ConfirmationScreen orderId={navState.orderId!} payload={navState.orderPayload!} onNewOrder={() => { navigate('categories'); }} />;
      default:
        return <WelcomeScreen tableId={tableId} onNavigate={() => navigate('categories')} />;
    }
  };

  return (
    <CartProvider tableId={tableId}>
      <div className="max-w-screen-lg mx-auto bg-gray-900 min-h-screen">
          {renderScreen()}
      </div>
    </CartProvider>
  );
};

export default App;
