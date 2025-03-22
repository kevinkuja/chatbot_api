export interface Token {
  address: string;
  decimals: number;
}

export interface TokenList {
  [chainId: number]: {
    [symbol: string]: Token;
  };
}

export interface TransactionResult {
  action: 'transfer' | 'invest';
  amount: number;
  token: string;
  to: string;
  chain: string;
  description?: string;
  message?: string;
}

export interface EVMTransaction {
  to: string;
  value: string;
  data: string | null;
}
