import axios from "axios";

type HookParams = {
	onStart?: () => void;
	onComplete?: (data: any) => void;
	onError?: (error: Error) => void;
	onSetteled?: () => void;
};

export function useChartGenerating({
	onStart,
	onComplete,
	onError,
	onSetteled,
}: HookParams = {}) {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL_V2?.split("/")
		.slice(0, -1)
		.join("/");

	return {
		generateChart: async (question: string) => {
			onStart?.();

			try {
				const response = await axios.post(
					"https://de742105db6d.ngrok-free.app/api/generate",
					{
						model: "aqa-sql:latest",
						prompt: question,
						stream: false,
						format: "json",
					}
				);

				const chartMetaDataString = response.data.response;
				const match = chartMetaDataString.match(/\{.*\}/);
				const chartMetaDataJson = JSON.parse(
					match?.[1] ?? chartMetaDataString
				);

				console.log({ chartMetaDataJson });

				const chartDataResponse = await axios.post(`${apiUrl}/ai-generate`, {
					query: chartMetaDataJson.query,
				});

				const chartData = {
					...chartMetaDataJson,
					chartData: chartDataResponse.data,
				};

				console.log({ chartData });

				onComplete?.(chartData);
				onSetteled?.();
				return chartData;
			} catch (error) {
				onError?.(error as Error);
				onSetteled?.();
				console.error("Error generating chart:", error);
			}
		},
	};
}
