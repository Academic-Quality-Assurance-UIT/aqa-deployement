"use client";

import BreadCrumb from "@/components/BreadCrumb";
import PageTabs from "@/components/PageTabs";
import PointEachSemester from "@/components/PointEachSemester";
import ProgramSelector from "@/components/selectors/ProgramSelector";
import { FilterProvider } from "@/contexts/FilterContext";
import { useDetailCriteriaQuery } from "@/gql/graphql";
import { Button } from "@heroui/react";
import { RiArrowLeftSLine } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function Layout({
	params: { criteria_id },
	children,
}: {
	params: {
		criteria_id: string;
	};
	children: ReactNode;
}) {
	const { data } = useDetailCriteriaQuery({ variables: { id: criteria_id } });
	const router = useRouter();

	return (
		<FilterProvider>
			<div className="mb-6">
				<BreadCrumb />
			</div>
			<div className="flex items-center gap-1 -ml-2 mb-1">
				<Button
					isIconOnly
					variant="light"
					size="sm"
					onPress={() => router.back()}
					className="text-slate-500"
				>
					<RiArrowLeftSLine size={20} />
				</Button>
				<p className="font-medium text-slate-500">{`Tiêu chí`}</p>
			</div>
			<h1 className="page-title mt-1 mb-4">
				{data?.criteria?.display_name || ""}
			</h1>
			<FilterProvider>
				<div className=" mt-10">
					<PointEachSemester
						title="Điểm đánh giá trung bình qua từng học kỳ"
						legend="Điểm đánh giá"
						query={{ criteria_id }}
						selectors={
							<>
								<ProgramSelector />
							</>
						}
					/>
				</div>
			</FilterProvider>
			<div className="mt-2 w-full p-0 h-[420px]">{children}</div>
		</FilterProvider>
	);
}
