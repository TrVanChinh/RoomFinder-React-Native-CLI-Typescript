import axios from 'axios';
import { API_BASE_URL } from '../../localhost';

const axiosMedia = axios.create({
  baseURL: `${API_BASE_URL}`,  // Thay bằng URL server của bạn
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export default axiosMedia;
