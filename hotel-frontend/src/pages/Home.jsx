import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotels } from '../redux/hotelSlice';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Users, Calendar, ArrowRight, Sparkles, Hotel, Phone, Filter, X } from 'lucide-react';

const Home = () => {
    const dispatch = useDispatch();
    const { hotels, loading, error } = useSelector((state) => state.hotels);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedHotelTypes, setSelectedHotelTypes] = useState([]);
    const [priceRange, setPriceRange] = useState(1000);

    useEffect(() => {
        dispatch(fetchHotels());
    }, [dispatch]);

    // Use Unsplash for beautiful hotel images
    const getHotelImage = (index) => {
        const unsplashImages = [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', // Luxury hotel
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop', // Hotel exterior
            'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop', // Beach hotel
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop', // City hotel
        ];
        return unsplashImages[index % unsplashImages.length];
    };

    // Handler for hotel type checkbox changes
    const handleHotelTypeChange = (type) => {
        setSelectedHotelTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    // Get estimated price for a hotel based on rooms
    const getHotelPrice = (hotel) => {
        if (hotel.rooms && hotel.rooms.length > 0) {
            const prices = hotel.rooms.map(room => room.roomPrice || 0);
            return Math.min(...prices);
        }
        return 100; // Default price if no rooms
    };

    const filteredHotels = hotels.filter(hotel => {
        // Search filter
        const matchesSearch = hotel.hotelName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hotel.location?.toLowerCase().includes(searchQuery.toLowerCase());

        // Hotel type filter
        const matchesType = selectedHotelTypes.length === 0 ||
            selectedHotelTypes.some(type =>
                hotel.hotelName?.toLowerCase().includes(type.toLowerCase()) ||
                hotel.location?.toLowerCase().includes(type.toLowerCase())
            );

        // Price filter
        const hotelPrice = getHotelPrice(hotel);
        const matchesPrice = hotelPrice <= priceRange;

        return matchesSearch && matchesType && matchesPrice;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-slate-600">Loading amazing stays...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-error m-4">{typeof error === 'string' ? error : 'Error loading hotels'}</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            {/* Hero Section with Background */}
            <div
                className="relative h-[500px] bg-cover bg-center flex items-center justify-center overflow-hidden"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('file:///C:/Users/Suraj/.gemini/antigravity/brain/00c81380-00de-486b-a013-08ed1910d8bd/hero_background_1770056611848.png')`
                }}
            >
                {/* Animated Background Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 animate-pulse"></div>

                {/* Hero Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center px-4 max-w-4xl"
                >
                    <div className="flex justify-center mb-6">
                        <Sparkles className="w-16 h-16 text-yellow-400 animate-bounce" />
                    </div>
                    <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
                        Find Your Perfect Stay
                    </h1>
                    <p className="text-2xl text-blue-100 mb-10 drop-shadow-md">
                        Discover luxury hotels, exclusive deals, and unforgettable experiences
                    </p>

                    {/* Search Bar */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-2xl max-w-2xl mx-auto">
                        <div className="flex items-center gap-3">
                            <Search className="w-6 h-6 text-slate-400 ml-2" />
                            <input
                                type="text"
                                placeholder="Search by hotel name or location..."
                                className="flex-1 p-3 outline-none text-lg bg-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="btn btn-primary px-8 rounded-xl normal-case text-lg">
                                Search
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
            </div>

            {/* Main Content with Sidebar */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <motion.aside
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="hidden lg:block w-80 flex-shrink-0"
                    >
                        <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Hotel className="w-7 h-7 text-primary" />
                                Quick Links
                            </h3>

                            <div className="space-y-3">
                                <Link
                                    to="/my-bookings"
                                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group"
                                >
                                    <Calendar className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                                    <span className="font-semibold text-slate-700">My Bookings</span>
                                </Link>

                                <Link
                                    to="/login"
                                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 group"
                                >
                                    <Users className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform" />
                                    <span className="font-semibold text-slate-700">Account</span>
                                </Link>
                            </div>

                            {/* Filter Section */}
                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                                        <Filter className="w-5 h-5 text-primary" />
                                        Hotel Types
                                    </h4>
                                    {selectedHotelTypes.length > 0 && (
                                        <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {selectedHotelTypes.length}
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {['Luxury Resort', 'Beach Hotel', 'City Hotel', 'Boutique'].map((type) => (
                                        <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors">
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary checkbox-sm"
                                                checked={selectedHotelTypes.includes(type)}
                                                onChange={() => handleHotelTypeChange(type)}
                                            />
                                            <span className="text-slate-600">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mt-6">
                                <h4 className="text-lg font-bold text-slate-700 mb-4">Price Range</h4>
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(Number(e.target.value))}
                                    className="range range-primary range-sm"
                                />
                                <div className="flex justify-between text-xs text-slate-500 mt-2">
                                    <span>$0</span>
                                    <span className="font-bold text-primary">${priceRange}</span>
                                    <span>$1000+</span>
                                </div>
                            </div>

                            {/* Clear Filters Button */}
                            {(selectedHotelTypes.length > 0 || priceRange < 1000) && (
                                <div className="mt-6">
                                    <button
                                        onClick={() => {
                                            setSelectedHotelTypes([]);
                                            setPriceRange(1000);
                                        }}
                                        className="w-full btn btn-outline btn-sm rounded-xl normal-case">
                                        Clear All Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.aside>

                    {/* Hotels Grid */}
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-4xl font-bold text-slate-800">
                                    Featured Hotels
                                    <span className="text-primary ml-3">({filteredHotels.length})</span>
                                </h2>
                            </div>

                            {filteredHotels.length === 0 ? (
                                <div className="text-center py-20">
                                    <Hotel className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                                    <p className="text-xl text-slate-500">No hotels found matching your search.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {filteredHotels.map((hotel, index) => (
                                        <motion.div
                                            key={hotel.hotelId}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                            className="group"
                                        >
                                            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                                                {/* Hotel Image */}
                                                <div className="relative h-64 overflow-hidden bg-slate-200">
                                                    <img
                                                        src={getHotelImage(index)}
                                                        alt={hotel.hotelName}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                    <div className="absolute top-4 right-4 bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-current" />
                                                        4.{8 + (index % 2)}
                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </div>

                                                {/* Hotel Details */}
                                                <div className="p-6">
                                                    <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors">
                                                        {hotel.hotelName}
                                                    </h3>

                                                    <div className="space-y-2 mb-4">
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <MapPin className="w-5 h-5 text-primary" />
                                                            <span>{hotel.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Phone className="w-5 h-5 text-secondary" />
                                                            <span className="text-sm">{hotel.contact}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                                        <div>
                                                            <p className="text-xs text-slate-500">Available Rooms</p>
                                                            <p className="text-lg font-bold text-primary">{hotel.rooms?.length || 0} Rooms</p>
                                                        </div>
                                                        <Link
                                                            to={`/hotel/${hotel.hotelId}`}
                                                            className="btn btn-primary btn-sm rounded-xl gap-2 normal-case group-hover:gap-3 transition-all"
                                                        >
                                                            View Details
                                                            <ArrowRight className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Decorative Background Blobs */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default Home;