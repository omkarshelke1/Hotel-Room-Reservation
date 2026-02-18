import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Async Thunks
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/login', credentials);
        // Assuming response.data contains the token or user object. 
        // Based on API docs, response schema is { additionalProp1: {}, ... } which is vague.
        // Usually it returns a JWT token or user details.
        // Let's assume response.data is the payload we need.
        // We might need to adjust based on actual backend response.
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Login failed');
    }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Registration failed');
    }
});

const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
    userId: localStorage.getItem('userId') || null,
    loading: false,
    error: null,
    success: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.role = null;
            state.userId = null;
            state.error = null;
            state.success = false;
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('userId');
            localStorage.removeItem('user');
        },
        resetAuth: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                // Backend returns { token, role, userId }
                state.user = action.payload;

                // Store token
                if (action.payload.token) {
                    state.token = action.payload.token;
                    localStorage.setItem('token', action.payload.token);
                }
                // Store role
                if (action.payload.role) {
                    state.role = action.payload.role;
                    localStorage.setItem('role', action.payload.role);
                }
                // Store userId
                if (action.payload.userId) {
                    state.userId = action.payload.userId;
                    localStorage.setItem('userId', action.payload.userId);
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.success = true; // Registration successful
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, resetAuth } = authSlice.actions;
export default authSlice.reducer;
