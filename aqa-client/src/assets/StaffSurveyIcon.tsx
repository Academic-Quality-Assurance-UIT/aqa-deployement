"use client";

import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";

export default function StaffSurveyIcon({
	width = 24,
	color: defaultColor,
}: {
	width?: number,
	color?: string,
}) {
	const { theme } = useTheme();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => setIsMounted(true), []);

	const color = useMemo(
		() => defaultColor || (theme == "light" ? "black" : "white"),
		[theme, defaultColor]
	);

	return (
		<div className=" w-6 h-6 grid place-items-center">
			{isMounted ? (
				<svg
					className=" w-full h-full"
					stroke={color}
					fill=""
					stroke-width="0"
					viewBox="0 0 512 512"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="32"
						color={color}
						d="M32 32v432a16 16 0 0 0 16 16h432"
					></path>
					<rect
						width="80"
						height="192"
						x="96"
						y="224"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="32"
						color={color}
						rx="20"
						ry="20"
					></rect>
					<rect
						width="80"
						height="240"
						x="240"
						y="176"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="32"
						color={color}
						rx="20"
						ry="20"
					></rect>
					<rect
						width="80"
						height="304"
						x="383.64"
						y="112"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="32"
						color={color}
						rx="20"
						ry="20"
					></rect>
				</svg>
			) : null}
		</div>
	);
}
