export default function decodeQueryString(str) {
	const query = {};

	if (!str) return {};

	if (str.charAt(0) === "?") str = str.substring(1);

	if (!str.length) return {};

	str.split("&").forEach((str) => {
		const pair = str.split("=");
		query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	});

	return query;
}
