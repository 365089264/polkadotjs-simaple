// Import
import { ApiPromise, WsProvider } from '@polkadot/api';
import {createTestKeyring} from '@polkadot/keyring/testing';

import { randomAsU8a } from '@polkadot/util-crypto';
// Construct
const wsProvider = new WsProvider('ws://8.210.86.149:9944');
const api = await ApiPromise.create({ provider: wsProvider });

// Do something
console.log(api.genesisHash.toHex());

// Some constants we are using in this sample
const AMOUNT = 10000000000;

async function main () {

  // Create an instance of our testing keyring
  // If you're using ES6 module imports instead of require, just change this line to:
  // const keyring = testKeyring();
  const keyring = createTestKeyring();
  const ALICE="15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5"

  // Get the nonce for the admin key
  const { nonce } = await api.query.system.account(ALICE);

  // Find the actual keypair in the keyring
  const alicePair = keyring.getPair(ALICE);

  // Create a new random recipient
  //const recipient = keyring.addFromSeed(randomAsU8a(32)).address;
  const recipient="15wWqoxfoBKeC56F9SL1dJCNq88rwDGwAtKJmYim1tP3g9Rr"
  console.log('Sending', AMOUNT, 'from', alicePair.address, 'to', recipient, 'with nonce', nonce.toString());

  // Do the transfer and track the actual status
  api.tx.balances
    .transfer(recipient, AMOUNT)
    .signAndSend(alicePair, { nonce }, ({ events = [], status }) => {
      console.log('Transaction status:', status.type);

      if (status.isInBlock) {
        console.log('Included at block hash', status.asInBlock.toHex());
        console.log('Events:');

        events.forEach(({ event: { data, method, section }, phase }) => {
          console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
        });
      } else if (status.isFinalized) {
        console.log('Finalized block hash', status.asFinalized.toHex());

        process.exit(0);
      }
    });
}

main().catch(console.error);