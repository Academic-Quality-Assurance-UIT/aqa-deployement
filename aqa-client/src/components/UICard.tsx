import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function UICard({
	children,
	title,
	className,
	...props
}: { children: ReactNode; title?: string } & React.ComponentPropsWithoutRef<"div">) {
	return (
		<div className={twMerge("bg-card rounded-2xl", className)} {...props}>
			{title && (
				<h2 className="text-lg font-semibold">{title}</h2>
			)}
			{children}
		</div>
	);
}
