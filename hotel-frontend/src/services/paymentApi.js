import axios from 'axios';

const PAYMENT_API_BASE_URL = 'http://localhost:8082/api/payments';

const paymentApi = axios.create({
    baseURL: PAYMENT_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token if needed
paymentApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const createPaymentOrder = async (bookingId, userId, amount) => {
    const response = await paymentApi.post('/create-order', {
        bookingId,
        userId,
        amount,
        currency: 'INR',
        receipt: `booking_${bookingId}_${Date.now()}`
    });
    return response.data;
};

export const verifyPayment = async (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
    const response = await paymentApi.post('/verify', {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
    });
    return response.data;
};

export const getPaymentsByBooking = async (bookingId) => {
    const response = await paymentApi.get(`/booking/${bookingId}`);
    return response.data;
};

export const getPaymentsByUser = async (userId) => {
    const response = await paymentApi.get(`/user/${userId}`);
    return response.data;
};

export const getPaymentById = async (paymentId) => {
    const response = await paymentApi.get(`/${paymentId}`);
    return response.data;
};

export default paymentApi;
