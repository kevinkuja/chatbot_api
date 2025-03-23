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
  action: 'transfer' | 'invest' | 'swap';
  amount: number;
  token: string;
  to: string;
  chain: string;
  description?: string;
  message?: string;
  tokenFrom?: string;
  tokenTo?: string;
}

export interface EVMTransaction {
  functionName: string;
  to: string;
  value: string;
  data: string | null;
}
