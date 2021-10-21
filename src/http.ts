// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {HttpProvider as BaseProvider} from '@polkadot/rpc-provider';
import {merge} from 'lodash';
import NodeCache from "node-cache";
import { CACHED_METHODS, DEFAULT_CACHE_OPTION } from "./cache";

export class HttpProvider extends BaseProvider {
    private readonly cache;
    constructor(endpoint?: string, headers?: Record<string, string>, cacheOption?: NodeCache.Options) {
        super(endpoint, headers);
        this.cache = new NodeCache(merge({}, DEFAULT_CACHE_OPTION, cacheOption));
    }
    public send <T = any> (method: string, params: unknown[]): Promise<T> {
        if (!CACHED_METHODS[method]) {
            return super.send(method, params);
        }
        return CACHED_METHODS[method].mem(params, this.cache, () => super.send(method, params));
    }
}
