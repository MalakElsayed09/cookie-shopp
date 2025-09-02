import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const uri = process.env.MONGO_URI;
if (!uri) throw new Error('Missing MONGO_URI');

mongoose.connect(uri)
  .then(() => console.log('Mongo connected'))
  .catch(err => console.error('Mongo error', err));
