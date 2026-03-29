import CommentPage from "@/components/comments/CommentPage";
import { Metadata } from "next";

type Props = { searchParams: { [key: string]: string | undefined } };

export default function Page({ searchParams: { type } }: Props) {
	return (
		<>
			<h1 className="mb-14 font-extrabold text-2xl">
				{generateTitle(type).title}
			</h1>
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
