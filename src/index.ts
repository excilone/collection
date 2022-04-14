export class Collection<K = string, V = unknown> extends Map<K, V> {
    /**
     * Returns an array of the values/keys in the Collection.
     * @param keys If `false` returns an array of the values in this collection, if `true` returns an array of the keys in this collection.
     */
    public array<U extends boolean>(keys: U): (U extends true ? K : V)[];
    /** An array of the values in the Collection */
    public array(): V[];
    public array(keys = false): K[] | V[] {
        if (keys) return Array.from(this.keys());
        return Array.from(this.values());
    }

    /** Returns the value at the given index */
    public at(index: number): V | undefined {
        index = Math.floor(index);
        return this.array().at(index);
    }
    /** Returns the key at the given index */
    public keyAt(index: number): K | undefined {
        index = Math.floor(index);
        return this.array(true).at(index);
    }

    /** Combines the given collections */
    public concat(...values: ReadonlyCollection<K, V>[]): Collection<K, V>;
    public concat<K2, V2>(
        ...values: ReadonlyCollection<K2, V2>[]
    ): Collection<K2 | K, V2 | V>;
    public concat(
        ...values: ReadonlyCollection<unknown, unknown>[]
    ): Collection<unknown, unknown> {
        const coll = this.clone() as Collection<unknown, unknown>;
        for (const collection of values) {
            for (const [key, value] of collection.entries()) coll.set(key, value);
        }
        return coll;
    }

    /** Determines if all values in the collection matches with the callback. */
    public every<K2 extends K>(
        callback: (value: V, key: K, collection: this) => key is K2,
        thisArg?: unknown
    ): this is Collection<K2, V>;
    /** Determines if all values in the collection matches with the callback. */
    public every<V2 extends V>(
        callback: (value: V, key: K, collection: this) => value is V2,
        thisArg?: unknown
    ): this is Collection<K, V2>;
    /** Determines if all values in the collection matches with the callback. */
    public every(
        callback: (value: V, key: K, collection: this) => boolean,
        thisArg?: unknown
    ): boolean;
    public every(
        callback: (value: V, key: K, collection: this) => boolean,
        thisArg?: unknown
    ): boolean {
        if (thisArg !== undefined) callback = callback.bind(thisArg);
        for (const [key, value] of this.entries())
            if (!callback(value, key, this)) return false;

        return true;
    }

    /** Determines if any of the values in the collection match with the callback. */
    public some(
        callback: (value: V, key: K, collection: this) => boolean,
        thisArg?: unknown
    ) {
        if (thisArg !== undefined) callback = callback.bind(thisArg);
        for (const [key, value] of this.entries()) {
            if (callback(value, key, this)) return true;
        }

        return false;
    }

    /** Returns a new collection of the values that match with the callback. */
    public filter<K2 extends K>(
        callback: (value: V, key: K, collection: this) => key is K2,
        thisArg?: unknown
    ): Collection<K2, V>;
    /** Returns a new collection of the values that match with the callback. */
    public filter<V2 extends V>(
        callback: (value: V, key: K, collection: this) => value is V2,
        thisArg?: unknown
    ): Collection<K, V2>;
    /** Returns a new collection of the values that match with the callback. */
    public filter(
        callback: (value: V, key: K, collection: this) => boolean,
        thisArg?: unknown
    ): Collection<K, V>;
    public filter(
        callback: (value: V, key: K, collection: this) => boolean,
        thisArg?: unknown
    ) {
        if (thisArg !== undefined) callback = callback.bind(thisArg);
        const newCollection = new this.constructor<K, V>();
        for (const [key, value] of this.entries()) {
            if (callback(value, key, this)) newCollection.set(key, value);
        }
        return newCollection;
    }

    /** Returns the first value that match with the callback */
    public find<V2 extends V>(
        callback: (value: V, key: K, collection: this) => value is V2,
        thisArg?: unknown
    ): V2 | undefined;
    /** Returns the first value that match with the callback */
    public find(
        callback: (value: V, key: K, collection: this) => boolean,
        thisArg?: unknown
    ): V | undefined;
    public find(
        callback: (value: V, key: K, collection: this) => boolean,
        thisArg?: unknown
    ) {
        if (thisArg !== undefined) callback = callback.bind(thisArg);
        for (const [key, value] of this.entries()) {
            if (callback(value, key, this)) return value;
        }
        return undefined;
    }

    /** Returns the first key that match with the callback */
    public findKey<K2 extends K>(
        callback: (value: V, key: K, collection: this) => key is K2,
        thisArg?: unknown
    ): K2 | undefined;
    /** Returns the first key that match with the callback */
    public findKey(
        callback: (value: V, key: K, collection: this) => boolean,
        thisArg?: unknown
    ): K | undefined;
    public findKey(
        callback: (value: V, key: K, collection: this) => boolean,
        thisArg?: unknown
    ) {
        if (thisArg !== undefined) callback = callback.bind(thisArg);
        for (const [key, value] of this.entries()) {
            if (callback(value, key, this)) return key;
        }
        return undefined;
    }

    /** Returns an array with the value returned by the callback */
    public map<M>(
        callback: (value: V, key: K, collection: this) => M,
        thisArg?: unknown
    ): M[] {
        if (thisArg !== undefined) callback = callback.bind(thisArg);
        const entries = this.entries();
        return Array.from({ length: this.size }, (): M => {
            const [key, value] = entries.next().value;
            return callback(value, key, this);
        });
    }

    /** Returns the first value of this Collection */
    public first(): V | undefined;
    /** Returns the first values of this Collection */
    public first(amount: number): V[];
    public first(amount?: number) {
        if (amount === undefined) return this.values().next().value;
        if (amount < 0) return this.last(Math.abs(amount));
        const values = this.values();
        return Array.from(
            { length: Math.min(this.size, amount) },
            () => values.next().value
        );
    }

    /** Returns the first key of this Collection */
    public firstKey(): K | undefined;
    /** Returns the first keys of this Collection */
    public firstKey(amount: number): K[];
    public firstKey(amount?: number) {
        if (amount === undefined) return this.keys().next().value;
        if (amount < 0) return this.lastKey(Math.abs(amount));
        const keys = this.keys();
        return Array.from(
            { length: Math.min(amount, this.size) },
            () => keys.next().value
        );
    }

    /** Returns the last value of this Collection */
    public last(): V | undefined;
    /** Returns the last values of this Collection */
    public last(amount: number): V[];
    public last(amount?: number): V | V[] | undefined {
        const arr = this.array();
        if (amount === undefined) return arr[arr.length - 1];
        if (amount < 0) return this.first(Math.abs(amount));
        if (amount === 0) return [];
        return arr.slice(-amount);
    }

    /** Returns the last key of this Collection */
    public lastKey(): K | undefined;
    /** Returns the last keys of this Collection */
    public lastKey(amount: number): K[];
    public lastKey(amount?: number): K | K[] | undefined {
        const arr = this.array(true);
        if (amount === undefined) return arr[arr.length - 1];
        if (amount < 0) return this.firstKey(Math.abs(amount));
        if (amount === 0) return [];
        return arr.slice(-amount);
    }

    /** Reduce this Collection to a single value */
    public reduce<T>(
        callback: (accumulator: T, value: V, key: K, collection: this) => T,
        initialValue?: T
    ): T {
        let accumulator: T = initialValue!;

        for (const [key, value] of this.entries()) {
            accumulator = callback(accumulator, value, key, this);
        }

        return accumulator;
    }

    /** Returns a random value of this Collection */
    public random(): V | undefined;
    /** Returns a random values of this Collection */
    public random(amount: number): V[];
    public random(amount?: number): V[] | V | undefined {
        const arr = this.array();
        if (amount === undefined) return arr[Math.floor(Math.random() * arr.length)];
        if (arr.length === 0 || amount === 0) return [];
        return Array.from(
            { length: Math.min(amount, arr.length) },
            () => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]
        );
    }

    /** Returns a random key of this Collection */
    public randomKey(): K | undefined;
    /** Returns a random keys of this Collection */
    public randomKey(amount: number): K[];
    public randomKey(amount?: number): K[] | K | undefined {
        const arr = this.array(true);
        if (amount === undefined) return arr[Math.floor(Math.random() * arr.length)];
        if (arr.length === 0 || amount === 0) return [];
        return Array.from(
            { length: Math.min(amount, arr.length) },
            () => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]
        );
    }

    /** Clone this Collection */
    public clone(): Collection<K, V> {
        return new this.constructor(this.entries());
    }

    public toJSON() {
        return this.array();
    }
}

