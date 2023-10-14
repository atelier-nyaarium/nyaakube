import _ from "lodash";

/**
 * Deep clone an object while omitting __proto__
 *
 * @param {object} obj - The object to clone.
 *
 * @returns {object} - Clone of the object
 *
 * @example
 * const user = {
 *     name: "Foo",
 *     address: "123 Sesame St.",
 *     __proto__: { isAdmin: true },
 * };
 * const clone = cloneDeepOmitProto(user);
 * -> {
 *     "name": "Foo",
 *     "address": "123 Sesame St."
 * }
 */
export function cloneDeepOmitProto(obj) {
	return _.cloneDeepWith(obj, (value) => {
		if (_.isPlainObject(value)) {
			if (value.__proto__ && value.__proto__ !== Object.prototype) {
				return _.omit(value, ["__proto__"]);
			}
		}
	});
}
