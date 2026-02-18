import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddHotel = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        hotelName: '',
        location: '',
        contact: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post('/admin/add-hotel', {
                ...formData,
                rooms: [] // Initialize with empty rooms if required by backend, existing schema implies rooms can be included.
            });
            alert('Hotel added successfully!');
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data || 'Failed to add hotel');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center py-10">
            <div className="card w-full max-w-lg bg-base-100 shadow-xl border border-base-200">
                <div className="card-body">
                    <h2 className="card-title justify-center mb-4">Add New Hotel</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Hotel Name</span>
                            </label>
                            <input
                                type="text"
                                name="hotelName"
                                className="input input-bordered"
                                value={formData.hotelName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-control mt-4">
                            <label className="label">
                                <span className="label-text">Location</span>
                            </label>
                            <input
                                type="text"
                                name="location"
                                className="input input-bordered"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-control mt-4">
                            <label className="label">
                                <span className="label-text">Contact</span>
                            </label>
                            <input
                                type="text"
                                name="contact"
                                className="input input-bordered"
                                value={formData.contact}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {error && <div className="alert alert-error mt-4">{error}</div>}

                        <div className="card-actions justify-end mt-6">
                            <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin')}>Cancel</button>
                            <button type="submit" className={`btn btn-primary ${loading ? 'loading' : ''}`}>Add Hotel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddHotel;
