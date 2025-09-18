import { fetchWithAuth } from '../../../js/authToken';
import API_BASE_URL from '../../..//js/urlHelper';

const updateLocation = async (latitude, longitude) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/update-location`, {
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

const locationservice = {
  updateLocation,
};

export default locationservice;