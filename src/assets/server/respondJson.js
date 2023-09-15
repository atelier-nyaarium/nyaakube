export default function respondJson(res, data, status = 200) {
	data = JSON.stringify(data);
	return res
		.setHeader("content-length", Buffer.byteLength(data))
		.status(status)
		.send(data);
}
