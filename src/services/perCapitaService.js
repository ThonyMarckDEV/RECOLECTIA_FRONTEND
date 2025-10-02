import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/responses/handleResponse';

const checkTodayRecord = async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/perCapita/check-today`);

    // Manejo de error simple solo para esta función
    if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || 'Error al verificar el estado');
    }
    
    // Si la respuesta es exitosa, devuelve el JSON simple: { "can_submit": true }
    return response.json();
};

const createRecord = async (weight_kg) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/perCapita/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight_kg }),
    });
    // Esta función SÍ usa handleResponse porque necesita procesar errores de validación
    return handleResponse(response);
};

const getMyRecords = async (page = 1) => {
    // Añadimos el parámetro 'page' a la URL
    const response = await fetchWithAuth(`${API_BASE_URL}/api/perCapita/myrecords?page=${page}`);
    return handleResponse(response);
};


const perCapitaService = {
    checkTodayRecord,
    createRecord,
    getMyRecords
};

export default perCapitaService;