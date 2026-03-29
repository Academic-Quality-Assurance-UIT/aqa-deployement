import React, { FC } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

// Props for PieChart component
interface PieChartProps {
	data: any[];
	title?: string;
	description?: string;
	labels: { column_name: string; label: string }[];
}

const PieChart: FC<PieChartProps> = ({
	data,
	title,
	description,
	labels: labelList,
}) => {
	const label_column =
		labelList.find((d: any) => !d.is_value)?.column_name || "label";
	const value_column =
		labelList.find((d: any) => d.is_value)?.column_name || "value";

	// Extract labels and values
	const labels = data.map((item) => item[label_column]);
	const values = data.map((item) => parseFloat(item[value_column]).toFixed(2));

	const colorVariants = [
		// Blues
		"hsl(210, 70%, 50%)",
		"hsl(210, 70%, 60%)",
		"hsl(210, 70%, 40%)",
		// Violets
		"hsl(260, 70%, 50%)",
		"hsl(260, 70%, 60%)",
		"hsl(260, 70%, 40%)",
		// Oranges
		"hsl(30, 100%, 50%)",
		"hsl(30, 100%, 60%)",
		"hsl(30, 100%, 40%)",
	];

	// Generate background colors by cycling through the palette
	const backgroundColor = labels.map(
		(_, idx) => colorVariants[idx % colorVariants.length]
	);

	// Chart.js data and options
	const chartData = {
		labels,
		datasets: [
			{
				label:
					labelList.find((d: any) => d.column_name === value_column)
						?.label || "Values",
				data: values,
				backgroundColor,
				hoverOffset: 10,
			},
		],
	};

	const options = {
		plugins: {
			title: {
				display: true,
				text:
					labelList.find((d: any) => d.column_name === value_column)
						?.label || "Values",
				font: { size: 18 },
			},
			tooltip: {
				callbacks: {
					label: (context: any) => `${context.label}: ${context.parsed}%`,
				},
			},
			legend: {
				position: "right" as const,
			},
		},
		maintainAspectRatio: false,
	};

	return (
		<div style={{ width: "100%", height: "400px", position: "relative" }}>
			<Pie data={chartData} options={options} />
		</div>
	);
};

export default PieChart;
