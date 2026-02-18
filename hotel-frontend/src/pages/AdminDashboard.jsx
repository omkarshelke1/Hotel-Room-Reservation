import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotels } from '../redux/hotelSlice';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { hotels, loading, error } = useSelector((state) => state.hotels);
    const [deleteLoading, setDeleteLoading] = useState(null);

    useEffect(() => {
        dispatch(fetchHotels());
    }, [dispatch]);

    const handleDeleteHotel = async (hotelId) => {
        if (window.confirm('Are you sure you want to delete this hotel?')) {
            try {
                setDeleteLoading(hotelId);
                await api.delete(`/admin/delete-hotel/${hotelId}`);
                dispatch(fetchHotels()); // Refresh list
                setDeleteLoading(null);
            } catch (err) {
                alert('Failed to delete hotel');
                setDeleteLoading(null);
            }
        }
    };

    if (loading) return <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard: Hotels</h1>
                <Link to="/admin/add-hotel" className="btn btn-primary">+ Add New Hotel</Link>
            </div>

            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Contact</th>
                            <th>Rooms</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hotels.map((hotel) => (
                            <tr key={hotel.hotelId}>
                                <th>{hotel.hotelId}</th>
                                <td>
                                    <div className="flex items-center space-x-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={`https://placehold.co/100?text=${hotel.hotelName.charAt(0)}`} alt="Avatar" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{hotel.hotelName}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{hotel.location}</td>
                                <td>{hotel.contact}</td>
                                <td>{hotel.rooms?.length || 0}</td>
                                <td>
                                    <Link to={`/hotel-manage/${hotel.hotelId}`} className="btn btn-sm btn-ghost">Manage Rooms</Link>
                                    <button
                                        onClick={() => handleDeleteHotel(hotel.hotelId)}
                                        className={`btn btn-sm btn-error ml-2 ${deleteLoading === hotel.hotelId ? 'loading' : ''}`}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;