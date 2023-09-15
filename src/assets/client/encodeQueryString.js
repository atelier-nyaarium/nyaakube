export default function encodeQueryString(a, b) {
	let url = "";
	let obj = "";

	if (typeof b === "undefined") {
		if (typeof a === "string") return a;

		obj = a;
	} else {
		url = a + "?";
		obj = b;
	}

	url += Object.entries(obj)
		.filter((entry) => {
			if (typeof entry[1] === "undefined") return false;
			if (entry[1] === null) return false;
			return true;
		})
		.map((pair) => {
			return `${encodeURIComponent(pair[0])}=${encodeURIComponent(
				pair[1],
			)}`;
		})
		.join("&");

	return url;
}
