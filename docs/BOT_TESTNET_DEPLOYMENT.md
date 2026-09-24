# BOT Chain Testnet deployment

Deployed on 2026-09-25 using Hardhat against BOT Chain Testnet.

- Chain ID: `968`
- RPC: `https://rpc.bohr.life`
- Explorer: `https://scan.bohr.life`
- Asset: native BOT (18 decimals)
- LoanchPool: `0x584E05056349D25D567EaF11356ddD6A4bfa33CC`
- Owner/deployer: `0x922869130c31e2cb0Ed57e88E81ba0c56822c29c`
- Constructor argument: `reserveBps = 2000`
- Deployment block: `24546729`
- Deployment transaction: `0xc82c84a79ad7aefe7efc04e3b4a8c8af268852886b72f0c6ed54727aa28c359c`

Explorer links:

- Contract: https://scan.bohr.life/address/0x584E05056349D25D567EaF11356ddD6A4bfa33CC
- Deployment transaction: https://scan.bohr.life/tx/0xc82c84a79ad7aefe7efc04e3b4a8c8af268852886b72f0c6ed54727aa28c359c

## Smoke test

The reproducible `npm run smoke:testnet` flow used the deployer as Saver and Borrower:

1. Set risk score to 80.
2. Deposit `0.01 BOT`.
3. Stake `0.00025 BOT`.
4. Borrow `0.005 BOT` for one day.
5. Repay `0.0055 BOT`.
6. Claim the Saver return.
7. Withdraw `0.01 BOT` principal.

The final loan status was `Completed` (`2`), active principal and locked stake were zero, and the remaining `0.0001 BOT` contract balance is the recorded platform revenue plus loss reserve.

Transaction hashes:

- Risk: `0x6d5d28218c7720bb03e40ba8417f32fe1dfd2754e7aeeb3e26cdc5df8ceccfd5`
- Deposit: `0x8f838d4da9249940f598ec6ece51577f5105d6a35921e8ad47e3ce75f53ef6d1`
- Stake: `0x0be132866979c647a6ab1e86cd2160c917f419aa613283cbb49f91ab50469a5c`
- Loan: `0xdb1665e918425cd4b83f35306eef22bbcf87b5bde1a34f70149c0c32db7ce755`
- Repay: `0x80b14f46802b1cf8549bb9d8605b0767728bcc9e1f95b0d06d40e242990ecff9`
- Claim: `0x7d5c3268823b02aca0c2f5a5e4cfc3fc1900d8a7b101bcae9a4502b4e3ae55ef`
- Withdraw: `0x18d2cd7aca8dc4ac630e27b888cd9c3e126b21b260e3e725a24840b327a3f8f0`
