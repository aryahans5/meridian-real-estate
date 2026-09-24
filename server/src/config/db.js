const mongoose = require('mongoose');

let memoryServer;

async function connectDB() {
  let uri = process.env.MONGODB_URI;

  if (!uri || process.env.USE_MEMORY_MONGO === '1') {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri('meridian');
    console.log('Using in-memory MongoDB (ephemeral)');
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected');
}

module.exports = connectDB;
