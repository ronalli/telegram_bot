import { PersonalAccount } from '../models/User.js';
import { CoinServer } from './CoinServerResponse.js';

type Coins = CoinServer[];
type Status = {
  timestamp: string;
  error_code: number;
  error_message: any;
  elapsed: number;
  credit_count: number;
  notice: any;
  total_count: number;
};

export interface IResponse {
  status: Status;
  data: Coins;
}

export interface IObjectData {
  price: number;
  number: number;
}

interface IO {
  [key: string]: IObjectData;
}

interface IStringData {
  [key: string]: string;
}

export type DataFusion = IO | IStringData;

export type Response = {
  message: string | Error;
  success: boolean;
  data?: PersonalAccount;
};
