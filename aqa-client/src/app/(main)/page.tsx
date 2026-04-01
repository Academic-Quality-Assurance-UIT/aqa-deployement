import CriteriaOverallChart, {
	CurrentLecturerOverallChart,
} from "@/components/chart/CriteriaOverallChart";
import UserProfileHome from "@/components/UserProfileHome";
import { HOME_INTRODUCTION } from "@/constants/home_introduction";
import { FilterProvider } from "@/contexts/FilterContext";
import dynamic from "next/dynamic";
import { Suspense } from "react";
const SearchBar = dynamic(() => import("@/components/SearchBar"));
const FeatureCard = dynamic(() => import("@/components/FeatureCard"));

export default async function Home() {
	return (
		<FilterProvider>
			<div className="pt-2 lg:pt-4">
				{/* Page Header */}
				<div className="page-header">
					<h1 className="page-title">Trang chủ</h1>
				</div>

				<UserProfileHome />
				<CurrentLecturerOverallChart />
				<div className="mt-4">
					<CriteriaOverallChart />
				</div>
				<div className="lg:columns-2 lg:gap-6 mt-10 ">
					{HOME_INTRODUCTION.map((introduction) => (
						<Suspense
							key={introduction.title.link}
							fallback={<p>Loading feature</p>}
						>
							<FeatureCard introduction={introduction} />
						</Suspense>
					))}
				</div>
			</div>
		</FilterProvider>
	);
}
