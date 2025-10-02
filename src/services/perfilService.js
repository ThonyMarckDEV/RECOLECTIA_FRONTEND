import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/responses/handleResponse';

const getProfile = async () => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/user/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

const updateZona = async (idZona) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/user/update-zona`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idZona }),
  });
  return handleResponse(response);
};

const perfilService = {
  getProfile,
  updateZona,
};

export default perfilService;