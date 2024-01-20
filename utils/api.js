import axios from 'axios';

export const getCoin = async () => {
  try {
    const response = await axios.get(process.env.API_URL, {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.TOKEN_COINMARKET,
      },
    });
		
  } catch (error) {}
};