export class List<T = unknown> extends Set<T> {
    /** An array of the values in the List */
    public array(): T[] {
        return Array.from(this.values());
    }

    /** Returns the value at the given index */
    public at(index: number): T | undefined {
        index = Math.floor(index);

        return this.array().at(index);
    }

    /** Combines the given lists */
    public concat(...values: ReadonlyList<T>[]): List<T>;
    public concat<T2>(...values: ReadonlyList<T2>[]): List<T | T2>;
    public concat(...values: ReadonlyList<unknown>[]) {
        const list = this.clone() as List<unknown>;
        for (const l of values) for (const val of l.values()) list.add(val);

        return list;
    }

    /** Determines if all values in the list match with the callback. */
    public every<T2 extends T>(
        callback: (value1: T, value2: T, list: this) => value1 is T2,
        thisArg?: unknown
    ): this is List<T2>;
    /** Determines if all values in the list match with the callback. */
    public every<T2 extends T>(
        callback: (value1: T, value2: T, list: this) => value2 is T2,
        thisArg?: unknown
    ): this is List<T2>;
    /** Determines if all values in the list match with the callback. */
    public every(
        callback: (value1: T, value2: T, list: this) => boolean,
        thisArg?: unknown
    ): boolean;
    public every(
        callback: (value1: T, value2: T, list: this) => boolean,
        thisArg?: unknown
    ) {
        if (thisArg !== undefined) callback = callback.bind(thisArg);
        for (const [val1, val2] of this.entries()) {
            if (!callback(val1, val2, this)) return false;
        }
        return true;
    }

