import _ from "lodash";

export function cloneDeepOmitProto(obj) {
	return _.cloneDeepWith(obj, (value) => {
		if (_.isPlainObject(value)) {
			if (value.__proto__ && value.__proto__ !== Object.prototype) {
				return _.omit(value, ["__proto__"]);
			}
		}
	});
}
