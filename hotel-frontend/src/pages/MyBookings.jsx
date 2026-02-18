import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings } from '../redux/bookingSlice';
import { motion } from 'framer-motion';
import { Calendar, MapPin, DollarSign, Clock, Hotel, CheckCircle, XCircle, Loader } from 'lucide-react';

const MyBookings = () => {
    const dispatch = useDispatch();
    const { bookings, loading, error } = useSelector((state) => state.bookings);
    const { user, userId } = useSelector((state) => state.auth);

    useEffect(() => {
        // Get userId from Redux state (now properly stored from login)
        const userIdValue = userId || localStorage.getItem('userId') || user?.id || user?.userId;
        if (userIdValue) {
            dispatch(fetchMyBookings(userIdValue));
        }
    }, [dispatch, userId, user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-xl font-semibold text-slate-700">Loading your bookings...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-red-700 text-center">
                        {typeof error === 'string' ? error : 'Error loading bookings'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl font-bold text-slate-800 mb-4">My Bookings</h1>
                    <p className="text-xl text-slate-600">View and manage your hotel reservations</p>
                </motion.div>

                {/* Bookings Table */}
                {bookings.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-2xl p-12 text-center"
                    >
                        <Hotel className="w-24 h-24 text-slate-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-slate-700 mb-3">No bookings found</h2>
                        <p className="text-xl text-slate-500">You haven't made any reservations yet.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-primary to-secondary text-white">
                                        <th className="px-8 py-6 text-left text-lg font-bold uppercase tracking-wider">
                                            Booking ID
                                        </th>
                                        <th className="px-8 py-6 text-left text-lg font-bold uppercase tracking-wider">
                                            Hotel & Room
                                        </th>
                                        <th className="px-8 py-6 text-left text-lg font-bold uppercase tracking-wider">
                                            Check-in
                                        </th>
                                        <th className="px-8 py-6 text-left text-lg font-bold uppercase tracking-wider">
                                            Check-out
                                        </th>
                                        <th className="px-8 py-6 text-left text-lg font-bold uppercase tracking-wider">
                                            Total Amount
                                        </th>
                                        <th className="px-8 py-6 text-left text-lg font-bold uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {bookings.map((booking, index) => (
                                        <motion.tr
                                            key={booking.bookingId}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                                                        <span className="text-white font-bold text-lg">
                                                            #{booking.bookingId}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-start gap-3">
                                                    <Hotel className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                                                    <div>
                                                        <div className="text-lg font-bold text-slate-800">
                                                            {booking.room?.roomType || 'Room'}
                                                        </div>
                                                        <div className="text-base text-slate-500 flex items-center gap-2 mt-1">
                                                            <MapPin className="w-4 h-4" />
                                                            Room {booking.room?.roomNumber || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="w-5 h-5 text-green-600" />
                                                    <div>
                                                        <div className="text-base font-semibold text-slate-800">
                                                            {booking.checkInDate}
                                                        </div>
                                                        <div className="text-sm text-slate-500">Arrival</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="w-5 h-5 text-red-600" />
                                                    <div>
                                                        <div className="text-base font-semibold text-slate-800">
                                                            {booking.checkOutDate}
                                                        </div>
                                                        <div className="text-sm text-slate-500">Departure</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-6 h-6 text-green-600" />
                                                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                        {booking.totalAmount || booking.room?.roomPrice || '0'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-3 rounded-full font-semibold text-base shadow-lg">
                                                    <CheckCircle className="w-5 h-5" />
                                                    Confirmed
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Summary */}
                        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-6 border-t-2 border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="text-lg font-semibold text-slate-700">
                                    Total Bookings: <span className="text-primary text-xl">{bookings.length}</span>
                                </div>
                                <div className="text-lg font-semibold text-slate-700">
                                    Total Spent:
                                    <span className="text-green-600 text-xl ml-2">
                                        ${bookings.reduce((sum, b) => sum + (b.totalAmount || b.room?.roomPrice || 0), 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;