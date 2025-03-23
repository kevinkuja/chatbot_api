import { encodeFunctionData, parseAbi, parseUnits, Address } from 'viem';
import { getTokenAddress, NATIVE } from '../config/tokens.js';
import { getChainId } from '../config/chains.js';
import { TransactionResult, EVMTransaction } from '../types';
import { FARMS } from '../config/farms.js';
import aavePoolAbi from '../abis/aavePool.js';

const erc20Abi = [
  'function transfer(address, uint256)',
  'function approve(address, uint256)',
] as const;

export const generateTxs = async (
  caller: Address,
  result: TransactionResult
): Promise<EVMTransaction[]> => {
  const txs: EVMTransaction[] = [];
  switch (result.action) {
    case 'transfer':
      txs.push(await generateTransferTx(result));
      break;
    case 'invest':
      txs.push(...(await generateInvestTx(caller, result)));
      break;
    default:
      return Promise.resolve([]);
  }
  return txs;
};

const generateInvestTx = async (
  caller: Address,
  result: TransactionResult
): Promise<EVMTransaction[]> => {
  switch (result.chain) {
    default:
      return generateEVMInvestTx(caller, result);
  }
};

const generateEVMInvestTx = async (
  caller: Address,
  result: TransactionResult
): Promise<EVMTransaction[]> => {
  const chain = getChainId(result.chain);
  const token = getTokenAddress(chain as number, result.token);

  if (!token) {
    throw new Error(`Token ${result.token} not found on chain ${chain}`);
  }

  const amount = parseUnits(result.amount.toString(), token.decimals);
  const pool = FARMS[chain as number][result.to.toUpperCase()].pool;
  const txs: EVMTransaction[] = [];

  const approvalTx = encodeFunctionData({
    abi: parseAbi(erc20Abi),
    functionName: 'approve',
    args: [pool as Address, amount],
  });
  txs.push({
    functionName: 'approve',
    to: token.address,
    value: '0',
    data: approvalTx,
  });

  const tx = encodeFunctionData({
    abi: aavePoolAbi,
    functionName: 'deposit',
    args: [token.address as Address, amount, caller as Address, 0],
  });
  txs.push({
    functionName: 'deposit',
    to: pool,
    value: '0',
    data: tx,
  });
  return txs;
};

const generateTransferTx = async (result: TransactionResult): Promise<EVMTransaction> => {
  switch (result.chain) {
    default:
      return generateEVMTransferTx(result);
  }
};

const generateEVMTransferTx = async (result: TransactionResult): Promise<EVMTransaction> => {
  const chain = getChainId(result.chain);
  const token = getTokenAddress(chain as number, result.token);
  if (!token) {
    throw new Error(`Token ${result.token} not found on chain ${chain}`);
  }
  const amount = parseUnits(result.amount.toString(), token.decimals);
  const tx = encodeFunctionData({
    abi: parseAbi(erc20Abi),
    functionName: 'transfer',
    args: [result.to as Address, amount],
  });

  return {
    functionName: 'transfer',
    to: token.address === NATIVE ? result.to : token.address,
    value: token.address === NATIVE ? amount.toString() : '0',
    data: token.address !== NATIVE ? tx : null,
  };
};
