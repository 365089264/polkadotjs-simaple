// Import
import { ApiPromise, WsProvider } from '@polkadot/api';


// Construct
const wsProvider = new WsProvider('ws://8.210.86.149:9944');
const api = await ApiPromise.create({ provider: wsProvider });

// Do something
console.log(api.genesisHash.toHex());

async function main () {


  // We only display a couple, then unsubscribe
  let count = 0;

  // Subscribe to the new headers on-chain. The callback is fired when new headers
  // are found, the call itself returns a promise with a subscription that can be
  // used to unsubscribe from the newHead subscription
  const unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
    console.log(`Chain is at block: #${header.number}`);

    if (++count === 256) {
      unsubscribe();
      process.exit(0);
    }
  });
}

main().catch(console.error);
