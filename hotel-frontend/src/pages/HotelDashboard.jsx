import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRoomsByHotel, fetchHotels } from '../redux/hotelSlice';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Plus, Trash2, DollarSign, Hash, Tag, Image as ImageIcon, Check, AlertCircle } from 'lucide-react';

const HotelDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { hotels } = useSelector((state) => state.hotels);
    const { rooms, loading } = useSelector((state) => state.hotels);

    const hotel = hotels.find(h => h.hotelId === parseInt(id));

    const [showAddRoom, setShowAddRoom] = useState(false);
    const [roomForm, setRoomForm] = useState({
        roomNumber: '',
        roomType: '',
        roomPrice: '',
        imageUrl: '',
        imageFile: null,
        isAvailable: true
    });
    const [actionLoading, setActionLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (!hotel) dispatch(fetchHotels());
        dispatch(fetchRoomsByHotel(id));
    }, [dispatch, id, hotel]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Upload to backend and get URL
            try {
                const formData = new FormData();
                formData.append('image', file);

                console.log('Uploading image to backend...');
                const response = await api.post('/admin/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const imageUrl = response.data; // Backend returns the URL as a string
                console.log('Image uploaded successfully, URL:', imageUrl);

                setRoomForm({
                    ...roomForm,
                    imageFile: file,
                    imageUrl: imageUrl // Use the URL from backend
                });
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Failed to upload image. Using placeholder instead.');
                setRoomForm({
                    ...roomForm,
                    imageFile: file,
                    imageUrl: 'https://via.placeholder.com/400x300'
                });
            }
        }
    };

    const handleDeleteRoom = async (roomId) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            try {
                await api.delete(`/admin/delete-room/${roomId}`);
                dispatch(fetchRoomsByHotel(id));
            } catch (err) {
                alert('Failed to delete room');
            }
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            // Remove commas from price and parse
            const cleanPrice = roomForm.roomPrice.toString().replace(/,/g, '');
            const priceValue = parseFloat(cleanPrice);

            const roomData = {
                roomNumber: roomForm.roomNumber,
                roomType: roomForm.roomType,
                roomPrice: priceValue,
                imageUrl: roomForm.imageUrl || 'https://via.placeholder.com/400x300',
                isAvailable: true,
                roomId: 0
            };

            console.log('Sending room data:', roomData);

            await api.post(`/admin/hotel/${id}/add-room`, roomData);
            dispatch(fetchRoomsByHotel(id));
            setShowAddRoom(false);
            setRoomForm({ roomNumber: '', roomType: '', roomPrice: '', imageUrl: '', imageFile: null, isAvailable: true });
            setImagePreview(null);
            alert('Room added successfully! ✓');
        } catch (err) {
            console.error('Full error:', err);
            console.error('Error response:', err.response);
            const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Unknown error occurred';
            alert('Failed to add room: ' + errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading && rooms.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
                <div className="flex flex-col items-center gap-4">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-slate-600 text-lg">Loading hotel data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto mb-8"
            >
                <div className="glass-effect p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800 mb-2">
                            {hotel?.hotelName || 'Loading...'}
                        </h1>
                        <p className="text-slate-600 flex items-center gap-2">
                            <span className="text-primary">📍</span>
                            {hotel?.location}
                        </p>
                        <div className="mt-3 flex gap-3">
                            <span className="badge badge-lg bg-purple-100 text-purple-700 border-purple-200">
                                {rooms.length} Total Rooms
                            </span>
                            <span className="badge badge-lg bg-green-100 text-green-700 border-green-200">
                                {rooms.filter(r => r.isAvailable).length} Available
                            </span>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary gap-2 shadow-lg"
                        onClick={() => setShowAddRoom(true)}
                    >
                        <Plus className="w-5 h-5" />
                        Add New Room
                    </motion.button>
                </div>
            </motion.div>

            {/* Rooms Table */}
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-effect overflow-hidden"
                >
                    {rooms.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ImageIcon className="w-12 h-12 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Rooms Yet</h3>
                            <p className="text-slate-500">Click "Add New Room" to get started</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b-2 border-primary/20">
                                        <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <Hash className="w-4 h-4" />
                                                ID
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-4 h-4" />
                                                Room Number
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4" />
                                                Price
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {rooms.map((room, index) => (
                                            <motion.tr
                                                key={room.roomId}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="border-b border-slate-100 hover:bg-white/60 transition-all duration-200"
                                            >
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-semibold text-slate-600">#{room.roomId}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-base font-bold text-slate-800">{room.roomNumber}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                                                        {room.roomType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-lg font-bold text-green-600">${room.roomPrice}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {room.isAvailable ? (
                                                        <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold w-fit">
                                                            <Check className="w-4 h-4" />
                                                            Available
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold w-fit">
                                                            <AlertCircle className="w-4 h-4" />
                                                            Booked
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDeleteRoom(room.roomId)}
                                                        className="btn btn-sm btn-error gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </motion.button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Add Room Modal */}
            <AnimatePresence>
                {showAddRoom && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowAddRoom(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-slate-800">Add New Room</h3>
                                <button
                                    onClick={() => setShowAddRoom(false)}
                                    className="btn btn-sm btn-circle btn-ghost"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleAddRoom} className="space-y-4">
                                {/* Room Number */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Room Number</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered focus:input-primary"
                                        required
                                        value={roomForm.roomNumber}
                                        onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                                        placeholder="e.g., 101"
                                    />
                                </div>

                                {/* Room Type */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Type</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered focus:input-primary"
                                        placeholder="Deluxe, Suite, etc"
                                        required
                                        value={roomForm.roomType}
                                        onChange={(e) => setRoomForm({ ...roomForm, roomType: e.target.value })}
                                    />
                                </div>

                                {/* Price */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Price (per night)</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                        <input
                                            type="number"
                                            className="input input-bordered focus:input-primary pl-8"
                                            required
                                            value={roomForm.roomPrice}
                                            onChange={(e) => setRoomForm({ ...roomForm, roomPrice: e.target.value })}
                                            placeholder="99.00"
                                            step="0.01"
                                        />
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Room Image</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="file-input file-input-bordered file-input-primary w-full"
                                        />
                                    </div>
                                    {imagePreview && (
                                        <div className="mt-3 relative">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-40 object-cover rounded-lg shadow-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    setRoomForm({ ...roomForm, imageUrl: '', imageFile: null });
                                                }}
                                                className="absolute top-2 right-2 btn btn-sm btn-circle btn-error"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        className="btn btn-ghost flex-1"
                                        onClick={() => setShowAddRoom(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={`btn btn-primary flex-1 gap-2 ${actionLoading ? 'loading' : ''}`}
                                        disabled={actionLoading}
                                    >
                                        {!actionLoading && <Plus className="w-4 h-4" />}
                                        {actionLoading ? 'Saving...' : 'Add Room'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HotelDashboard;