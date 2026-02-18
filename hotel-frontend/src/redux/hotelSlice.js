import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Thunks
export const fetchHotels = createAsyncThunk('hotels/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/customer/hotels');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch hotels');
    }
});

export const fetchRoomsByHotel = createAsyncThunk('hotels/fetchRooms', async (hotelId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/customer/hotel/${hotelId}/rooms`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch rooms');
    }
});

export const fetchAvailableRooms = createAsyncThunk('hotels/fetchAvailableRooms', async ({ hotelId, checkIn, checkOut }, { rejectWithValue }) => {
    try {
        const response = await api.get(`/customer/hotel/${hotelId}/available-rooms?checkIn=${checkIn}&checkOut=${checkOut}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch available rooms');
    }
});

const initialState = {
    hotels: [],
    rooms: [], // Current hotel rooms
    loading: false,
    error: null,
};

const hotelSlice = createSlice({
    name: 'hotels',
    initialState,
    reducers: {
        clearRooms: (state) => {
            state.rooms = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Hotels
            .addCase(fetchHotels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHotels.fulfilled, (state, action) => {
                state.loading = false;
                state.hotels = action.payload;
            })
            .addCase(fetchHotels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Rooms
            .addCase(fetchRoomsByHotel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoomsByHotel.fulfilled, (state, action) => {
                state.loading = false;
                state.rooms = action.payload;
            })
            .addCase(fetchRoomsByHotel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Available Rooms
            .addCase(fetchAvailableRooms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAvailableRooms.fulfilled, (state, action) => {
                state.loading = false;
                state.rooms = action.payload; // Update rooms list with available ones
            })
            .addCase(fetchAvailableRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearRooms } = hotelSlice.actions;
export default hotelSlice.reducer;
