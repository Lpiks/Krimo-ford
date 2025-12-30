const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany({ email: process.env.ADMIN_EMAIL });

        const adminUser = {
            name: 'Admin User',
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: 'admin'
        };

        await User.create(adminUser);

        // Seed Categories if empty
        const Category = require('./models/Category');
        const countCat = await Category.countDocuments();
        if (countCat === 0) {
            const categories = ['Brakes', 'Filters', 'Suspension', 'Engine', 'Electrical', 'Body', 'Accessories'];
            await Category.insertMany(categories.map(name => ({ name })));
            console.log('Categories Imported!');
        }

        // Seed CarModels if empty
        const CarModel = require('./models/CarModel');
        const countCar = await CarModel.countDocuments();
        if (countCar === 0) {
            const carModels = [
                "B-Max", "Bronco", "C-Max", "EcoSport", "Edge", "Escape", "Everest",
                "Expedition", "Explorer", "F-150", "Marriner", "Fiesta", "Figo",
                "Flex", "Focus", "Fusion", "Galaxy", "GT", "Ka", "Kuga",
                "Mondeo", "Mustang", "Puma", "Ranger", "S-Max", "Taurus",
                "Territory", "Tourneo", "Transit", "Transit Connect", "Transit Custom"
            ];
            await CarModel.insertMany(carModels.map(name => ({ name })));
            console.log('CarModels Imported!');
        }

        console.log('Admin User Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
