import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import {handleResponse} from 'utilities/responses/handleResponse';

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

    getPerCapitaSummary: async () => {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/percapita-summary`);
        // Usamos nuestro handleResponse estándar para consistencia
        return handleResponse(response);
    },

  };

export default dashboardService;