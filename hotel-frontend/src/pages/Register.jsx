import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser, loginUser } from '../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle, User, Phone, Hotel, Shield } from 'lucide-react';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        contactNo: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({});

    // Validation functions
    const validateName = (name) => {
        if (!name) return 'Name is required';
        if (name.length < 2) return 'Name must be at least 2 characters';
        if (name.length > 50) return 'Name must be less than 50 characters';
        return '';
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email is required';
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return '';
    };

    const validateContactNo = (contactNo) => {
        if (!contactNo) return 'Contact number is required';
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(contactNo)) return 'Contact number must be exactly 10 digits';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 6) return 'Password must be at least 6 characters';
        if (password.length > 20) return 'Password must be less than 20 characters';
        return '';
    };

    const validateConfirmPassword = (confirmPassword, password) => {
        if (!confirmPassword) return 'Please confirm your password';
        if (confirmPassword !== password) return 'Passwords do not match';
        return '';
    };

    // Password strength checker
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
        if (strength <= 3) return { strength, label: 'Medium', color: 'bg-yellow-500' };
        return { strength, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });

        const newErrors = { ...errors };
        switch (field) {
            case 'name':
                newErrors.name = validateName(formData.name);
                break;
            case 'email':
                newErrors.email = validateEmail(formData.email);
                break;
            case 'contactNo':
                newErrors.contactNo = validateContactNo(formData.contactNo);
                break;
            case 'password':
                newErrors.password = validatePassword(formData.password);
                break;
            case 'confirmPassword':
                newErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword, formData.password);
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Real-time validation for touched fields
        if (touched[name]) {
            const newErrors = { ...errors };
            switch (name) {
                case 'name':
                    newErrors.name = validateName(value);
                    break;
                case 'email':
                    newErrors.email = validateEmail(value);
                    break;
                case 'contactNo':
                    // Only allow digits
                    if (!/^\d*$/.test(value)) return;
                    newErrors.contactNo = validateContactNo(value);
                    break;
                case 'password':
                    newErrors.password = validatePassword(value);
                    // Re-validate confirm password if it's been touched
                    if (touched.confirmPassword) {
                        newErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword, value);
                    }
                    break;
                case 'confirmPassword':
                    newErrors.confirmPassword = validateConfirmPassword(value, formData.password);
                    break;
                default:
                    break;
            }
            setErrors(newErrors);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const nameError = validateName(formData.name);
        const emailError = validateEmail(formData.email);
        const contactError = validateContactNo(formData.contactNo);
        const passwordError = validatePassword(formData.password);
        const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);

        if (nameError || emailError || contactError || passwordError || confirmPasswordError) {
            setErrors({
                name: nameError,
                email: emailError,
                contactNo: contactError,
                password: passwordError,
                confirmPassword: confirmPasswordError
            });
            setTouched({ name: true, email: true, contactNo: true, password: true, confirmPassword: true });
            return;
        }

        setLoading(true);
        try {
            await dispatch(registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                contactNo: formData.contactNo,
                role: 'CUSTOMER'
            })).unwrap();

            // Auto-login after registration
            const loginResult = await dispatch(loginUser({
                email: formData.email,
                password: formData.password
            })).unwrap();

            // Navigate based on role
            if (loginResult.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/customer');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error ||
                error.response?.data?.message ||
                'Registration failed. Please try again.';
            setErrors({ submit: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4">
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
                            className="absolute -top-10 -left-10 w-40 h-40 bg-blue-300 rounded-full blur-3xl opacity-30"
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                        <motion.div
                            className="absolute bottom-0 right-0 w-40 h-40 bg-purple-300 rounded-full blur-3xl opacity-30"
                            animate={{
                                scale: [1.3, 1, 1.3],
                                opacity: [0.6, 0.3, 0.6],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />

                        <div className="relative z-10">
                            <motion.div
                                className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl mb-8"
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.8 }}
                            >
                                <Shield className="w-16 h-16 text-white" />
                            </motion.div>

                            <h1 className="text-5xl font-bold text-slate-800 mb-4">
                                Join StayEase
                            </h1>
                            <p className="text-xl text-slate-600 mb-6">
                                Create your account and start your journey to perfect stays.
                            </p>

                            <div className="space-y-4 mt-8">
                                {[
                                    { icon: Hotel, text: 'Access to premium hotels' },
                                    { icon: Shield, text: 'Secure bookings guaranteed' },
                                    { icon: CheckCircle, text: '24/7 customer support' },
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                            <item.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-slate-600">{item.text}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side - Register Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-white/20">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h2>
                            <p className="text-slate-500">Fill in your details to get started</p>
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

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('name')}
                                        className={`w-full pl-12 pr-4 py-3 text-base rounded-xl border-2 transition-all duration-200 ${touched.name && errors.name
                                            ? 'border-red-300 focus:border-red-500 bg-red-50'
                                            : touched.name && !errors.name
                                                ? 'border-green-300 focus:border-green-500 bg-green-50'
                                                : 'border-slate-200 focus:border-primary'
                                            } focus:outline-none focus:ring-4 focus:ring-primary/10`}
                                        placeholder="John Doe"
                                    />
                                    {touched.name && !errors.name && formData.name && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                {touched.name && errors.name && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-2 text-sm text-red-600 flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.name}
                                    </motion.p>
                                )}
                            </div>

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
                                        className={`w-full pl-12 pr-4 py-3 text-base rounded-xl border-2 transition-all duration-200 ${touched.email && errors.email
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

                            {/* Contact Number Field */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Contact Number
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="contactNo"
                                        value={formData.contactNo}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('contactNo')}
                                        maxLength={10}
                                        className={`w-full pl-12 pr-4 py-3 text-base rounded-xl border-2 transition-all duration-200 ${touched.contactNo && errors.contactNo
                                            ? 'border-red-300 focus:border-red-500 bg-red-50'
                                            : touched.contactNo && !errors.contactNo
                                                ? 'border-green-300 focus:border-green-500 bg-green-50'
                                                : 'border-slate-200 focus:border-primary'
                                            } focus:outline-none focus:ring-4 focus:ring-primary/10`}
                                        placeholder="1234567890"
                                    />
                                    {touched.contactNo && !errors.contactNo && formData.contactNo && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                {touched.contactNo && errors.contactNo && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-2 text-sm text-red-600 flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.contactNo}
                                    </motion.p>
                                )}
                                <p className="mt-1 text-xs text-slate-500">Must be exactly 10 digits</p>
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
                                        className={`w-full pl-12 pr-12 py-3 text-base rounded-xl border-2 transition-all duration-200 ${touched.password && errors.password
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
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="mt-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                                />
                                            </div>
                                            <span className={`text-xs font-medium ${passwordStrength.strength <= 2 ? 'text-red-600' :
                                                passwordStrength.strength <= 3 ? 'text-yellow-600' :
                                                    'text-green-600'
                                                }`}>
                                                {passwordStrength.label}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('confirmPassword')}
                                        className={`w-full pl-12 pr-12 py-3 text-base rounded-xl border-2 transition-all duration-200 ${touched.confirmPassword && errors.confirmPassword
                                            ? 'border-red-300 focus:border-red-500 bg-red-50'
                                            : touched.confirmPassword && !errors.confirmPassword
                                                ? 'border-green-300 focus:border-green-500 bg-green-50'
                                                : 'border-slate-200 focus:border-primary'
                                            } focus:outline-none focus:ring-4 focus:ring-primary/10`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                    {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && (
                                        <div className="absolute right-12 top-1/2 -translate-y-1/2 text-green-500">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                {touched.confirmPassword && errors.confirmPassword && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-2 text-sm text-red-600 flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.confirmPassword}
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
                                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-2xl hover:shadow-purple-500/30'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5" />
                                        Create Account
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-slate-600">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="font-bold text-primary hover:text-secondary transition-colors"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;