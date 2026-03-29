import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

type PropTypes = {
	data: any;
	loading: boolean;
};

export function AuthenticationNavigating({ data, loading }: PropTypes) {
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		const token = searchParams.get("token");
		if (loading === false && token) {
			if (token)
				router.replace(
					`/signin-integration?token=${token}&redirect=${pathName}`
				);
			else router.replace("authentication-failed");
		}
		if (!data && !token && !loading) {
			router.replace("authentication-failed");
		}
	}, [data, loading, pathName, router, searchParams]);
	return <></>;
}
