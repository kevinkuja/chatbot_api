import { Token, TokenList } from '../types';

export const NATIVE = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
export const TOKENS: TokenList = {
  [1]: {
    // Ethereum
    ETH: {
      address: NATIVE,
      decimals: 18,
    },
    USDT: {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimals: 6,
    },
    USDC: {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      decimals: 6,
    },
    DAI: {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      decimals: 18,
    },
    WETH: {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      decimals: 18,
    },
    WBTC: {
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      decimals: 8,
    },
    LINK: {
      address: '0x513c7E3a7e1177F3B0f7094f8d212ddAcb408395',
      decimals: 18,
    },
    UNI: {
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      decimals: 18,
    },
    YFI: {
      address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
      decimals: 18,
    },
    AAVE: {
      address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
      decimals: 18,
    },
  },
  [8453]: {
    // Base
    ETH: {
      address: NATIVE,
      decimals: 18,
    },
    WETH: {
      address: '0x4200000000000000000000000000000000000006',
      decimals: 18,
    },
    USDC: {
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      decimals: 6,
    },
    WBTC: {
      address: '0x0555E30da8f98308EdB960aa94C0Db47230d2B9c',
      decimals: 8,
    },
    USDT: {
      address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
      decimals: 6,
    },
  },
  [324]: {
    // zkSync
    ETH: {
      address: NATIVE,
      decimals: 18,
    },
    USDT: {
      address: '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4',
      decimals: 6,
    },
    WETH: {
      address: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
      decimals: 18,
    },
    WBTC: {
      address: '0xBBeB516fb02a01611cBBE0453Fe3c580D7281011',
      decimals: 8,
    },
  },
  [5000]: {
    // Mantle
    MNT: {
      address: NATIVE,
      decimals: 18,
    },
    WMNT: {
      address: '0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8',
      decimals: 18,
    },
    WETH: {
      address: '0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111',
      decimals: 18,
    },
    USDC: {
      address: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9',
      decimals: 6,
    },
    WBTC: {
      address: '0xCAbAE6f6Ea1ecaB08Ad02fE02ce9A44F09aebfA2',
      decimals: 8,
    },
    USDT: {
      address: '0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE',
      decimals: 6,
    },
  },
  [480]: {
    // Worldchain
    ETH: {
      address: NATIVE,
      decimals: 18,
    },
    WLD: {
      address: '0x2cFc85d8E48F8EAB294be644d9E25C3030863003',
      decimals: 18,
    },
    'USDC.E': {
      address: '0x79A02482A880bCE3F13e09Da970dC34db4CD24d1',
      decimals: 6,
    },
    WBTC: {
      address: '0x03c7054bcb39f7b2e5b2c7acb37583e32d70cfa3',
      decimals: 18,
    },
    WETH: {
      address: '0x4200000000000000000000000000000000000006',
      decimals: 18,
    },
    SDAI: {
      address: '0x859dbe24b90c9f2f7742083d3cf59ca41f55be5d',
      decimals: 18,
    },
  },
};

export const getTokenAddress = (chain: number, token: string): Token => {
  return TOKENS[chain][token.toUpperCase()];
};
