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
						<h2 className="text-xl font-bold mb-2 text-primary-dark font-display leading-tight">
							{title.displayName}
						</h2>
						<p className="text-slate-500 font-medium text-sm leading-relaxed">{description}</p>
					</div>
				</CardHeader>
				{navigation_links.length != 0 ? (
					<CardBody className="pt-2 pb-4">
						<ul className="space-y-2">
							{navigation_links.map(({ displayName, link }) => (
								<li
									key={link}
									className="group"
								>
									<Link href={link} className="flex items-center text-sm text-slate-600 hover:text-primary font-medium transition-colors">
										<span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-primary mr-2 transition-colors"></span>
										{displayName}
									</Link>
								</li>
							))}
						</ul>
					</CardBody>
				) : null}
				<CardFooter>
					<Link
						href={title.link}
						className="text-sm font-bold text-primary hover:text-primary-dark duration-200 flex items-center gap-1 group"
					>
						Xem chi tiết <span className="group-hover:translate-x-1 transition-transform">→</span>
					</Link>
				</CardFooter>
			</Card>
		</UICard>
	);
}
