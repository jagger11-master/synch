import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false }) => {
    if (fullScreen) {
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999
            }}>
                <Loader2 className="animate-spin" size={48} color="var(--red-primary)" />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Loader2 className="animate-spin" size={32} color="var(--red-primary)" />
        </div>
    );
};

export default Loader;
