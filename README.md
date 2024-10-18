# userop-examples

Testing ERC4337 AA User Ops in Soneium Minato Network.

## Test UserOP

1. Prepare `.env` variables
```
cp .env.template .env

# Set your variables
PRIVATE_KEY=
NETWORK_RPC_URL=
BUNDLER_URL=
```

2. Run script
```
# Execute UserOP for EntryPoint version 0.7
npm entrypoint-v0.7
```

## Account Factory
This example uses SimpleSmartAccount developed by eth-infinitism team.
https://github.com/eth-infinitism/account-abstraction

### Addresses
v0.6: `0x9406Cc6185a346906296840746125a0E44976454` (https://explorer-testnet.soneium.org/address/0x9406Cc6185a346906296840746125a0E44976454)
v0.7: `0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985` (https://explorer-testnet.soneium.org/address/0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985)

## Counter Test Contract
Source Code can be found [here](https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/test/TestCounter.sol).

Counter: `0x6bcf154A6B80fDE9bd1556d39C9bCbB19B539Bd8` (https://explorer-testnet.soneium.org/address/0x6bcf154A6B80fDE9bd1556d39C9bCbB19B539Bd8)

### Abi (count function)
```
{
  "inputs": [],
  "name": "count",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}
```
