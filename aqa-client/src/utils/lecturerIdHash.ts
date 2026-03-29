export async function hashAndShorten(longId: string) {
	const encoder = new TextEncoder();
	const data = encoder.encode(longId);

	const hashBuffer = await crypto.subtle.digest("SHA-256", data);

	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("");

	const shortId = hashHex.substring(0, 10);

	return shortId;
}