    /** Determines if any of the values in the List match the callback. */
    public some(
        callback: (value1: T, value2: T, list: this) => boolean,
        thisArg?: unknown
    ) {
        if (thisArg !== undefined) callback = callback.bind(thisArg);
        for (const [val1, val2] of this.entries()) {
            if (callback(val1, val2, this)) return true;
        }
        return false;
    }

    /** Returns a new List of values that match with the callback. */
    public filter<T2 extends T>(
        callback: (value1: T, value2: T, list: this) => value1 is T2,
        thisArg?: unknown
    ): List<T2>;
    /** Returns a new List of values that match with the callback. */
    public filter<T2 extends T>(
        callback: (value1: T, value2: T, list: this) => value2 is T2,
        thisArg?: unknown
    ): List<T2>;
    /** Returns a new List of values that match with the callback. */
    public filter(
        callback: (value1: T, value2: T, list: this) => boolean,
        thisArg?: unknown
    ): List<T>;
    public filter(
        callback: (value1: T, value2: T, list: this) => boolean,
        thisArg?: unknown
    ) {
        if (thisArg !== undefined) callback = callback.bind(thisArg);
        const newList = new this.constructor<T>();
        for (const [val1, val2] of this.entries()) {
            if (callback(val1, val2, this)) newList.add(val1);
        }
        return newList;
    }

