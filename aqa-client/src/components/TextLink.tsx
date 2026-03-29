"use client";

import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";
import { ReactNode } from "react";

export default function TextLink({
	href,
	children,
	filter = {},
}: {
	href: string;
	children: ReactNode;
	filter?: Record<string, string | number | undefined>;
}) {
	const { setUrlQuery } = useFilterUrlQuery();
	return (
		<div onClick={() => setUrlQuery(href, filter)} className=" inline-block">
			<span className=" underline font-semibold cursor-pointer hover:text-sky-600 hover:dark:text-sky-500">
				{children}
			</span>
		</div>
	);
}
