import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function UICard({
	children,
	title,
	className,
	...props
}: { children: ReactNode; title?: string } & React.ComponentPropsWithoutRef<"div">) {
	return (
		<div className={twMerge("ui-card p-6", className)} {...props}>
			{title && (
				<h2 className="text-xl font-bold text-primary-dark mb-4 font-display">{title}</h2>
			)}
			{children}
		</div>
	);
}
