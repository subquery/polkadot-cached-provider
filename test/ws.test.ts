import { ApiPromise } from '@polkadot/api';
import { WsProvider } from "../src";
import NodeCache from "node-cache";

describe('ws', () => {

    it('test', async () => {
        const provider = new WsProvider("wss://polkadot.api.onfinality.io/public-ws")
        const api = await ApiPromise.create({ provider });
        const cache: NodeCache = (provider as any).cache;
        const hash = await api.rpc.chain.getBlockHash();
        let states = cache.getStats();
        console.log(states.hits);
        await api.rpc.chain.getBlock(hash);
        states = cache.getStats();
        console.log(states.hits);
        await api.rpc.chain.getBlock(hash);
        states = cache.getStats();
        console.log(states.hits);
        await api.rpc.chain.getHeader(hash);
        states = cache.getStats();
        console.log(states.hits);
    }, 50000)
})
