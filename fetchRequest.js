import axios from 'axios';
import API from './api';
import auth from './auth';

export const fetchRequest = async ({
  authorization = null,
  path,
  data = undefined,
  method = 'POST',
}) => {
  console.log(method);
  if (!authorization) {
    console.error({status: false, msg: 'Please enter authorization token!'});
    throw {status: false, msg: 'Please enter authorization token!'};
  } else {
    try {
      const baseURL = API;
      const instance = axios.create({
        baseURL,
        responseType: 'json',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authorization}`,
        },
      });

      try {
        let response;
        if (method == 'POST') {
          response = await instance.post(path, data);
        } else if (method == 'PUT') {
          response = await instance.put(path, data);
        } else if (method == 'PATCH') {
          response = await instance.patch(path, JSON.stringify(data));
        } else {
          response = await instance.get(path);
        }

        return response?.data;
      } catch (error) {
        // console.error(error?.message || error);
        throw error;
      } finally {
      }
    } catch (error) {}
  }
};
