"use client";

import { IFeatureIntroduction } from "@/constants/home_introduction";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import Link from "next/link";
import { UICard } from "./UICard";
import Image from "next/image";

export default function FeatureCard({
	introduction: { icon, title, description, navigation_links },
}: {
	introduction: IFeatureIntroduction;
}) {
	return (
		<UICard className="mb-4 lg:mb-6 overflow-hidden break-inside-avoid">
			<Card className="w-full h-fit px-5 py-3 pt-5 bg-transparent shadow-none">
				<CardHeader className="flex flex-row items-center gap-5 pt-4">
					<Image
						src={icon}
						width={56}
						height={56}
						alt="feature card illustration"
					/>
					<div>
						<h2 className="text-lg font-semibold mb-2 text-gray-900">
							{title.displayName}
						</h2>
						<p className="text-gray-500 -mt-1 text-sm">{description}</p>
					</div>
				</CardHeader>
				{navigation_links.length != 0 ? (
					<CardBody className="pt-2 pb-4">
						<ul className="list-disc pl-3">
							{navigation_links.map(({ displayName, link }) => (
								<li
									key={link}
									className="hover:underline cursor-pointer py-1 text-gray-700"
								>
									<Link href={link}>{displayName}</Link>
								</li>
							))}
						</ul>
					</CardBody>
				) : null}
				<CardFooter>
					<Link
						href={title.link}
						className="text-sm font-medium text-navbar-selected hover:underline duration-200"
					>
						Xem chi tiết →
					</Link>
				</CardFooter>
			</Card>
		</UICard>
	);
}
