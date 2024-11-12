'use client';

import { useState } from 'react';
import { useDaily } from '@daily-co/daily-react';
import {
  DailyCallQualityTestResults,
  DailyNetworkConnectivityTestStats,
  DailyWebsocketConnectivityTestResults,
} from '@daily-co/daily-js';
import { Button, Card, Box, Flex, Heading, Section } from '@radix-ui/themes';
import CallQuality from './CallQuality';
import Network from './Network';
import Websockets from './Websockets';

export default function App() {
  // const [appState, setAppState] = useAtom(appStateAtom);
  const [appState, setAppState] = useState<
    | 'idle'
    | 'starting'
    | 'running-network'
    | 'running-websocket'
    | 'running-call'
    | 'completed'
  >('idle');
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
    setAppState('starting');
    await call?.startCamera();
    setAppState('running-network');
    const videoTrack = call?.participants().local.tracks.video.persistentTrack;
    if (videoTrack) {
      const nt = await call?.testNetworkConnectivity(videoTrack);
      if (nt) {
        setNetworkTestResults(nt);
      }
    }

    setAppState('running-websocket');
    const ws = await call?.testWebsocketConnectivity();
    if (ws) {
      setWebsocketTestResults(ws);
    }
    setAppState('running-call');
    //await call?.preAuth({ url: "https://chad-hq.daily.co/howdy" });
    const cq = await call?.testCallQuality();
    if (cq) {
      setCallQualityResults(cq);
    }
    await call?.destroy();
    setAppState('completed');
  }

  if (appState === 'idle') {
    return (
      <>
        <div>
          This page runs a series of tests to characterize your browser and
          network&#39;s ability to connect to Daily calls. It needs to access
          your camera in order to provide a video stream to measure network
          performance, but your video isn&#39;t viewed or stored anywhere.
        </div>
        <div style={{ marginTop: '2em' }}>
          <Button onClick={start}>Run Test</Button>
        </div>
      </>
    );
  }

  if (appState === 'starting') {
    return <div>Starting...</div>;
  }

  const CardLayout = () => (
    <Flex direction={{ initial: 'column', sm: 'row' }} gap="3" width="100%">
      <Box width={{ initial: '100%', sm: '33.33%' }}>
        <Card>
          <Heading as="h3" mb="3">
            WebRTC Connections
          </Heading>
          <Network networkTestResults={networkTestResults} />
        </Card>
      </Box>
      <Box width={{ initial: '100%', sm: '33.33%' }}>
        <Card>
          <Heading as="h3" mb="3">
            Websocket Regions
          </Heading>
          {appState === 'running-network' ? (
            'Waiting...'
          ) : (
            <Websockets websocketTestResults={websocketTestResults} />
          )}
        </Card>
      </Box>
      <Box width={{ initial: '100%', sm: '33.33%' }}>
        <Card>
          <Heading as="h3" mb="3">
            Daily Call Quality
          </Heading>
          {appState === 'running-network' ||
          appState === 'running-websocket' ? (
            'Waiting...'
          ) : (
            <CallQuality callQualityResults={callQualityResults} />
          )}
        </Card>
      </Box>
    </Flex>
  );

  if (
    appState === 'running-network' ||
    appState === 'running-websocket' ||
    appState === 'running-call'
  ) {
    return <CardLayout />;
  }

  return (
    <Flex direction="column" gap="3">
      <CardLayout />
      <Section style={{ textAlign: 'center' }}>
        <Button onClick={copyResults}>Copy Full Results to Clipboard</Button>
      </Section>
    </Flex>
  );
}
