import { encodeFunctionData, parseAbi, parseUnits, Address } from 'viem';
import { getTokenAddress, NATIVE } from '../config/tokens.js';
import { getChainId } from '../config/chains.js';
import { TransactionResult, EVMTransaction } from '../types';

const erc20Abi = ['function transfer(address, uint256)'] as const;

export const generateTx = (result: TransactionResult): Promise<EVMTransaction | null> => {
  switch (result.action) {
    case 'transfer':
      return generateTransferTx(result);
    default:
      return Promise.resolve(null);
  }
};

const generateTransferTx = async (result: TransactionResult): Promise<EVMTransaction | null> => {
  switch (result.chain) {
    default:
      return generateEVMTransferTx(result);
  }
};

const generateEVMTransferTx = async (result: TransactionResult): Promise<EVMTransaction> => {
  const chain = getChainId(result.chain);
  const token = getTokenAddress(chain as number, result.token);
  const amount = parseUnits(result.amount.toString(), token.decimals);
  const tx = encodeFunctionData({
    abi: parseAbi(erc20Abi),
    functionName: 'transfer',
    args: [result.to as Address, amount],
  });

  return {
    to: token.address,
    value: token.address === NATIVE ? amount.toString() : '0',
    data: token.address !== NATIVE ? tx : null,
  };
};
