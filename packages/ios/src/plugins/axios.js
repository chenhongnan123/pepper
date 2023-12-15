import axios from 'axios';

const baseDomain = '';
const baseURL = `${baseDomain}`;
const axiosInstance = axios.create({
  baseURL,
  headers: {
    loginType: 'INFINITY',
  },
});
export default axiosInstance;
