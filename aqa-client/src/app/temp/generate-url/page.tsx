"use client";

import { Input } from "@heroui/react";
import { useState } from "react";

export default function Page() {
	const [token, setToken] = useState("");

	async function generateBearerToken(staffName: string) {
		const timestamp = Date.now().toString();
		const data = `${staffName}-${timestamp}`;
		const enc = (s: any) => new TextEncoder().encode(s);

		const key = await crypto.subtle.importKey(
			"raw",
			enc("nvLYLiqoGMjKLzdTxyWdnAoVTlIdZaChtefOoYQMbwzVLJowWT"),
			{ name: "HMAC", hash: "SHA-256" },
			false,
			["sign"]
		);

		const sigBuffer = await crypto.subtle.sign("HMAC", key, enc(data));
		const sigBytes = new Uint8Array(sigBuffer);

		// Convert typed array to regular array before spreading to satisfy TypeScript targets
		const signature = btoa(String.fromCharCode(...Array.from(sigBytes)));

		return `${data}.${signature}`;
	}

	return (
		<div className=" w-screen h-screen grid place-items-center bg-white">
			<div className=" flex flex-col gap-4">
				<Input
					variant="bordered"
					onChange={async (value) =>
						setToken(await generateBearerToken(value.target.value))
					}
					label="Username"
				/>
				<p>{`https://aqa.uit.edu.vn?token=${token}`}</p>
			</div>
		</div>
	);
}
