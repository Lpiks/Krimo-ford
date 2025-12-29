import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';

const ClientLayout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default ClientLayout;
