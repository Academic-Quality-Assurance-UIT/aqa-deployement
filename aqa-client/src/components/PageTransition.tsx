"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

// This component captures its children on mount and never updates them.
// This ensures that during a framer-motion exit animation, the "old" page
// content remains visible instead of being replaced by the new page content.
function StaticComponent({ children }: { children: ReactNode }) {
	const [frozenChildren] = useState(children);
	return <>{frozenChildren}</>;
}

export default function PageTransition({ children }: { children: ReactNode }) {
	const pathname = usePathname();

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={pathname}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{
					duration: 0.5,
					ease: "easeInOut",
				}}
				className="w-full"
				style={{ willChange: "opacity" }}
			>
				<StaticComponent>{children}</StaticComponent>
			</motion.div>
		</AnimatePresence>
	);
}
