import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.url.startsWith('/admin')) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// --- API PUBLIK UNTUK PENDAKI ---
export const getSop = () => apiClient.get('/info/sop');
export const getWeather = () => apiClient.get('/info/weather');
export const checkQuota = (tanggal) => apiClient.get(`/quotas?tanggal=${tanggal}`);
export const createBooking = (bookingData) => apiClient.post('/bookings', bookingData);
export const checkBookingStatus = (kodeBooking) => apiClient.get(`/bookings/${kodeBooking}`);
export const uploadPaymentProof = (kodeBooking, formData) => {
  return apiClient.post(`/bookings/${kodeBooking}/payment`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};


// --- API ADMIN ---
export const loginAdmin = (credentials) => apiClient.post('/admin/login', credentials);
export const getPendingPayments = () => apiClient.get('/admin/payments');
export const verifyPayment = (paymentId) => apiClient.patch(`/admin/payments/${paymentId}/verify`);
export const getAllHikers = () => apiClient.get('/admin/hikers');
export const updateHikerStatus = (hikerId, data) => apiClient.patch(`/admin/hikers/${hikerId}/blacklist`, data);
export const getTodayBookings = () => apiClient.get('/admin/bookings/today');
export const checkinBooking = (bookingId) => apiClient.post('/admin/checkin', { booking_id: bookingId });
export const checkoutBooking = (bookingId) => apiClient.patch('/admin/checkout', { booking_id: bookingId });
export const getHistory = () => apiClient.get('/admin/history');

// --- PERBAIKAN: Fungsi API Kuota Baru ---
export const getAdminQuotas = () => apiClient.get('/admin/quotas');
export const saveQuota = (quotaData) => apiClient.post('/admin/quotas', quotaData);


export default apiClient;
