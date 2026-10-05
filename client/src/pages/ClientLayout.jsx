import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';
import GarageBar from '../components/shared/GarageBar';
import GarageModal from '../components/shared/GarageModal';
import WhatsAppButton from '../components/shared/WhatsAppButton';
import MobileBottomNav from '../components/shared/MobileBottomNav';

const ClientLayout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
            <Header />
            <GarageBar />
            <GarageModal />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
            <Footer />
            <WhatsAppButton />
            <MobileBottomNav />
        </div>
    );
};

export default ClientLayout;
