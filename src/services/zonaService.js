import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/responses/handleResponse';

const createZona = async (name, description) => {
    return fetchWithAuth(`${API_BASE_URL}/api/zona/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
    }).then(handleResponse);
};

const listarZonas = async () => {
    return fetchWithAuth(`${API_BASE_URL}/api/zona/list`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(handleResponse);
};

const updateZona = async (id, name, description) => {
    return fetchWithAuth(`${API_BASE_URL}/api/zona/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
    }).then(handleResponse);
};

const zonaService = {
    createZona,
    listarZonas,
    updateZona,
};

export default zonaService;