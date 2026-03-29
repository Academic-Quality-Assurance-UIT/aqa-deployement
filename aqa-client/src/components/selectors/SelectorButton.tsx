"use client";

import ProgramIcon from "@/assets/ProgramIcon";
import { Button } from "@heroui/react";
import React, { ReactNode } from "react";

type PropTypes = {
	hasValue: boolean;
	isNoBorder: boolean;
	buttonText: string;
	startContent: ReactNode;
};

export const SelectorButton = React.forwardRef(function SelectorButton(
	{ hasValue, isNoBorder, buttonText, startContent, ...props }: PropTypes,
	ref: React.ForwardedRef<HTMLButtonElement>
) {
	return (
		<Button
			ref={ref}
			{...props}
			variant={hasValue ? "shadow" : "ghost"}
			color={hasValue ? "primary" : "default"}
			startContent={startContent}
			className={`${
				hasValue
					? " font-medium"
					: isNoBorder
					? " bg-white dark:bg-zinc-800 border-0 dark:hover:!bg-zinc-700 hover:!bg-zinc-100"
					: " border-0 text-secondary-foreground bg-secondary-normal hover:!bg-secondary-hover"
			} rounded-lg shadow-sm`}
		>
			{buttonText}
		</Button>
	);
});
