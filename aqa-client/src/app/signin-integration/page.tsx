import { AuthenticationIntegration } from "@/components/AuthenticationIntegration";
import { Suspense } from "react";

export default function Page() {
	return (
		<Suspense>
			<AuthenticationIntegration />
		</Suspense>
	);
}
