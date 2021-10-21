// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {WsProvider as BaseProvider} from '@polkadot/rpc-provider';
import NodeCache from "node-cache";
import { merge } from "lodash";
import { CACHED_METHODS, DEFAULT_CACHE_OPTION } from "./cache";

export class WsProvider extends BaseProvider {
    private readonly cache;
    constructor(endpoint?: string | string[], autoConnectMs?: number | false, headers?: Record<string, string>, cacheOption?: NodeCache.Options) {
        super(endpoint, autoConnectMs, headers);
        this.cache = new NodeCache(merge({}, DEFAULT_CACHE_OPTION, cacheOption));
    }
    public send <T = any> (method: string, params: unknown[], subscription?: any): Promise<T> {
        if (subscription || !CACHED_METHODS[method] || CACHED_METHODS[method].skip(...params)) {
            return super.send(method, params, subscription);
        }

        return CACHED_METHODS[method].mem(params, this.cache, () => super.send(method, params, subscription));
    }
}
