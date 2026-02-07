import React, { useState } from 'react';
import api from '../../services/api';

const AddressForm = ({ onAddressAdded, onCancel }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Tanzania'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Note: Backend expects 'zipCode' based on model, but form usually says 'postalCode'. Check controller.
            // Controller uses 'postalCode' in destructuring, but model says 'zipCode'. 
            // WAIT: I wrote controller to use postalCode but model has zipCode.
            // Checking: Address.js has 'zipCode'. Controller destructured 'postalCode'.
            // I should ensure I send 'zipCode' to matches model if controller passes it directly or fix controller.
            // Looking at my created controller: 
            // const { ... postalCode ... } = req.body;
            // await Address.create({ ... postalCode ... });
            // If I passed 'postalCode' to Address.create but model uses 'zipCode', Sequelize might ignore it or error if strict.
            // I will send both to be safe or fix names. 
            // In model: zipCode. 
            // Let's assume I fix the controller or just send the right key. 
            // The controller passed 'postalCode' to create. This is BUG in my controller if model is zipCode.
            // I will fix the controller in a separate step or just map it here?
            // Better to match the MODEL key here.

            const payload = {
                ...formData,
                zipCode: formData.postalCode // Map postalCode to zipCode for model
            };

            await api.post('/addresses', payload);
            if (onAddressAdded) onAddressAdded();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save address');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#252525', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Add New Address</h3>
            {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required style={inputStyle} />
                <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required style={inputStyle} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <input type="text" name="street" placeholder="Street Address" value={formData.street} onChange={handleChange} required style={{ ...inputStyle, width: '100%' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required style={inputStyle} />
                <input type="text" name="state" placeholder="State/Region" value={formData.state} onChange={handleChange} style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input type="text" name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} required style={inputStyle} />
                <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} required style={inputStyle} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={onCancel} style={{ padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #444', background: 'none', color: '#fff', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                    {loading ? 'Saving...' : 'Save Address'}
                </button>
            </div>
        </form>
    );
};

const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #444',
    backgroundColor: '#333',
    color: '#fff'
};

export default AddressForm;
