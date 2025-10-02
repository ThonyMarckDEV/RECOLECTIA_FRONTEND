/**
 * Procesa la respuesta de fetch y la ESTANDARIZA.
 * Siempre devuelve o lanza un objeto con un formato predecible.
 */
export const handleResponse = async (response) => {
    const result = await response.json();

    if (!response.ok) {
        // ERROR: Crea y lanza nuestro objeto de error estándar.
        const error = {
            type: 'error',
            message: result.message || 'Ocurrió un error inesperado.',
            details: result.errors ? Object.values(result.errors).flat() : undefined,
        };
        throw error;
    }

    // ÉXITO: Crea y devuelve nuestro objeto de éxito estándar.
    const success = {
        type: 'success',
        message: result.message || 'Operación realizada con éxito.',
        data: result.data,
    };
    return success;
};