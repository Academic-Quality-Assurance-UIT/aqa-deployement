import { useProfileQuery } from "@/gql/graphql";
import { Card } from "@heroui/react";

type Props = {
	title: string;
	value?: string | null;
	onClick?: () => any;
};

export default function CommentModalItem({ title, value, onClick }: Props) {
	const { data: profile } = useProfileQuery();

	const isDisableNavigate = profile?.profile.role === "LECTURER";

	return (
		<Card
			isPressable={!!onClick && !isDisableNavigate}
			onClick={onClick}
			shadow="none"
		>
			<div
				className={` w-full flex flex-col items-start p-2 px-4 gap-1 group duration-300 ${
					!!onClick ? " hover:bg-slate-200" : ""
				}`}
			>
				<p className=" text-gray-700 text-sm text-start">{title}</p>
				<p className=" font-semibold text-start">{value}</p>
			</div>
		</Card>
	);
}
