import axios from 'axios';
import mongoose from 'mongoose';

export const getCoin = async () => {
  try {
    const response = await axios.get(process.env.API_URL, {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.TOKEN_COINMARKET,
      },
    });
    return response.data;
  } catch (error) {
    return { message: error };
  }
};

export const connectDB = () =>
  mongoose.connect(
    `mongodb+srv://${process.env.USER_MG}:${process.env.PASSWORD_MG}@cluster0.kokvpr9.mongodb.net/`
  );
