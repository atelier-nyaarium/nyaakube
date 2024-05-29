class Node {
	constructor(key, value) {
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
 * const cacheMap = new ExpiringCacheMap();
 * cacheMap.set("pika", "who");
 * cacheMap.set("foo", "bar");
 * cacheMap.set("pika", "boo");
 * console.log(cacheMap.map((v, k) => `${k}:${v}`));
 * -> ["pika:boo", "foo:bar"]
 */
export class ExpiringCacheMap {
	constructor({
		ttl = 10 * 60 * 1000, // in ms (default 10 minutes)
	} = {}) {
		this._ttl = ttl;
		this._map = new Map();
		this._head = null;
		this._tail = null;
		this._cleanupInterval = setInterval(
			this._cleanup.bind(this),
			60 * 1000, // every minute
		);
	}

	destroy() {
		clearInterval(this._cleanupInterval);
		this._cleanupInterval = null;

		this._map.clear();
		this._map = null;

		this._head = null;
		this._tail = null;
	}

	get(key) {
		const node = this._map.get(key);
		if (!node) return undefined;

		node.timestamp = Date.now();
		this._moveToHead(node);

		return node.value;
	}

	set(key, value) {
		let node = this._map.get(key);
		if (node) {
			node.value = value;

			node.timestamp = Date.now();
			this._moveToHead(node);
		} else {
			node = new Node(key, value);

			this._map.set(key, node);
			this._addNode(node);
		}
	}

	delete(key) {
		const node = this._map.get(key);
		if (!node) return;

		this._removeNode(node);
		this._map.delete(key);
	}

	forEach(callback) {
		let node = this._head;
		while (node) {
			callback(node.value, node.key, this);
			node = node.next;
		}
	}

	map(callback) {
		const result = [];
		let node = this._head;
		while (node) {
			result.push(callback(node.value, node.key, this));
			node = node.next;
		}
		return result;
	}

	_addNode(node) {
		if (!this._head) {
			this._head = this._tail = node;
		} else {
			node.next = this._head;
			this._head.prev = node;
			this._head = node;
		}
	}

	_removeNode(node) {
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

	_moveToHead(node) {
		if (this._head === node) return;
		this._removeNode(node);
		this._addNode(node);
	}

	_cleanup() {
		const now = Date.now();
		let node = this._tail;
		while (node && this._ttl < now - node.timestamp) {
			const prev = node.prev;
			this.delete(node.key);
			node = prev;
		}
	}
}
