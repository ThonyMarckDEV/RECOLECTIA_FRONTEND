import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';

const getProfile = async () => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/user/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Error al obtener el perfil');
  }

  return result;
};

const perfilService = {
  getProfile,
};

export default perfilService;