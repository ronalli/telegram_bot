import axios, { AxiosError } from 'axios';
import mongoose from 'mongoose';
import { IResponse } from '../types/Coins';

type ResponseCoins = {
  success: boolean;
  message?: Error;
  data?: IResponse;
};

export async function getCoins(): Promise<ResponseCoins> {
  try {
    const response = await axios.get<IResponse>(process.env.API_URL, {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.API_KEY,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error };
  }
}

const connect = () => mongoose.connect(process.env.MONGOOSE_URL);

export default { getCoins, connect };
