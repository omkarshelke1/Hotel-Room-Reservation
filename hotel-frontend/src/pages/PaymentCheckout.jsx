import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Calendar, CreditCard, Hotel, MapPin, User, Clock, ArrowLeft } from 'lucide-react';
import RazorpayPayment from '../components/RazorpayPayment';
import api from '../services/api';

const PaymentCheckout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId, user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [bookingData, setBookingData] = useState(null);

    // Get booking details from navigation state
    useEffect(() => {
        if (!location.state || !location.state.bookingDetails) {
            // If no booking details, redirect back
            navigate('/');
            return;
        }
        setBookingData(location.state.bookingDetails);
    }, [location, navigate]);

    const calculateDays = () => {
        if (!bookingData) return 0;
        const checkIn = new Date(bookingData.checkInDate);
        const checkOut = new Date(bookingData.checkOutDate);
        const diffTime = Math.abs(checkOut - checkIn);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const calculateTotal = () => {
        if (!bookingData) return 0;
        const days = calculateDays();
        return days * bookingData.room.roomPrice;
    };

    const handlePaymentSuccess = async (paymentResponse) => {
        setLoading(true);
        try {
            // Create the booking after successful payment
            const response = await api.post('/customer/book-room', {
                userId: bookingData.userId,
                roomId: bookingData.room.roomId,
                checkInDate: bookingData.checkInDate,
                checkOutDate: bookingData.checkOutDate,
                paymentId: paymentResponse.paymentId,
                amountPaid: calculateTotal()
            });

            // Navigate to success page
            navigate('/payment-success', {
                state: {
                    payment: paymentResponse,
                    booking: response.data,
                    bookingDetails: bookingData
                }
            });
        } catch (error) {
            console.error('Booking creation error:', error);
            alert('Payment successful but booking failed. Please contact support with Payment ID: ' + paymentResponse.paymentId);
            navigate('/my-bookings');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentFailure = (error) => {
        console.error('Payment failed:', error);
        navigate('/payment-failure', {
            state: {
                error: error,
                bookingDetails: bookingData
            }
        });
    };

    if (!bookingData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    const days = calculateDays();
    const totalAmount = calculateTotal();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                        Complete Your Booking
                    </h1>
                    <p className="text-slate-600">Review your details and make payment</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Booking Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-2 space-y-6"
                    >
                        {/* Hotel & Room Details */}
                        <div className="card bg-white shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-2xl mb-4 flex items-center gap-2">
                                    <Hotel className="w-6 h-6 text-primary" />
                                    Room Details
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={bookingData.room.imageUrl || `https://placehold.co/150x100?text=${bookingData.room.roomType}`}
                                            alt={bookingData.room.roomType}
                                            className="w-32 h-24 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold">{bookingData.room.roomType}</h3>
                                            <p className="text-slate-600 flex items-center gap-2 mt-1">
                                                <MapPin className="w-4 h-4" />
                                                Room Number: {bookingData.room.roomNumber}
                                            </p>
                                            <div className="badge badge-primary mt-2">₹{bookingData.room.roomPrice} / night</div>
                                        </div>
                                    </div>

                                    <div className="divider"></div>

                                    {/* Dates */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                                            <Calendar className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-xs text-slate-600">Check-in</p>
                                                <p className="font-bold">{new Date(bookingData.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                                            <Calendar className="w-5 h-5 text-secondary" />
                                            <div>
                                                <p className="text-xs text-slate-600">Check-out</p>
                                                <p className="font-bold">{new Date(bookingData.checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 p-4 bg-green-50 rounded-xl">
                                        <Clock className="w-5 h-5 text-green-600" />
                                        <p className="font-semibold">{days} {days === 1 ? 'Night' : 'Nights'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Guest Details */}
                        <div className="card bg-white shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-2xl mb-4 flex items-center gap-2">
                                    <User className="w-6 h-6 text-primary" />
                                    Guest Details
                                </h2>
                                <div className="space-y-2">
                                    <p><span className="font-semibold">Name:</span> {user?.name || user?.username || 'Guest'}</p>
                                    <p><span className="font-semibold">Email:</span> {user?.email || 'N/A'}</p>
                                    <p><span className="font-semibold">Booking ID:</span> <span className="badge badge-outline">Will be generated after payment</span></p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Payment Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-1"
                    >
                        <div className="card bg-white shadow-xl sticky top-4">
                            <div className="card-body">
                                <h2 className="card-title text-2xl mb-4 flex items-center gap-2">
                                    <CreditCard className="w-6 h-6 text-primary" />
                                    Payment Summary
                                </h2>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">₹{bookingData.room.roomPrice} × {days} nights</span>
                                        <span className="font-semibold">₹{totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>Taxes & Fees</span>
                                        <span>Included</span>
                                    </div>
                                    <div className="divider my-2"></div>
                                    <div className="flex justify-between text-xl font-bold">
                                        <span>Total Amount</span>
                                        <span className="text-primary">₹{totalAmount}</span>
                                    </div>
                                </div>

                                <div className="divider"></div>

                                {/* Payment Button */}
                                {loading ? (
                                    <button className="btn btn-disabled w-full">
                                        <span className="loading loading-spinner"></span>
                                        Processing...
                                    </button>
                                ) : (
                                    <RazorpayPayment
                                        bookingId={0} // Will be created after payment
                                        userId={userId}
                                        amount={totalAmount}
                                        userName={user?.name || user?.username}
                                        userEmail={user?.email}
                                        userContact={user?.phone || '9999999999'}
                                        onSuccess={handlePaymentSuccess}
                                        onFailure={handlePaymentFailure}
                                    />
                                )}

                                <div className="mt-4">
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="btn btn-ghost btn-sm w-full"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Go Back
                                    </button>
                                </div>

                                {/* Security Badge */}
                                <div className="alert alert-info mt-4 text-xs">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span>Secure payment powered by Razorpay</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCheckout;
