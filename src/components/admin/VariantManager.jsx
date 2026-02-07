import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const VariantManager = ({ variants, setVariants }) => {
    const [newVariant, setNewVariant] = useState({ name: '', value: '', priceModifier: 0, stock: 0 });

    const handleAdd = () => {
        if (!newVariant.name || !newVariant.value) return;
        setVariants([...variants, newVariant]);
        setNewVariant({ name: '', value: '', priceModifier: 0, stock: 0 });
    };

    const handleRemove = (index) => {
        const updated = variants.filter((_, i) => i !== index);
        setVariants(updated);
    };

    return (
        <div style={{ padding: '1.5rem', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#252525' }}>
            <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Product Variants</h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                    placeholder="Name (e.g. Size)"
                    value={newVariant.name}
                    onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                    style={inputStyle}
                />
                <input
                    placeholder="Value (e.g. XL)"
                    value={newVariant.value}
                    onChange={(e) => setNewVariant({ ...newVariant, value: e.target.value })}
                    style={inputStyle}
                />
                <input
                    type="number"
                    placeholder="Price (+/-)"
                    value={newVariant.priceModifier}
                    onChange={(e) => setNewVariant({ ...newVariant, priceModifier: parseFloat(e.target.value) })}
                    style={inputStyle}
                />
                <input
                    type="number"
                    placeholder="Stock"
                    value={newVariant.stock}
                    onChange={(e) => setNewVariant({ ...newVariant, stock: parseInt(e.target.value) })}
                    style={inputStyle}
                />
                <button type="button" onClick={handleAdd} className="btn btn-primary" style={{ padding: '0.5rem' }}>
                    <Plus size={20} />
                </button>
            </div>

            {variants.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {variants.map((v, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: '#333', borderRadius: '4px' }}>
                            <span style={{ color: '#fff', fontSize: '0.9rem' }}>
                                <strong>{v.name}:</strong> {v.value}
                                <span style={{ color: '#aaa', marginLeft: '0.5rem' }}>
                                    (${v.priceModifier > 0 ? '+' : ''}{v.priceModifier}) - {v.stock} in stock
                                </span>
                            </span>
                            <button type="button" onClick={() => handleRemove(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ color: '#666', fontSize: '0.9rem' }}>No variants added.</p>
            )}
        </div>
    );
};

const inputStyle = {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #444',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    width: '100%'
};

export default VariantManager;
