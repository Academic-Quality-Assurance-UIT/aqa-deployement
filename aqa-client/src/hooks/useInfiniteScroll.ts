import { PaginatedMetaData } from "@/gql/graphql";
import { useEffect, useRef, useState } from "react";
import { useDeepCompareEffect } from "react-use";

export function useInfiniteScroll<T>({
	queryFunction,
	variables,
	isLoading,
	data: _data,
	meta,
	enabled = true,
}: {
	queryFunction: (options: {
		variables: Record<string, any>;
		onCompleted?: (value: any) => any;
	}) => any;
	variables: Record<string, any>;
	isLoading: boolean;
	data?: T[];
	meta?: PaginatedMetaData;
	enabled?: boolean;
}) {
	const bottomRef = useRef<HTMLDivElement>(null);
	const [dataList, setDataList] = useState<T[]>([]);
	const isQuerying = useRef(false);

	// Reset and fetch first page when variables or enabled change
	useDeepCompareEffect(() => {
		if (!enabled) return;

		let isCancelled = false;
		isQuerying.current = true;
		setDataList([]);

		queryFunction({
			variables: { page: 0, ...variables },
		}).then((result: any) => {
			if (isCancelled) return;
			const value = result.data;
			if (value) {
				const newData = (Object.values(value)?.[0] as any).data || [];
				setDataList(newData);
			}
			isQuerying.current = false;
		}).catch(() => {
			if (!isCancelled) isQuerying.current = false;
		});

		return () => {
			isCancelled = true;
		};
	}, [variables, enabled]);

	// Fetch next page when bottom element is intersecting
	useEffect(() => {
		if (!enabled || !bottomRef.current || !meta?.hasNext || isQuerying.current || isLoading) {
			return;
		}

		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				isQuerying.current = true;
				queryFunction({
					variables: { page: (meta.page || 0) + 1, ...variables },
				}).then((result: any) => {
					const value = result.data;
					if (value) {
						const newData = (Object.values(value)?.[0] as any).data || [];
						setDataList((prev) => [...prev, ...newData]);
					}
					isQuerying.current = false;
				}).catch(() => {
					isQuerying.current = false;
				});
				observer.unobserve(entry.target);
			}
		});

		observer.observe(bottomRef.current);

		return () => {
			observer.disconnect();
		};
	}, [dataList, enabled, meta, variables, isLoading]);

	return { dataList, bottomRef };
}
