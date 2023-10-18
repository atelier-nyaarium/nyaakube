import { getMime } from "@/assets/common";

describe("getMime", () => {
	it("should return the correct MIME type based on file extension", () => {
		expect(getMime("test.aac")).toBe("audio/aac");
		expect(getMime("test.bmp")).toBe("image/bmp");
		expect(getMime("test.gif")).toBe("image/gif");
		expect(getMime("test.html")).toBe("text/html");
		expect(getMime("test.ico")).toBe("file/x-icon");
		expect(getMime("test.jpg")).toBe("image/jpeg");
		expect(getMime("test.js")).toBe("text/javascript");
		expect(getMime("test.json")).toBe("application/json");
		expect(getMime("test.mkv")).toBe("video/x-matroska");
		expect(getMime("test.mp3")).toBe("audio/mpeg");
		expect(getMime("test.mp4")).toBe("video/mp4");
		expect(getMime("test.ogg")).toBe("audio/ogg");
		expect(getMime("test.otf")).toBe("font/otf");
		expect(getMime("test.pdf")).toBe("application/pdf");
		expect(getMime("test.png")).toBe("image/png");
		expect(getMime("test.svg")).toBe("image/svg+xml");
		expect(getMime("test.ttf")).toBe("font/ttf");
		expect(getMime("test.txt")).toBe("text/plain");
		expect(getMime("test.wav")).toBe("audio/wav");
		expect(getMime("test.webm")).toBe("audio/webm");
		expect(getMime("test.webp")).toBe("image/webp");
		expect(getMime("test.woff")).toBe("font/woff");
		expect(getMime("test.woff2")).toBe("font/woff2");
		expect(getMime("test.unknown")).toBe("application/octet-stream");
	});

	it("should throw TypeError if the parameters are bad", () => {
		expect(() => getMime(123)).toThrow(TypeError);
		expect(() => getMime({})).toThrow(TypeError);
		expect(() => getMime([])).toThrow(TypeError);
		expect(() => getMime(null)).toThrow(TypeError);
		expect(() => getMime(undefined)).toThrow(TypeError);
	});
});
