import { Schema, model } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface PersonalCoin {
  date: Date;
  name: string;
  price: string;
  number: string;
  _id?: ObjectId;
}

const CryptoSchema = new Schema<PersonalCoin>({
  name: String,
  number: String,
  price: String,
  date: Date,
  _id: ObjectId,
});

const CryptoCoin = model('CryptoCoin', CryptoSchema);

export default CryptoCoin;
