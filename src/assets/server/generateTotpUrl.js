import speakeasy from "@levminer/speakeasy";

const issuer = `Atelier Nyaarium`;

export default function generateTotpUrl(label, digits, period, step, secret) {
	return speakeasy.otpauthURL({
		encoding: "base32",
		// algorithm: "SHA1",
		issuer,
		label,
		digits,
		period,
		step,
		secret,
	});
}
