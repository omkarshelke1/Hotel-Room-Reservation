import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoomsByHotel, fetchAvailableRooms, clearRooms } from '../redux/hotelSlice';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const HotelDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { rooms, loading, error } = useSelector((state) => state.hotels);
    const { token, user, role, userId } = useSelector((state) => state.auth);

    // Date Selection State
    const [searchParams, setSearchParams] = useState({
        checkIn: '',
        checkOut: ''
    });

    useEffect(() => {
        dispatch(clearRooms());
        if (id) {
            dispatch(fetchRoomsByHotel(id));
        }
    }, [dispatch, id]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchParams.checkIn && searchParams.checkOut) {
            dispatch(fetchAvailableRooms({
                hotelId: id,
                checkIn: searchParams.checkIn,
                checkOut: searchParams.checkOut
            }));
        } else {
            alert('Please select both Check-in and Check-out dates');
        }
    };

    const handleBookRoom = async (room) => {
        if (!token) return navigate('/login');
        if (!searchParams.checkIn || !searchParams.checkOut) {
            alert('Please select dates before booking.');
            return;
        }

        // Get userId from Redux state
        const userIdValue = userId || localStorage.getItem('userId') || user?.id || user?.userId;

        if (!userIdValue) {
            alert("User ID missing. Please login again.");
            navigate('/login');
            return;
        }

        // Navigate to payment checkout page with booking details
        navigate('/payment-checkout', {
            state: {
                bookingDetails: {
                    userId: userIdValue,
                    room: room,
                    checkInDate: searchParams.checkIn,
                    checkOutDate: searchParams.checkOut
                }
            }
        });
    };

    if (loading) return <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg"></span></div>;
    if (error) return <div className="alert alert-error m-4">{typeof error === 'string' ? error : 'Error loading data'}</div>;

    return (
        <div className="py-10">
            <h2 className="text-3xl font-bold text-center mb-6">Available Rooms</h2>

            {/* Search Bar */}
            <div className="card bg-base-100 shadow-md p-6 mb-8 mx-auto max-w-4xl border border-base-200">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="form-control w-full">
                        <label className="label">Check In Date</label>
                        <input type="date" className="input input-bordered" required
                            value={searchParams.checkIn} onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                        />
                    </div>
                    <div className="form-control w-full">
                        <label className="label">Check Out Date</label>
                        <input type="date" className="input input-bordered" required
                            value={searchParams.checkOut} onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full md:w-auto">Check Availability</button>
                    {(searchParams.checkIn || searchParams.checkOut) &&
                        <button type="button" className="btn btn-ghost" onClick={() => dispatch(fetchRoomsByHotel(id))}>Reset</button>
                    }
                </form>
            </div>

            {rooms.length === 0 ? (
                <div className="text-center">No rooms available. Try different dates or hotel.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div key={room.roomId} className="card bg-base-100 shadow-xl border border-base-200">
                            <figure className="h-48 overflow-hidden">
                                <img src={room.imageUrl || `https://placehold.co/400x300?text=${room.roomType}`} alt={room.roomType} className="w-full h-full object-cover" />
                            </figure>
                            <div className="card-body">
                                <h3 className="card-title justify-between">
                                    {room.roomType}
                                    <div className="badge badge-secondary">${room.roomPrice}</div>
                                </h3>
                                <p>Room Number: <span className="font-semibold">{room.roomNumber}</span></p>

                                <div className="card-actions justify-end mt-4">
                                    {(token && role !== 'ADMIN') ? (
                                        <button
                                            className="btn btn-primary"
                                            // Optional: Disable if dates not selected? Or prompt user.
                                            onClick={() => handleBookRoom(room)}
                                        >
                                            Book Now
                                        </button>
                                    ) : !token ? (
                                        <Link to="/login" className="btn btn-outline">Login to Book</Link>
                                    ) : (
                                        <button className="btn btn-disabled">Admin View</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6 text-center">
                <Link to="/" className="btn btn-link">← Back to Hotels</Link>
            </div>
        </div>
    );
};

export default HotelDetails;
