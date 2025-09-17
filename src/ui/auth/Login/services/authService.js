import axios from 'axios';
import API_BASE_URL from '../../../../js/urlHelper';

const googleLogin = async (googleToken) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/google-login`,
    { token: googleToken },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

const authService = {
  googleLogin
};

export default authService;