import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';

const createReport = async (photo, description, userId, latitude, longitude) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/reports/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ photo, description, idUsuario: userId, latitude, longitude }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Error al enviar el reporte');
  }

  return result;
};

const reportService = {
  createReport,
};

export default reportService;