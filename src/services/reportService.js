import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';

const listAllReports = async (filters = {}, page = 1, perPage = 10) => {
  const query = new URLSearchParams({
    page,
    per_page: perPage,
    ...filters,
  }).toString();

  const response = await fetchWithAuth(`${API_BASE_URL}/api/reports/all?${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Error al obtener los reportes');
  }

  return result;
};

const updateReportStatus = async (id, status) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/reports/update-status/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Error al actualizar el estado del reporte');
  }

  return result;
};

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

const listarReportes = async () => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/reports/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Error al obtener los reportes');
  }

  return result;
};

const reportService = {
  listAllReports,
  updateReportStatus,
  createReport,
  listarReportes
};

export default reportService;