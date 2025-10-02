import React from 'react';

const AlertMessage = ({ type, message, onClose }) => {
    // --- INICIO DE LA LÓGICA CENTRALIZADA ---

    // Función interna para procesar el mensaje o el objeto de error.
    const processMessage = (data) => {
        if (!data) return null;

        // Caso 1: Es un objeto de error de validación de Laravel (contiene 'errors')
        if (data.errors && typeof data.errors === 'object') {
            const errorMessages = Object.values(data.errors).flat();
            // Solo devolvemos algo si hay mensajes reales
            return errorMessages.length > 0 ? errorMessages : null;
        }

        // Caso 2: Es un objeto de éxito o error genérico (contiene 'message')
        if (data.message && typeof data.message === 'string') {
            return data.message;
        }

        // Caso 3: Ya es un arreglo de strings o un string simple
        if (Array.isArray(data) || typeof data === 'string') {
            return data;
        }

        // Si no coincide con nada, no mostramos nada.
        return null;
    };

    const displayMessage = processMessage(message);

    // --- FIN DE LA LÓGICA ---

    if (!displayMessage || (Array.isArray(displayMessage) && displayMessage.length === 0)) {
        return null;
    }

    const baseClasses = "mb-4 p-4 rounded-xl border text-sm";
    const typeClasses = {
        success: "bg-green-50 border-green-200 text-green-800",
        error: "bg-red-50 border-red-200 text-red-800",
    };

    const isList = Array.isArray(displayMessage);

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`}>
            <div className="flex justify-between items-start">
                {isList ? (
                    <ul className="list-disc pl-5 space-y-1">
                        {displayMessage.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                ) : (
                    <span>{displayMessage}</span>
                )}
                
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