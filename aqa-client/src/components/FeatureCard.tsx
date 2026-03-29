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
		<UICard className="  rounded-3xl">
			<Card className="w-full h-fit px-5 py-3 pt-5 mb-4 lg:mb-14 bg-transparent shadow-sm">
				<CardHeader className=" flex flex-row items-center gap-5 pt-4">
					<Image
						src={icon}
						width={64}
						height={64}
						alt="feature card illustration"
					/>
					<div>
						<h1 className="text-xl font-semibold mb-3">
							{title.displayName}
						</h1>
						<p className="text-gray-500 -mt-1 text-sm">{description}</p>
					</div>
				</CardHeader>
				{navigation_links.length != 0 ? (
					<CardBody className="pt-2 pb-4">
						<ul className="list-disc pl-3">
							{navigation_links.map(({ displayName, link }) => (
								<li
									key={link}
									className="hover:underline cursor-pointer py-1"
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
						className=" hover:font-semibold hover:text-foreground-900 duration-200"
					>
						Xem chi tiết
					</Link>
				</CardFooter>
			</Card>
		</UICard>
	);
}
