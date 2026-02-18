import React, { useEffect } from 'react';
import { createPaymentOrder, verifyPayment } from '../services/paymentApi';
import { motion } from 'framer-motion';
import { CreditCard, Lock } from 'lucide-react';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const RazorpayPayment = ({ bookingId, userId, amount, userName, userEmail, userContact, onSuccess, onFailure }) => {
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        loadRazorpayScript();
    }, []);

    const handlePayment = async () => {
        setLoading(true);
        try {
            // Load Razorpay script if not already loaded
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                alert('Failed to load Razorpay SDK. Please check your internet connection.');
                setLoading(false);
                return;
            }

            // Step 1: Create order in payment service
            console.log('Creating payment order...');
            const orderData = await createPaymentOrder(bookingId, userId, amount);

            console.log('Order created:', orderData);

            // Step 2: Configure Razorpay options
            const options = {
                key: orderData.razorpayKeyId,
                amount: orderData.amount * 100, // Amount in paise
                currency: orderData.currency,
                name: 'StayEase Hotels',
                description: `Booking Payment ${bookingId ? 'for Booking #' + bookingId : ''}`,
                order_id: orderData.razorpayOrderId,
                handler: async (response) => {
                    try {
                        console.log('Payment successful, verifying...');
                        // Step 3: Verify payment signature
                        const verifyResponse = await verifyPayment(
                            response.razorpay_order_id,
                            response.razorpay_payment_id,
                            response.razorpay_signature
                        );

                        console.log('Payment verified:', verifyResponse);
                        setLoading(false);
                        onSuccess(verifyResponse);
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        setLoading(false);
                        onFailure(error);
                    }
                },
                prefill: {
                    name: userName || 'Customer Name',
                    email: userEmail || 'customer@example.com',
                    contact: userContact || '9999999999',
                },
                notes: {
                    bookingId: bookingId ? bookingId.toString() : 'new',
                    userId: userId.toString(),
                },
                theme: {
                    color: '#570df8', // DaisyUI primary color
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                        console.log('Payment cancelled by user');
                    }
                }
            };

            // Step 4: Open Razorpay checkout
            const rzp = new window.Razorpay(options);

            rzp.on('payment.failed', (response) => {
                console.error('Payment failed:', response.error);
                setLoading(false);
                onFailure(response.error);
            });
            rzp.open();
        } catch (error) {
            console.error('Error initiating payment:', error);
            setLoading(false);
            onFailure(error);
        }
    };

    return (
        <motion.button
            onClick={handlePayment}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 flex items-center justify-center gap-3 ${loading
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary to-secondary hover:shadow-2xl hover:shadow-primary/30'
                }`}
        >
            {loading ? (
                <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Processing...
                </>
            ) : (
                <>
                    <Lock className="w-5 h-5" />
                    <CreditCard className="w-5 h-5" />
                    Pay ₹{amount}
                </>
            )}
        </motion.button>
    );
};

export default RazorpayPayment;
