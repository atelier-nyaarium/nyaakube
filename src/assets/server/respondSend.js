export default function respondSend(res, data, status = 200) {
	data = String(data);
	return res
		.setHeader("content-length", Buffer.byteLength(data))
		.status(status)
		.send(data);
}
