"use client";

import { useCustomApolloClient } from "@/hooks/useCustomApolloClient";
import { ApolloProvider } from "@apollo/client";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
	const client = useCustomApolloClient();

	return (
		<HeroUIProvider>
			{/* <NextThemesProvider attribute="class" defaultTheme="light">
			</NextThemesProvider> */}
			<QueryClientProvider client={queryClient}>
				<ApolloProvider client={client}>{children}</ApolloProvider>
			</QueryClientProvider>
		</HeroUIProvider>
	);
}
