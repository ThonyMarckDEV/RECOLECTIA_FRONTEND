import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';

const createRecolector = async (username, name, password, estado) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/recolectores/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, name, password, estado }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Error al crear el recolector');
  }

  return result;
};

const recolectorService = {
  createRecolector,
};

export default recolectorService;