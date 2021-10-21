// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import NodeCache from "node-cache";

export const DEFAULT_CACHE_OPTION = {
    useClones: false,
    stdTTL: 300,
    checkperiod: 600,
    maxKeys: 100,
};

async function mem(params: unknown[], cache: NodeCache, loader: () => Promise<unknown>) {
    const key = this.key(...params);
    if (cache.has(key)) {
        return cache.get(key);
    }
    const result = await loader();
    cache.set(key, result);
    return result;
}


export const CACHED_METHODS = {
    'chain_getBlockHash': {
        skip: (blockNumber?: number) => blockNumber === undefined,
        key: (blockNumber?: number)=> `chain_getBlockHash#${blockNumber}`,
        mem
    },
    'chain_getBlock': {
        skip: (hash?: string) => hash === undefined,
        key: (hash?: string)=> `chain_getBlock#${hash}`,
        mem
    },
    'chain_getHeader': {
        skip: (hash?: string) => hash === undefined,
        key: (hash?: string)=> `chain_getHeader#${hash}`,
        mem(params: [string], cache: NodeCache, loader: () => Promise<unknown>) {
            const [hash] = params;
            const cachedBlockKey = `chain_getBlock#${hash ?? ''}`;
            if (cache.has(cachedBlockKey)) {
                const cachedBlock = cache.get<any>(cachedBlockKey);
                return cachedBlock?.block?.header;
            }
            return mem.bind(this)(params, cache, loader);
        }
    },
}
