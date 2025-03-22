export const CHAINS = {
  ETHEREUM: 1,
  BASE: 8453,
  ZKSYNC: 324,
  MANTLE: 5000,
  STELLAR: 'STELLAR',
  POLKADOT: 'POLKADOT',
  WORLDCHAIN: 480,
};

export const getChainId = chain => {
  return CHAINS[chain.toUpperCase()];
};
