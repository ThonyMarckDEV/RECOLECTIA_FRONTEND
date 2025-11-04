import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/responses/handleResponse';

const dashboardService = {

    getDashboardMetrics: async () => {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/dashboard`);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Error al obtener métricas');
            }
            
            return result; // Returns { success: true, data: {...} }
        } catch (error) {
            throw new Error(error.message || 'Error al obtener métricas');
        }
    },

    // Ahora acepta startDate y endDate
    getPerCapitaSummary: async (startDate, endDate) => {
        // 1. Construir los query parameters
        const params = new URLSearchParams();
        // Solo añadimos los parámetros si tienen valor
        if (startDate) {
            params.append('startDate', startDate);
        }
        if (endDate) {
            params.append('endDate', endDate);
        }

        // 2. Añadir los parámetros a la URL (si existen)
        const queryString = params.toString();
        const url = `${API_BASE_URL}/api/admin/percapita-summary${queryString ? `?${queryString}` : ''}`;

        // 3. Realizar la llamada
        const response = await fetchWithAuth(url);
        // Usamos nuestro handleResponse estándar para consistencia
        return handleResponse(response);
    },


};

export default dashboardService;