# userop-examples

Testing ERC4337 AA User Ops in Soneium Minato Network.

## Account Factory
This example uses SimpleSmartAccount developed by eth-infinitism team.
https://github.com/eth-infinitism/account-abstraction

### Addresses
v0.6: `0x9406Cc6185a346906296840746125a0E44976454` (https://explorer-testnet.soneium.org/address/0x9406Cc6185a346906296840746125a0E44976454)
v0.7: `0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985` (https://explorer-testnet.soneium.org/address/0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985)

## Installation

This example repository leverages [Viem](https://viem.sh/) and [permissionless.js](https://github.com/pimlicolabs/permissionless.js) for crafting User Operations. While Viem does not natively support the `SimpleSmartAccount`, this functionality is provided via `permissionless.js`. The `SimpleSmartAccount` in `permissionless.js` is effectively a custom `SmartAccount` type that implements required interfaces `Viem` defines. As a result, both libraries are essential dependencies for this project.

```
npm i
```

## Counter Test Contract

Source Code can be found [here](https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/test/TestCounter.sol).

TestCounter: `0x6bcf154A6B80fDE9bd1556d39C9bCbB19B539Bd8` (https://explorer-testnet.soneium.org/address/0x6bcf154A6B80fDE9bd1556d39C9bCbB19B539Bd8)

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

## Test UserOP

1. Prepare `.env` variables
```
cp .env.template .env

# Set your variables
PRIVATE_KEY=
NETWORK_URL=
BUNDLER_URL=
```

2. Run script
```
# Execute UserOP for EntryPoint version 0.7
npm entrypoint-v0.7
```
