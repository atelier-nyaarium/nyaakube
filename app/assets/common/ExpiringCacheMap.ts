class Node<K, V> {
	key: K;
	value: V;
	prev: Node<K, V> | null;
	next: Node<K, V> | null;
	timestamp: number;

	constructor(key: K, value: V) {
		this.key = key;
		this.value = value;
		this.prev = null;
		this.next = null;
		this.timestamp = Date.now();
	}
}

/**
 * Expiring Cache Map
 *
 * A Map with a configured TTL, which removes entries if they have not been used in a while.
 *
 * @example
 * const cacheMap = new ExpiringCacheMap<string, string>();
 * cacheMap.set("pika", "who");
 * cacheMap.set("foo", "bar");
 * cacheMap.set("pika", "boo");
 * console.log(cacheMap.map((v, k) => `${k}:${v}`));
 * -> ["pika:boo", "foo:bar"]
 */
export class ExpiringCacheMap<K, V> {
	private _keepAliveOnGet: boolean;
	private _ttl: number;
	private _map: Map<K, Node<K, V>>;
	private _head: Node<K, V> | null;
	private _tail: Node<K, V> | null;
	private _cleanupInterval: NodeJS.Timeout | null;
	private _cleanupIntervalTime: number;

	constructor({
		clearIntervalTime = 60 * 1000, // in ms (default 1 minute)
		keepAliveOnGet = true,
		ttl = 10 * 60 * 1000, // in ms (default 10 minutes)
	}: {
		clearIntervalTime?: number;
		keepAliveOnGet?: boolean;
		ttl?: number;
	} = {}) {
		this._cleanupIntervalTime = clearIntervalTime;
		this._keepAliveOnGet = keepAliveOnGet;
		this._ttl = ttl;
		this._map = new Map<K, Node<K, V>>();
		this._head = null;
		this._tail = null;
		if (ttl) {
			this._cleanupInterval = setInterval(
				this._cleanup.bind(this),
				this._cleanupIntervalTime,
			);
		} else {
			this._cleanupInterval = null;
		}
	}

	destroy(): void {
		if (this._cleanupInterval) {
			clearInterval(this._cleanupInterval);
			this._cleanupInterval = null;
		}

		this._map.clear();
		this._map = new Map<K, Node<K, V>>();

		this._head = null;
		this._tail = null;
	}

	get(key: K): V | undefined {
		const node = this._map.get(key);
		if (!node) return undefined;

		if (this._keepAliveOnGet) {
			node.timestamp = Date.now();
			this._moveToHead(node);
		}

		return node.value;
	}

	set(key: K, value: V): void {
		let node = this._map.get(key);
		if (node) {
			node.value = value;
			node.timestamp = Date.now();
			this._moveToHead(node);
		} else {
			node = new Node<K, V>(key, value);
			this._map.set(key, node);
			this._addNode(node);
		}
	}

	delete(key: K): void {
		const node = this._map.get(key);
		if (!node) return;

		this._removeNode(node);
		this._map.delete(key);
	}

	forEach(
		callback: (value: V, key: K, map: ExpiringCacheMap<K, V>) => void,
	): void {
		let node = this._head;
		while (node) {
			callback(node.value, node.key, this);
			node = node.next;
		}
	}

	map<U>(
		callback: (value: V, key: K, map: ExpiringCacheMap<K, V>) => U,
	): U[] {
		const result: U[] = [];
		let node = this._head;
		while (node) {
			result.push(callback(node.value, node.key, this));
			node = node.next;
		}
		return result;
	}

	private _addNode(node: Node<K, V>): void {
		if (!this._head) {
			this._head = this._tail = node;
		} else {
			node.next = this._head;
			this._head.prev = node;
			this._head = node;
		}
	}

	private _removeNode(node: Node<K, V>): void {
		if (node.prev) {
			node.prev.next = node.next;
		} else {
			this._head = node.next;
		}

		if (node.next) {
			node.next.prev = node.prev;
		} else {
			this._tail = node.prev;
		}
	}

	private _moveToHead(node: Node<K, V>): void {
		if (this._head === node) return;
		this._removeNode(node);
		this._addNode(node);
	}

	private _cleanup(): void {
		const now = Date.now();
		let node = this._tail;
		while (node && this._ttl < now - node.timestamp) {
			const prev = node.prev;
			this.delete(node.key);
			node = prev;
		}
	}
}
