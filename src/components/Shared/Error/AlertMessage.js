import React, { useEffect } from 'react';

const AlertMessage = ({ type, message, details, onClose }) => {
    
    // 🚀 INICIO DEL HOOK: LLAMADA INCONDICIONAL 🚀
    useEffect(() => {
        // Solo ejecutamos el temporizador si se proporcionó la función onClose
        if (onClose && message) { // 💡 Verificamos "message" aquí dentro de la lógica del efecto
            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [onClose, message]); 
    // ---------------------------------------------
    
    // Si no hay mensaje, no se muestra nada (retorno condicional)
    if (!message) {
        return null;
    }

    const baseClasses = "mb-4 p-4 rounded-xl border text-sm";
    const typeClasses = {
        success: "bg-green-50 border-green-200 text-green-800",
        error: "bg-red-50 border-red-200 text-red-800",
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`}>
            <div className="flex justify-between items-start">
                <div className="flex-grow">
                    {/* Muestra el mensaje principal */}
                    <p className={details && details.length > 0 ? 'font-semibold' : ''}>{message}</p>
                    
                    {/* Si hay detalles (errores de validación), los muestra como una lista */}
                    {details && details.length > 0 && (
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            {details.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    )}
                </div>
                
                {onClose && (
                    <button
                        onClick={onClose}
                        className="ml-4 font-bold text-lg leading-none"
                        aria-label="Cerrar"
                    >
                        &times;
                    </button>
                )}
            </div>
        </div>
    );
};

export default AlertMessage;