"use client";

import { useState } from "react";
import { useDaily } from "@daily-co/daily-react";
import {
  DailyCallQualityTestResults,
  DailyNetworkConnectivityTestStats,
  DailyWebsocketConnectivityTestResults,
} from "@daily-co/daily-js";
import { Button, Card, Box, Flex, Heading, Section } from "@radix-ui/themes";
import CallQuality from "./CallQuality";
import Network from "./Network";
import Websockets from "./Websockets";

export default function App() {
  // const [appState, setAppState] = useAtom(appStateAtom);
  const [appState, setAppState] = useState<
    | "idle"
    | "starting"
    | "running-network"
    | "running-websocket"
    | "running-call"
    | "completed"
  >("idle");
  const [callQualityResults, setCallQualityResults] =
    useState<DailyCallQualityTestResults | null>(null);
  const [networkTestResults, setNetworkTestResults] =
    useState<DailyNetworkConnectivityTestStats | null>(null);
  const [websocketTestResults, setWebsocketTestResults] =
    useState<DailyWebsocketConnectivityTestResults | null>(null);

  const call = useDaily();

  function copyResults() {
    navigator.clipboard.writeText(
      JSON.stringify({
        network: networkTestResults,
        websockets: websocketTestResults,
        call: callQualityResults,
      })
    );
  }
  async function start() {
    console.log("starting test");
    setAppState("starting");
    await call?.startCamera();
    setAppState("running-network");
    const videoTrack = call?.participants().local.tracks.video.persistentTrack;
    if (videoTrack) {
      const nt = await call?.testNetworkConnectivity(videoTrack);
      console.log({ nt });
      if (nt) {
        setNetworkTestResults(nt);
      }
    }

    setAppState("running-websocket");
    const ws = await call?.testWebsocketConnectivity();
    console.log({ ws });
    if (ws) {
      setWebsocketTestResults(ws);
    }
    setAppState("running-call");
    //await call?.preAuth({ url: "https://chad-hq.daily.co/howdy" });
    const cq = await call?.testCallQuality();
    console.log({ cq });
    if (cq) {
      setCallQualityResults(cq);
    }
    await call?.destroy();
    setAppState("completed");
  }

  if (appState === "idle") {
    return (
      <>
        <div>
          This page runs a series of tests to characterize your browser and
          network&#39;s ability to connect to Daily calls. It needs to access
          your camera in order to provide a video stream to measure network
          performance, but your video isn&#39;t viewed or stored anywhere.
        </div>
        <div style={{ marginTop: "2em" }}>
          <Button onClick={start}>Run Test</Button>
        </div>
      </>
    );
  }

  if (appState === "starting") {
    return <div>Starting...</div>;
  }

  if (appState === "running-network") {
    return (
      <Flex gap="3">
        <Box minWidth="300px" maxWidth="400px">
          <Card>
            <Heading as="h3" style={{ marginBottom: "1em" }}>
              WebRTC Connections
            </Heading>
            <Network networkTestResults={networkTestResults} />
          </Card>
        </Box>
        <Box minWidth="300px" maxWidth="400px">
          <Card>
            <Heading as="h3" style={{ marginBottom: "1em" }}>
              Websocket Regions
            </Heading>
            Waiting...
          </Card>
        </Box>
        <Box minWidth="300px" maxWidth="400px">
          <Card>
            <Heading as="h3" style={{ marginBottom: "1em" }}>
              Daily Call Quality
            </Heading>
            Waiting...
          </Card>
        </Box>
      </Flex>
    );
  }

  if (appState === "running-websocket") {
    return (
      <Flex gap="3">
        <Box minWidth="300px" maxWidth="400px">
          <Card>
            <Heading as="h3" style={{ marginBottom: "1em" }}>
              WebRTC Connections
            </Heading>
            <Network networkTestResults={networkTestResults} />
          </Card>
        </Box>
        <Box minWidth="300px" maxWidth="400px">
          <Card>
            <Heading as="h3" style={{ marginBottom: "1em" }}>
              Websocket Regions
            </Heading>
            <Websockets websocketTestResults={websocketTestResults} />
          </Card>
        </Box>
        <Box minWidth="300px" maxWidth="400px">
          <Card>
            <Heading as="h3" style={{ marginBottom: "1em" }}>
              Daily Call Quality
            </Heading>
            Waiting...
          </Card>
        </Box>
      </Flex>
    );
  }

  if (appState === "running-call") {
    return (
      <Flex gap="3">
        <Box minWidth="300px" maxWidth="400px">
          <Card>
            <Heading as="h3" style={{ marginBottom: "1em" }}>
              WebRTC Connections
            </Heading>
            <Network networkTestResults={networkTestResults} />
          </Card>
        </Box>
        <Box minWidth="300px" maxWidth="400px">
          <Card>
            <Heading as="h3" style={{ marginBottom: "1em" }}>
              Websocket Regions
            </Heading>
            <Websockets websocketTestResults={websocketTestResults} />
          </Card>
        </Box>
        <Box minWidth="300px" maxWidth="400px">
          <Card>
            <Heading as="h3" style={{ marginBottom: "1em" }}>
              Daily Call Quality
            </Heading>
            <CallQuality callQualityResults={callQualityResults} />
          </Card>
        </Box>
      </Flex>
    );
  }

  return (
    <>
      <Flex gap="3">
        <Box minWidth="320px" maxWidth="420px">
          <Card>
            <Heading as="h3" style={{ marginBottom: "1em" }}>
              WebRTC Connections
            </Heading>
            <Network networkTestResults={networkTestResults} />
          </Card>
        </Box>
        <Box minWidth="320px" maxWidth="420px">
          <Card>
            <Heading as="h3" style={{ marginBottom: "1em" }}>
              Websocket Regions
            </Heading>
            <Websockets websocketTestResults={websocketTestResults} />
          </Card>
        </Box>
        <Box minWidth="320px" maxWidth="420px">
          <Card>
            <Heading as="h3" style={{ marginBottom: "1em" }}>
              Daily Call Quality
            </Heading>
            <CallQuality callQualityResults={callQualityResults} />
          </Card>
        </Box>
      </Flex>
      <Section style={{ textAlign: "center" }}>
        <Button onClick={copyResults}>Copy Full Results to Clipboard</Button>
      </Section>
    </>
  );
}
