"use client";

import { Provider, createStore } from "jotai";
import { DailyProvider, useCallObject } from "@daily-co/daily-react";
import App from "@/components/App";
import { Container, Section, Heading, Flex } from "@radix-ui/themes";

const jotaiStore = createStore();

export default function Home() {
	const callObject = useCallObject({});

	return (
		<Provider store={jotaiStore}>
			<DailyProvider callObject={callObject} jotaiStore={jotaiStore}>
				<Container size="3" p="4" id="app">
					<Flex direction="column" gap="3">
						<Section size="2">
							<Heading align="center" as="h1">
								Daily Network Test
							</Heading>
						</Section>

						<Section size="2" style={{ textAlign: "center" }}>
							<App />
						</Section>
					</Flex>
				</Container>
			</DailyProvider>
		</Provider>
	);
}
