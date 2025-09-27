
import React from 'react';

interface WelcomeScreenProps {
  tableId: string;
  onNavigate: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ tableId, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gray-900 text-white">
      <div className="space-y-6 max-w-md">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
          ¡Bienvenido a Borí Cano!
        </h1>
        <p className="text-lg text-gray-300">
          Estás en la <span className="font-semibold text-purple-300">{tableId.replace('_', ' ')}</span>.
          Soy Borí, tu asistente. Te guiaré por nuestro menú. ¡Prepárate para una experiencia de sabor única!
        </p>
        <button
          onClick={onNavigate}
          className="w-full text-lg font-semibold text-white px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transform hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-500/30"
        >
          Ver el Menú
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
