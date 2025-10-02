import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/responses/handleResponse'; // 1. Importa el manejador

const listAllReports = async (filters = {}, page = 1, perPage = 10) => {
    const query = new URLSearchParams({
        page,
        per_page: perPage,
        ...filters,
    }).toString();

    const response = await fetchWithAuth(`${API_BASE_URL}/api/reports/all?${query}`);
    return handleResponse(response); // 2. Delega el procesamiento
};

const updateReportStatus = async (id, status) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/reports/update-status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    return handleResponse(response); // 2. Delega el procesamiento
};

const createReport = async (photo, description, userId, latitude, longitude) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/reports/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo, description, idUsuario: userId, latitude, longitude }),
    });
    return handleResponse(response); // 2. Delega el procesamiento
};

const listarReportes = async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/reports/list`);
    return handleResponse(response); // 2. Delega el procesamiento
};

const reportService = {
    listAllReports,
    updateReportStatus,
    createReport,
    listarReportes
};

export default reportService;