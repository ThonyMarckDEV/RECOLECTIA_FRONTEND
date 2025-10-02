import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/responses/handleResponse';

const createRecolector = async (username, name, password, estado, idZona) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/recolectores/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, name, password, estado, idZona }),
    });
    return handleResponse(response);
};

const listarRecolectores = async () => {
    const response =  await fetchWithAuth(`${API_BASE_URL}/api/recolectores/index`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return handleResponse(response);
};

const updateRecolector = async (idUsuario, username, name, password, estado, idZona) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/recolectores/update/${idUsuario}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, name, password, estado, idZona }),
    });
    return handleResponse(response);
};

const recolectorService = {
    createRecolector,
    listarRecolectores,
    updateRecolector,
};

export default recolectorService;