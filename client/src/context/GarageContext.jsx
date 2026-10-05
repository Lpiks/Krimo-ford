import React, { createContext, useContext, useState, useEffect } from 'react';

const GarageContext = createContext();

export const useGarage = () => useContext(GarageContext);

export const GarageProvider = ({ children }) => {
    const [selectedVehicle, setSelectedVehicle] = useState(() => {
        try {
            const saved = localStorage.getItem('krimo_user_vehicle');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [isGarageModalOpen, setIsGarageModalOpen] = useState(false);

    useEffect(() => {
        if (selectedVehicle) {
            localStorage.setItem('krimo_user_vehicle', JSON.stringify(selectedVehicle));
        } else {
            localStorage.removeItem('krimo_user_vehicle');
        }
    }, [selectedVehicle]);

    const selectVehicle = (vehicle) => {
        setSelectedVehicle(vehicle);
    };

    const clearVehicle = () => {
        setSelectedVehicle(null);
    };

    const openGarageModal = () => setIsGarageModalOpen(true);
    const closeGarageModal = () => setIsGarageModalOpen(false);

    // Fitment check helper
    const checkFitment = (product) => {
        if (!selectedVehicle || !product) {
            return { checked: false, compatible: null, message: 'no_vehicle' };
        }

        // If product has no compatibility data, consider it universal or not specified
        if (!product.compatibility || product.compatibility.length === 0) {
            return { checked: true, compatible: true, message: 'universal' };
        }

        // Check if any compatibility entry matches model and (optionally) year
        const match = product.compatibility.some((entry) => {
            const modelMatch = !entry.model || entry.model.toLowerCase() === selectedVehicle.model?.toLowerCase();
            const yearMatch = !entry.year || Number(entry.year) === Number(selectedVehicle.year);
            return modelMatch && yearMatch;
        });

        if (match) {
            return { checked: true, compatible: true, message: 'compatible' };
        }

        return { checked: true, compatible: false, message: 'incompatible' };
    };

    return (
        <GarageContext.Provider
            value={{
                selectedVehicle,
                selectVehicle,
                clearVehicle,
                checkFitment,
                isGarageModalOpen,
                openGarageModal,
                closeGarageModal,
            }}
        >
            {children}
        </GarageContext.Provider>
    );
};
