import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';

const createZona = async (name, description) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/zona/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Error al crear la zona');
  }
  return result;
};

const listarZonas = async () => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/zona/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Error al obtener las zonas');
  }
  return result;
};

const updateZona = async (id, name, description) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/zona/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Error al actualizar la zona');
  }
  return result;
};

const zonaService = {
  createZona,
  listarZonas,
  updateZona,
};

export default zonaService;