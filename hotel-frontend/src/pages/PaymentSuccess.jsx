import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, FileText, Calendar, CreditCard, Hotel, Download } from 'lucide-react';

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { payment, booking, bookingDetails } = location.state || {};

    if (!payment) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg mb-4">No payment information found</p>
                    <Link to="/" className="btn btn-primary">Go Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Success Animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-green-100 rounded-full mb-4">
                        <CheckCircle className="w-20 h-20 text-green-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                        Payment Successful!
                    </h1>
                    <p className="text-xl text-slate-600">Your booking is confirmed</p>
                </motion.div>

                {/* Payment Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card bg-white shadow-2xl mb-6"
                >
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-4 flex items-center gap-2">
                            <CreditCard className="w-6 h-6 text-primary" />
                            Payment Details
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-slate-500">Payment ID</p>
                                    <p className="font-mono font-bold text-primary">{payment.razorpayPaymentId}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Amount Paid</p>
                                    <p className="text-2xl font-bold text-green-600">₹{payment.amount}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-slate-500">Status</p>
                                    <div className="badge badge-success badge-lg">{payment.status}</div>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Booking ID</p>
                                    <p className="font-mono font-bold">{payment.bookingId || booking?.bookingId || 'Processing...'}</p>
                                </div>
                            </div>
                        </div>

                        {bookingDetails && (
                            <>
                                <div className="divider"></div>

                                {/* Booking Summary */}
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                    <Hotel className="w-5 h-5 text-primary" />
                                    Booking Summary
                                </h3>

                                <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Room Type</span>
                                        <span className="font-semibold">{bookingDetails.room.roomType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Room Number</span>
                                        <span className="font-semibold">{bookingDetails.room.roomNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Check-in</span>
                                        <span className="font-semibold">{new Date(bookingDetails.checkInDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Check-out</span>
                                        <span className="font-semibold">{new Date(bookingDetails.checkOutDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Confirmation Message */}
                        <div className="alert alert-success mt-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>A confirmation email has been sent to your registered email address.</span>
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="grid md:grid-cols-3 gap-4"
                >
                    <Link to="/my-bookings" className="btn btn-primary">
                        <FileText className="w-5 h-5" />
                        View My Bookings
                    </Link>
                    <Link to="/" className="btn btn-outline">
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="btn btn-ghost"
                    >
                        <Download className="w-5 h-5" />
                        Print Receipt
                    </button>
                </motion.div>

                {/* Next Steps */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8 p-6 bg-white rounded-xl shadow-lg"
                >
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        What's Next?
                    </h3>
                    <ul className="space-y-3 text-slate-600">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                            <span>You will receive a confirmation email with your booking details</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                            <span>Please carry a valid ID proof during check-in</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                            <span>Check-in time: 2:00 PM | Check-out time: 11:00 AM</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                            <span>For any queries, contact our support team</span>
                        </li>
                    </ul>
                </motion.div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
