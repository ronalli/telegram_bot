import mongoose from 'mongoose';

const CryptoSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  price: String,
});

const CryptoCoin = mongoose.model('CryptoCoin', CryptoSchema);

export default CryptoCoin;
