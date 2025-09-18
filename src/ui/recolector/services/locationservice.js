import { fetchWithAuth } from '../../../js/authToken';
import API_BASE_URL from '../../../js/urlHelper';

const updateLocation = async (latitude, longitude) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/locacions/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ latitude, longitude }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Error al actualizar la ubicación');
  }

  return result;
};

const getCollectorLocation = async () => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/locations/getCollector`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Error al obtener la ubicación del recolector');
  }

  return result;
};

const locationservice = {
  updateLocation,
  getCollectorLocation,
};

export default locationservice;