
import React, { useState } from 'react';

interface ConfirmationScreenProps {
  orderId: string;
  payload: object;
  onNewOrder: () => void;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ orderId, payload, onNewOrder }) => {
  const [showPayload, setShowPayload] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gray-900 text-white">
      <div className="space-y-6 max-w-lg w-full">
        <div className="p-8 bg-gray-800 rounded-2xl shadow-lg border border-purple-500/30">
            <h1 className="text-2xl font-bold text-purple-400 mb-2">
              ¡Orden Recibida!
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              Tu orden ha sido enviada a la cocina.
            </p>
            <div className="bg-gray-900 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-400">ID de Orden</p>
                <p className="text-3xl font-mono font-bold tracking-widest text-white">{orderId}</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Tiempo estimado de preparación</p>
                <p className="text-3xl font-bold text-white">15-20 minutos</p>
            </div>
        </div>

        <div className="text-left bg-gray-800 rounded-lg p-4">
            <button onClick={() => setShowPayload(!showPayload)} className="font-semibold text-purple-400 hover:text-purple-300 w-full text-left">
                {showPayload ? 'Ocultar' : 'Mostrar'} payload simulado para KDS
            </button>
            {showPayload && (
                <pre className="mt-4 bg-black text-green-400 p-4 rounded-md text-xs overflow-x-auto">
                    <code>{JSON.stringify(payload, null, 2)}</code>
                </pre>
            )}
        </div>

        <button
          onClick={onNewOrder}
          className="w-full text-lg font-semibold text-white px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          Añadir más a la Orden
        </button>
      </div>
    </div>
  );
};

export default ConfirmationScreen;
