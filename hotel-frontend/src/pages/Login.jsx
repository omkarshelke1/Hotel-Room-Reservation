import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle, Hotel, Sparkles } from 'lucide-react';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({});

    // Email validation
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email is required';
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return '';
    };

    // Password validation
    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 6) return 'Password must be at least 6 characters';
        return '';
    };

    // Real-time validation
    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });

        const newErrors = { ...errors };
        if (field === 'email') {
            newErrors.email = validateEmail(formData.email);
        } else if (field === 'password') {
            newErrors.password = validatePassword(formData.password);
        }
        setErrors(newErrors);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error when user starts typing
        if (touched[name]) {
            const newErrors = { ...errors };
            if (name === 'email') {
                newErrors.email = validateEmail(value);
            } else if (name === 'password') {
                newErrors.password = validatePassword(value);
            }
            setErrors(newErrors);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);

        if (emailError || passwordError) {
            setErrors({
                email: emailError,
                password: passwordError
            });
            setTouched({ email: true, password: true });
            return;
        }

        setLoading(true);
        try {
            const result = await dispatch(loginUser(formData)).unwrap();

            // Navigate based on role
            if (result.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/customer');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error ||
                error.response?.data?.message ||
                'Invalid email or password';
            setErrors({ submit: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Side - Branding */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hidden lg:block"
                >
                    <div className="relative">
                        {/* Decorative Elements */}
                        <motion.div
                            className="absolute -top-10 -left-10 w-40 h-40 bg-purple-300 rounded-full blur-3xl opacity-30"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                        <motion.div
                            className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-300 rounded-full blur-3xl opacity-30"
                            animate={{
                                scale: [1.2, 1, 1.2],
                                opacity: [0.5, 0.3, 0.5],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />

                        <div className="relative z-10 text-center lg:text-left">
                            <motion.div
                                className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-3xl shadow-2xl mb-8"
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.8 }}
                            >
                                <Hotel className="w-16 h-16 text-white" />
                            </motion.div>

                            <h1 className="text-5xl font-bold text-slate-800 mb-4">
                                Welcome Back!
                            </h1>
                            <p className="text-xl text-slate-600 mb-6">
                                Discover comfort and luxury at your fingertips.
                            </p>
                            <p className="text-lg text-slate-500">
                                Your perfect stay awaits. ✨
                            </p>

                            <motion.div
                                className="mt-10 flex items-center gap-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 border-4 border-white shadow-md"
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-500">
                                    Join <span className="font-bold text-primary">10,000+</span> happy travelers
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side - Login Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-white/20">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Sign In</h2>
                            <p className="text-slate-500">Please enter your credentials to continue</p>
                        </div>

                        {errors.submit && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm">{errors.submit}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('email')}
                                        className={`w-full pl-12 pr-4 py-3.5 text-base rounded-xl border-2 transition-all duration-200 ${touched.email && errors.email
                                            ? 'border-red-300 focus:border-red-500 bg-red-50'
                                            : touched.email && !errors.email
                                                ? 'border-green-300 focus:border-green-500 bg-green-50'
                                                : 'border-slate-200 focus:border-primary'
                                            } focus:outline-none focus:ring-4 focus:ring-primary/10`}
                                        placeholder="you@example.com"
                                    />
                                    {touched.email && !errors.email && formData.email && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                {touched.email && errors.email && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-2 text-sm text-red-600 flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.email}
                                    </motion.p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('password')}
                                        className={`w-full pl-12 pr-12 py-3.5 text-base rounded-xl border-2 transition-all duration-200 ${touched.password && errors.password
                                            ? 'border-red-300 focus:border-red-500 bg-red-50'
                                            : touched.password && !errors.password
                                                ? 'border-green-300 focus:border-green-500 bg-green-50'
                                                : 'border-slate-200 focus:border-primary'
                                            } focus:outline-none focus:ring-4 focus:ring-primary/10`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {touched.password && errors.password && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-2 text-sm text-red-600 flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.password}
                                    </motion.p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 flex items-center justify-center gap-2 ${loading
                                    ? 'bg-slate-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-primary to-secondary hover:shadow-2xl hover:shadow-primary/30'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5" />
                                        Sign In
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Register Link */}
                        <div className="mt-8 text-center">
                            <p className="text-slate-600">
                                Don't have an account?{' '}
                                <Link
                                    to="/register"
                                    className="font-bold text-primary hover:text-secondary transition-colors"
                                >
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;