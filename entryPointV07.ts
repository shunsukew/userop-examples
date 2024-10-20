import * as dotenv from "dotenv"
import { soneiumMinato } from 'viem/chains'
import { createPublicClient, http, Hex, encodeFunctionData } from 'viem'
import { createBundlerClient } from 'viem/account-abstraction'
import { privateKeyToAccount } from 'viem/accounts'
import { toSimpleSmartAccount } from "permissionless/accounts"

dotenv.config();

const privateKey = process.env.PRIVATE_KEY! as Hex;

const entryPoint07Address = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";
const entryPoint07AccountFactoryAddress = "0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985";
const testCounterAddress = "0x6bcf154A6B80fDE9bd1556d39C9bCbB19B539Bd8";
console.log('EntryPointAddress:', entryPoint07Address, 'AccountFactoryAddress:', entryPoint07AccountFactoryAddress, 'TestCounterAddress:', testCounterAddress);

async function main() {
	const publicClient = createPublicClient({
		chain: soneiumMinato,
		transport: http(process.env.NETWORK_URL!)
	})

	const simpleAccount = await toSimpleSmartAccount({
		client: publicClient,
		owner: privateKeyToAccount(privateKey),
		factoryAddress: entryPoint07AccountFactoryAddress,
		entryPoint: {
			address: entryPoint07Address,
			version: "0.7",
		},
	})

	const accountBalance = await publicClient.getBalance({address: simpleAccount.address});
	console.log('using prefund account address', accountBalance, 'with balance', accountBalance.toString());
	if (accountBalance === BigInt(0) ) {
		console.error('prefund account has no balance, userOP may fail without Paymaster');
	}

	const bundlerClient = createBundlerClient({
		client: publicClient,
		transport: http(process.env.BUNDLER_URL!)
	})

	const counterAbi = [
		{
			inputs: [],
			name: "count",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
	];
	const callData = encodeFunctionData({
		abi: counterAbi,
		functionName: 'count'
	})

	const userOperation = await bundlerClient.prepareUserOperation({ 
		account: simpleAccount,
		calls: [{
			to: testCounterAddress,
			value: 0n,
			data: callData,
	  	}],
	})

	console.log('UserOperation:', userOperation);

	const userOpHash = await bundlerClient.sendUserOperation({ 
		account: simpleAccount,
		calls: [{
		  to: testCounterAddress,
		  value: 0n,
		  data: callData,
		}],
	})

	const receipt = await bundlerClient.waitForUserOperationReceipt({ 
		hash: userOpHash,
	})
	
	console.log(`User operation included: https://explorer-testnet.soneium.org/tx/${receipt.receipt.transactionHash}`)
}

main().catch((err) => console.error("Error:", err));
