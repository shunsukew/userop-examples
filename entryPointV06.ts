import * as dotenv from "dotenv"
import * as ethers from "ethers"
import { BigNumber } from "ethers"
import { SimpleAccountAPI } from "@account-abstraction/sdk"
import { UserOperationStruct } from '@account-abstraction/contracts';

export interface UserOperationV6 {
	sender: string;
	nonce: bigint;
	initCode: string;
	callData: string;
	callGasLimit: bigint;
	verificationGasLimit: bigint;
	preVerificationGas: bigint;
	maxFeePerGas: bigint;
	maxPriorityFeePerGas: bigint;
	paymasterAndData: string;
	signature: string;
}

dotenv.config()

const privateKey = process.env.PRIVATE_KEY ?? ""
if (privateKey === "") {
    console.error("PRIVATE_KEY is not set")
    process.exit(1)
}

const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const accountFactoryAddress = "0x9406Cc6185a346906296840746125a0E44976454";
const testCounterAddress = "0x6bcf154A6B80fDE9bd1556d39C9bCbB19B539Bd8";
console.log('EntryPointAddress:', entryPointAddress, 'AccountFactoryAddress:', accountFactoryAddress, 'TestCounterAddress:', testCounterAddress)

async function main() {
	const provider = new ethers.providers.JsonRpcProvider('https://rpc.minato.soneium.org')
	const signer = new ethers.Wallet(privateKey, provider);

	const bundlerProvider = new ethers.providers.JsonRpcProvider('http://soneium-minato.bundler.scs.startale.com?apikey=admin_a4fngiki7JaTk9QEixZbVzjXF6XAp3km')

	const prefundAccountAddress = await signer.getAddress()
	const prefundAccountBalance = await provider.getBalance(prefundAccountAddress)
	console.log('using prefund account address', prefundAccountAddress, 'with balance', prefundAccountBalance.toString())

	const walletAPI = new SimpleAccountAPI({
    	provider, 
    	entryPointAddress,
    	owner: signer,
    	factoryAddress: accountFactoryAddress
	})

	const op = await walletAPI.createSignedUserOp({
  		target: testCounterAddress,
  		data: "0x",
	})

	async function resolvePromises(op: UserOperationStruct): Promise<UserOperationV6> {
  		// const nonce: BigNumber = await op.nonce
  		const preVerificationGas: number = await op.preVerificationGas
  		return {
    		sender: await op.sender,
    		nonce: await nonce,
    		initCode: op.initCode,
    		callData: op.callData,
    		callGasLimit: op.callGasLimit.toHexString(),
    		verificationGasLimit: op.verificationGasLimit.toHexString(),
    		maxFeePerGas: op.maxFeePerGas.toHexString(),
    		maxPriorityFeePerGas: op.maxPriorityFeePerGas.toHexString(),
    		paymasterAndData: op.paymasterAndData,
    		preVerificationGas: preVerificationGas,
    		signature: await op.signature
  		};
	}

	resolvePromises(op).then(async resolvedOp => {
		console.log('UserOp:', JSON.stringify(resolvedOp))
		await bundlerProvider.send('eth_sendUserOperation', [resolvedOp, entryPointAddress])
	});
}

main().catch((err) => console.error("Error:", err));
