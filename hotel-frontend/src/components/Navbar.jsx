import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Hotel, Calendar, LogOut, User, Menu, X, Building2, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { token, role } = useSelector((state) => state.auth);
    const isLoggedIn = !!token;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        setMobileMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, children, icon: Icon, onClick }) => (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
                to={to}
                onClick={onClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 relative ${isActive(to)
                        ? 'text-white'
                        : 'text-blue-50 hover:text-white'
                    }`}
            >
                {Icon && <Icon className="w-4 h-4" />}
                {children}
                {isActive(to) && (
                    <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 bg-white/20 rounded-xl -z-10"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                )}
            </Link>
        </motion.div>
    );

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-gradient-to-r from-primary/95 via-blue-600/95 to-secondary/95 backdrop-blur-lg shadow-2xl'
                    : 'bg-gradient-to-r from-primary via-blue-600 to-secondary shadow-xl'
                }`}
        >
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Animated Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <motion.div
                            className="relative"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Building2 className="w-10 h-10 text-yellow-400 drop-shadow-lg" />
                            <motion.div
                                className="absolute -inset-2 bg-yellow-400/30 rounded-full blur-md"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 0.8, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            />
                        </motion.div>
                        <div>
                            <motion.h1
                                className="text-2xl font-bold text-white tracking-tight"
                                whileHover={{ scale: 1.05 }}
                            >
                                StayEase
                            </motion.h1>
                            <motion.p
                                className="text-xs text-blue-100 -mt-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                Your Perfect Stay Awaits
                            </motion.p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-2">
                        <NavLink to="/" icon={Home}>Home</NavLink>

                        {!isLoggedIn ? (
                            <>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link
                                        to="/login"
                                        className="px-6 py-2 rounded-xl font-medium text-white hover:bg-white/10 transition-all duration-300"
                                    >
                                        Login
                                    </Link>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        to="/register"
                                        className="px-6 py-2 rounded-xl font-bold text-primary bg-white hover:bg-blue-50 transition-all duration-300 shadow-lg"
                                    >
                                        Register
                                    </Link>
                                </motion.div>
                            </>
                        ) : (
                            <>
                                {role === 'ADMIN' ? (
                                    <>
                                        <NavLink to="/admin" icon={Hotel}>Hotels</NavLink>
                                        <NavLink to="/admin/bookings" icon={Calendar}>All Bookings</NavLink>
                                    </>
                                ) : (
                                    <>
                                        <NavLink to="/customer" icon={Hotel}>Hotels</NavLink>
                                        <NavLink to="/my-bookings" icon={Calendar}>My Bookings</NavLink>
                                    </>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(220, 38, 38, 0.4)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-6 py-2 ml-2 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-300 shadow-lg"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </motion.button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                    >
                        <AnimatePresence mode="wait">
                            {mobileMenuOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X className="w-6 h-6" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Menu className="w-6 h-6" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="lg:hidden pb-4 border-t border-white/10 mt-2"
                        >
                            <motion.div
                                className="flex flex-col gap-2 mt-4"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.1,
                                        },
                                    },
                                }}
                            >
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0, x: -20 },
                                        visible: { opacity: 1, x: 0 },
                                    }}
                                >
                                    <Link
                                        to="/"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/')
                                                ? 'bg-white/20 text-white'
                                                : 'text-blue-50 hover:bg-white/10'
                                            }`}
                                    >
                                        <Home className="w-5 h-5" />
                                        Home
                                    </Link>
                                </motion.div>

                                {!isLoggedIn ? (
                                    <>
                                        <motion.div
                                            variants={{
                                                hidden: { opacity: 0, x: -20 },
                                                visible: { opacity: 1, x: 0 },
                                            }}
                                        >
                                            <Link
                                                to="/login"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="px-4 py-3 rounded-xl font-medium text-white hover:bg-white/10 transition-all block"
                                            >
                                                Login
                                            </Link>
                                        </motion.div>
                                        <motion.div
                                            variants={{
                                                hidden: { opacity: 0, x: -20 },
                                                visible: { opacity: 1, x: 0 },
                                            }}
                                        >
                                            <Link
                                                to="/register"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="px-4 py-3 rounded-xl font-bold text-primary bg-white hover:bg-blue-50 transition-all text-center block"
                                            >
                                                Register
                                            </Link>
                                        </motion.div>
                                    </>
                                ) : (
                                    <>
                                        {role === 'ADMIN' ? (
                                            <>
                                                <motion.div
                                                    variants={{
                                                        hidden: { opacity: 0, x: -20 },
                                                        visible: { opacity: 1, x: 0 },
                                                    }}
                                                >
                                                    <NavLink to="/admin" icon={Hotel} onClick={() => setMobileMenuOpen(false)}>
                                                        Hotels
                                                    </NavLink>
                                                </motion.div>
                                                <motion.div
                                                    variants={{
                                                        hidden: { opacity: 0, x: -20 },
                                                        visible: { opacity: 1, x: 0 },
                                                    }}
                                                >
                                                    <NavLink to="/admin/bookings" icon={Calendar} onClick={() => setMobileMenuOpen(false)}>
                                                        All Bookings
                                                    </NavLink>
                                                </motion.div>
                                            </>
                                        ) : (
                                            <>
                                                <motion.div
                                                    variants={{
                                                        hidden: { opacity: 0, x: -20 },
                                                        visible: { opacity: 1, x: 0 },
                                                    }}
                                                >
                                                    <NavLink to="/customer" icon={Hotel} onClick={() => setMobileMenuOpen(false)}>
                                                        Hotels
                                                    </NavLink>
                                                </motion.div>
                                                <motion.div
                                                    variants={{
                                                        hidden: { opacity: 0, x: -20 },
                                                        visible: { opacity: 1, x: 0 },
                                                    }}
                                                >
                                                    <NavLink to="/my-bookings" icon={Calendar} onClick={() => setMobileMenuOpen(false)}>
                                                        My Bookings
                                                    </NavLink>
                                                </motion.div>
                                            </>
                                        )}
                                        <motion.div
                                            variants={{
                                                hidden: { opacity: 0, x: -20 },
                                                visible: { opacity: 1, x: 0 },
                                            }}
                                        >
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-all w-full"
                                            >
                                                <LogOut className="w-5 h-5" />
                                                Logout
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Animated bottom border */}
            <motion.div
                className="h-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            />
        </motion.nav>
    );
};

export default Navbar;