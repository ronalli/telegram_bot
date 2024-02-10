import axios from 'axios';
import mongoose from 'mongoose';

const getCoin = async () => {
  try {
    const response = await axios.get(process.env.API_URL, {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    return { message: error };
  }
};

const connect = () => mongoose.connect(process.env.MONGOOSE_URL);

export default { getCoin, connect };
