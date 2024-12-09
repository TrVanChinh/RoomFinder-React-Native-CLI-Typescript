import axios from 'axios';
import { API_BASE_URL } from '../../localhost';
const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}`, // Thay bằng URL của server
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
