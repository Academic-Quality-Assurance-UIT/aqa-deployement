import CommentPage from "@/components/comments/CommentPage";
import { Metadata } from "next";

type Props = { searchParams: { [key: string]: string | undefined } };

export default function Page({ searchParams: { type } }: Props) {
	return (
		<>
			<div className="page-header mb-6">
				<h1 className="page-title">
					{generateTitle(type).title}
				</h1>
			</div>
			<CommentPage
				selectors={["faculty", "program", "semester", "single-subject"]}
			/>
		</>
	);
}

export function generateMetadata({ searchParams: { type } }: Props): Metadata {
	return generateTitle(type);
}

function generateTitle(type?: string) {
	if (type == "negative")
		return {
			title: "Ý kiến tiêu cực",
		};
	else if (type == "positive")
		return {
			title: "Ý kiến tích cực",
		};
	return {
		title: "Tất cả ý kiến",
	};
}
