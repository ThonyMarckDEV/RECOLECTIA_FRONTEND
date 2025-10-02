import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/responses/handleResponse';

const createZona = async (name, description) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/zona/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
    });
    return handleResponse(response);
};

const listarZonas = async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/zona/list`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return handleResponse(response);
};

const updateZona = async (id, name, description) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/zona/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
    });
    return handleResponse(response);
};

const zonaService = {
    createZona,
    listarZonas,
    updateZona,
};

export default zonaService;