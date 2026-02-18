import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchMyBookings = createAsyncThunk('bookings/fetchMy', async (userId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/customer/my-bookings/${userId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch bookings');
    }
});

export const fetchAllBookings = createAsyncThunk('bookings/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/admin/all-bookings');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch all bookings');
    }
});

const initialState = {
    bookings: [],
    loading: false,
    error: null,
};

const bookingSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // My Bookings
            .addCase(fetchMyBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(fetchMyBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // All Bookings
            .addCase(fetchAllBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(fetchAllBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default bookingSlice.reducer;
