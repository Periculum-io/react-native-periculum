import axios from 'axios';

const auth = async (client_id, client_secret) => {
  const url = 'https://periculum-technologies-inc.auth0.com/oauth/token';
  if (!client_id || !client_secret) {
    console.error('Please input credentials');
    throw 'Please input credentials';
  } else {
    try {
      const response = await axios({
        method: 'POST',
        url,
        data: {
          client_id,
          client_secret,
          audience: 'https://api.insights-periculum.com',
          grant_type: 'client_credentials',
        },
        headers: {'Content-Type': 'application/json'},
      });

      return response?.data;
    } catch (error) {
      const {data} = error?.response || {};
      console.error('Invalid credentials');
      throw 'Invalid credentials';
    } finally {
    }
  }
};

export default auth;
