import { ReactNode } from "react";
import { UICard } from "../UICard";

export default function BaseChart({
	children,
	height,
}: {
	children: ReactNode;
	height?: number;
}) {
	return (
		<UICard
			className="w-full p-0 h-full overflow-hidden"
			style={height ? { height } : {}}
		>
			<div className="relative w-full h-full overflow-hidden">
				<div className="absolute w-full h-full bg-[url(https://www.tremor.so/grid.svg)] opacity-10 bg-repeat" />
				<div className="relative w-full h-full flex flex-col">
					{children}
				</div>
			</div>
		</UICard>
	);
}