    /** Returns the first value that match with the callback. */
    public find<T2 extends T>(
        callback: (value1: T, value2: T, list: this) => value1 is T2,
        thisArg?: unknown
    ): T2 | undefined;
    /** Returns the first value that match with the callback. */
    public find<T2 extends T>(
        callback: (value1: T, value2: T, list: this) => value2 is T2,
        thisArg?: unknown
    ): T2 | undefined;
    /** Returns the first value that match with the callback. */
    public find(
        callback: (value1: T, value2: T, list: this) => boolean,
        thisArg?: unknown
    ): T | undefined;
    public find(
        callback: (value1: T, value2: T, list: this) => boolean,
        thisArg?: unknown
    ) {
        if (thisArg !== undefined) callback = callback.bind(thisArg);
        for (const [val1, val2] of this.entries()) {
            if (callback(val1, val2, this)) return val1;
        }

        return undefined;
    }

    /** Returns a List with the value returned by the callback */
    public map<M>(
        callback: (value1: T, value2: T, list: this) => M,
        thisArg?: unknown
    ): List<M> {
        if (thisArg !== undefined) callback = callback.bind(thisArg);
        const newList = new this.constructor<M>();
        for (const [val1, val2] of this.entries())
            newList.add(callback(val1, val2, this));
        return newList;
    }

    /** Returns the first value of this List */
    public first(): T | undefined;
    /** Returns the first values of this List */
    public first(amount: number): T[];
    public first(amount?: number): T[] | T | undefined {
        if (amount === undefined) return this.values().next().value;
        if (amount < 0) return this.last(Math.abs(amount));
        const values = this.values();
        return Array.from(
            { length: Math.min(this.size, amount) },
            () => values.next().value
        );
    }

    /** Returns the last value of this List */
    public last(): T | undefined;
    /** Returns the last values of this List */
    public last(amount: number): T[];
    public last(amount?: number): T[] | T | undefined {
        const arr = this.array();
        if (amount === undefined) return arr[arr.length - 1];
        if (amount < 0) return this.first(Math.abs(amount));
        if (amount === 0) return [];
        return arr.slice(-amount);
    }

    /** Reduce the List to a single value */
    public reduce<I>(
        callback: (accumulator: I, value1: T, value2: T, list: this) => I,
        initialValue?: I
    ): I {
        let accumulator: I = initialValue!;

        for (const [val1, val2] of this.entries()) {
            accumulator = callback(accumulator, val1, val2, this);
        }

        return accumulator;
    }

    /** Returns a random value of this List */
    public random(): T | undefined;
    /** Returns a random values of this List */
    public random(amount: number): T[];
    public random(amount?: number): T[] | T | undefined {
        const arr = this.array();
        if (amount === undefined) return arr[Math.floor(Math.random() * arr.length)];
        if (amount === 0 || arr.length === 0) return [];
        return Array.from(
            { length: Math.min(amount, arr.length) },
            () => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]
        );
    }

    /** Clone this list */
    public clone() {
        return new this.constructor(this.array());
    }
}

export interface Collection<K, V> {
    constructor: CollectionConstructor;
    forEach(
        callback: (value: V, key: K, collection: Collection<K, V>) => void,
        thisArg?: unknown
    ): void;
}

export interface List<T> {
    constructor: ListConstructor;
    forEach(
        callback: (value: T, value2: T, list: List<T>) => void,
        thisArg?: unknown
    ): void;
}

export type ReadonlyCollection<K, V> = ReadonlyMap<K, V> &
    Omit<Collection<K, V>, 'get' | 'set' | 'delete'>;

export type ReadonlyList<T> = ReadonlySet<T> & Omit<List<T>, 'delete' | 'add'>;

export interface CollectionConstructor {
    new (): Collection;
    new <K, V>(entries?: readonly (readonly [K, V])[] | null): Collection<K, V>;
    new <K, V>(iterable?: Iterable<readonly [K, V]> | null): Collection<K, V>;
    readonly prototype: Collection;
}

export interface ListConstructor {
    new <T = unknown>(values?: readonly T[] | null): List<T>;
    readonly prototype: List<unknown>;
}
