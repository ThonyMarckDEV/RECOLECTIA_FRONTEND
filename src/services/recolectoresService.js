import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/responses/handleResponse';

const createRecolector = (username, name, password, estado, idZona) => {
    return fetchWithAuth(`${API_BASE_URL}/api/recolectores/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, name, password, estado, idZona }),
    }).then(handleResponse);
};

const listarRecolectores = () => {
    return fetchWithAuth(`${API_BASE_URL}/api/recolectores/index`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(handleResponse);
};

const updateRecolector = (idUsuario, username, name, password, estado, idZona) => {
    return fetchWithAuth(`${API_BASE_URL}/api/recolectores/update/${idUsuario}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, name, password, estado, idZona }),
    }).then(handleResponse);
};

const recolectorService = {
    createRecolector,
    listarRecolectores,
    updateRecolector,
};

export default recolectorService;