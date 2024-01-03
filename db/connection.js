
const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URL);

    const db = mongoose.connection;

    db.on('error', (error) => {
        console.error('MongoDB connection error:', error);
    });

    db.once('open', () => {
        console.log('Connected to MongoDB');
    });
};

module.exports = connectDB;
