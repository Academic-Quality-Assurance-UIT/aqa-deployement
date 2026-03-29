import { FilterArgs, Role, useProfileQuery } from "@/gql/graphql";
import { useAuth } from "@/stores/auth.store";
import withQuery from "@/utils/withQuery";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function decodeFilter(filterString?: string | null) {
	return JSON.parse(atob(filterString ?? ""));
}

function encodeFilter(filter: any) {
	return btoa(JSON.stringify(filter ?? {}));
}

export function useFilterUrlQuery() {
	const router = useRouter();
	const params = useSearchParams();

	const currentPathname = usePathname();

	const { authData } = useAuth();
	const { data } = useProfileQuery();

	const [query, setQuery] = useState<FilterArgs>(
		params.has("tree")
			? decodeFilter(params.get("tree"))
			: {
					criteria_id: "",
					semester_id: "",
					faculty_id: "",
					subjects: undefined,
					lecturer_id: "",
					program: "",
					class_type: "",
					class_id: "",
			  }
	);

	const setUrlQuery = useCallback(
		(pathname: string, newQuery: Partial<FilterArgs> = {}, queryParams = {}) => {
			router.push(
				withQuery(pathname, {
					...Object.fromEntries(params.entries()),
					tree: encodeFilter({ ...query, ...newQuery }),
					...queryParams,
				})
			);
		},
		[params, query, router]
	);

	useEffect(() => {
		if (params.has("tree"))
			setQuery(decodeFilter(params.get("tree")?.toString() || ""));
	}, [params]);

	return {
		query: {
			...query,
			faculty_id:
				data?.profile.role === Role.Faculty
					? data?.profile.faculty?.faculty_id
					: query.faculty_id,
			lecturer_id:
				data?.profile.role === Role.Lecturer
					? data?.profile.lecturer?.lecturer_id
					: query.lecturer_id,
		},
		setUrlQuery,
		currentLecturerId: data?.profile.lecturer?.lecturer_id,
		role: data?.profile.role
	};
}
