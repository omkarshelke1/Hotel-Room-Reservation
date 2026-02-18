import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBookings } from '../redux/bookingSlice';

const AdminBookings = () => {
    const dispatch = useDispatch();
    const { bookings, loading, error } = useSelector((state) => state.bookings);

    useEffect(() => {
        dispatch(fetchAllBookings());
    }, [dispatch]);

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">All Bookings (Admin)</h1>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Room</th>
                            <th>Dates</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.bookingId}>
                                <th>{booking.bookingId}</th>
                                <td>
                                    <div className="font-bold">{booking.user?.name || booking.user?.username}</div>
                                    <div className="text-sm opacity-50">{booking.user?.email}</div>
                                </td>
                                <td>
                                    <span className="badge badge-ghost badge-sm">{booking.room?.roomNumber}</span>
                                    <br />
                                    {booking.room?.roomType}
                                </td>
                                <td>{booking.checkInDate} - {booking.checkOutDate}</td>
                                <td>
                                    {/* No cancel booking endpoint for admin in provided list, just viewing */}
                                    <span className="badge badge-success">Confirmed</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bookings.length === 0 && <div className="text-center p-4">No bookings found.</div>}
            </div>
        </div>
    );
};

export default AdminBookings;