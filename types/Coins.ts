import { Coin } from './CoinServerResponse.js';

type Coins = Coin[];
type Status = {
  timestamp: string;
  error_code: number;
  error_message: any;
  elapsed: number;
  credit_count: number;
  notice: any;
  total_count: number;
};

export interface Response {
  status: Status;
  data: Coins;
}
