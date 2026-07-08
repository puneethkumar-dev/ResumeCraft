const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const testConn = async () => {
  try {
    console.log('Connecting to database...');
    console.log('URI:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully!');
    await mongoose.disconnect();
    console.log('Disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('Connection failed:', error);
    process.exit(1);
  }
};

testConn();
