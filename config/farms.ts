import { Address } from "viem";

export const FARMS: Record<number, Record<string, Record<string, Address>>> = {
    [8453]: {
        AAVE: {
            pool: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5',
            USDC: '0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB',
        }
    },

    [324]: {
        AAVE: {
            pool: '0x78e30497a3c7527d953c6B1E3541b021A98Ac43c',
            USDT: '0xC48574bc5358c967d9447e7Df70230Fdb469e4E7',
            USDC: '0xE977F9B2a5ccf0457870a67231F23BE4DaecfbDb',
            ZK: '0xd6cD2c0fC55936498726CacC497832052A9B2D1B',
            WETH: '0xb7b93bCf82519bB757Fd18b23A389245Dbd8ca64'
        }
    } // ZkSync
 
};

export const getFarmAddress = (chain: number, token: string, farm: string) => {
    return FARMS[chain]?.[farm.toUpperCase()]?.[token.toUpperCase()];
};
