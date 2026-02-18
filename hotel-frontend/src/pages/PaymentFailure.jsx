import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, Home, RefreshCcw, HelpCircle, Phone } from 'lucide-react';

const PaymentFailure = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { error, bookingDetails } = location.state || {};

    const handleRetry = () => {
        if (bookingDetails) {
            navigate('/payment-checkout', {
                state: { bookingDetails }
            });
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Failure Animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-red-100 rounded-full mb-4">
                        <XCircle className="w-20 h-20 text-red-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-2">
                        Payment Failed
                    </h1>
                    <p className="text-xl text-slate-600">We couldn't process your payment</p>
                </motion.div>

                {/* Error Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card bg-white shadow-2xl mb-6"
                >
                    <div className="card-body">
                        <div className="alert alert-error">
                            <XCircle className="w-6 h-6" />
                            <div>
                                <h3 className="font-bold">Payment could not be completed</h3>
                                <div className="text-sm">{error?.description || error?.reason || 'An error occurred during payment processing'}</div>
                            </div>
                        </div>

                        {bookingDetails && (
                            <>
                                <div className="divider"></div>

                                <h3 className="font-bold text-lg mb-3">Booking Details</h3>

                                <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Room Type</span>
                                        <span className="font-semibold">{bookingDetails.room.roomType}</span>
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
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="grid md:grid-cols-2 gap-4 mb-8"
                >
                    <button onClick={handleRetry} className="btn btn-primary btn-lg">
                        <RefreshCcw className="w-5 h-5" />
                        Try Again
                    </button>
                    <Link to="/" className="btn btn-outline btn-lg">
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Link>
                </motion.div>

                {/* Common Reasons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="card bg-white shadow-lg mb-6"
                >
                    <div className="card-body">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-primary" />
                            Common Reasons for Payment Failure
                        </h3>
                        <ul className="space-y-3 text-slate-600">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Insufficient funds in your account</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Incorrect card details or expired card</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Transaction limit exceeded</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Bank declined the transaction</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Network connection issues</span>
                            </li>
                        </ul>
                    </div>
                </motion.div>

                {/* Support Information */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="card bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                >
                    <div className="card-body">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <Phone className="w-5 h-5" />
                            Need Help?
                        </h3>
                        <p className="mb-4">Our support team is here to assist you</p>
                        <div className="space-y-2">
                            <p className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span className="font-bold">Call:</span> +91 1800-123-4567
                            </p>
                            <p className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="font-bold">Email:</span> support@stayease.com
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PaymentFailure;
