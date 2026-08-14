'use client';

import { useState } from 'react';
import { useDaily } from '@daily-co/daily-react';
import {
  DailyCallQualityTestResults,
  DailyNetworkConnectivityTestStats,
  DailyWebsocketConnectivityTestResults,
} from '@daily-co/daily-js';
import {
  Button,
  Callout,
  Card,
  Code,
  Box,
  Flex,
  Heading,
  Section,
} from '@radix-ui/themes';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import CallQuality from './CallQuality';
import FirewallNotice from './FirewallNotice';
import Network from './Network';
import Websockets from './Websockets';

type AppState =
  | 'idle'
  | 'starting'
  | 'running-network'
  | 'running-websocket'
  | 'running-call'
  | 'completed';

// Only these mean the network itself is the problem. 'warning' counts because
// the websocket test returns it when some regions connect and others don't,
// which is the usual sign of a partly blocked firewall.
//
// Two things deliberately don't count. 'aborted' only happens when the user
// clicks Cancel, so blaming their firewall would be wrong. A null result means
// the test never ran at all, which is a device or browser problem, not a
// network one.
const PROBLEM_RESULTS = ['failed', 'warning', 'bad'];

function hasNetworkIssue(...results: Array<{ result: string } | null>) {
  return results.some((r) => r != null && PROBLEM_RESULTS.includes(r.result));
}

// Declared outside App so it isn't recreated on every render. Recreating it
// remounts the cards, which throws away the open/closed state of the details
// disclosures inside them.
function CardLayout({
  appState,
  networkTestResults,
  websocketTestResults,
  callQualityResults,
}: {
  appState: AppState;
  networkTestResults: DailyNetworkConnectivityTestStats | null;
  websocketTestResults: DailyWebsocketConnectivityTestResults | null;
  callQualityResults: DailyCallQualityTestResults | null;
}) {
  // Once the run is over, a card with no result never got one: the test was
  // skipped or threw. Tell it to say so instead of spinning forever behind a
  // Cancel button whose call object is already destroyed.
  const done = appState === 'completed';

  return (
    <Flex direction={{ initial: 'column', sm: 'row' }} gap="3" width="100%">
      <Box width={{ initial: '100%', sm: '33.33%' }}>
        <Card>
          <Heading as="h3" mb="3">
            WebRTC Connections
          </Heading>
          <Network
            networkTestResults={networkTestResults}
            notRun={done && !networkTestResults}
          />
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
            <Websockets
              websocketTestResults={websocketTestResults}
              notRun={done && !websocketTestResults}
            />
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
            <CallQuality
              callQualityResults={callQualityResults}
              notRun={done && !callQualityResults}
            />
          )}
        </Card>
      </Box>
    </Flex>
  );
}

export default function App() {
  // const [appState, setAppState] = useAtom(appStateAtom);
  const [appState, setAppState] = useState<AppState>('idle');
  const [callQualityResults, setCallQualityResults] =
    useState<DailyCallQualityTestResults | null>(null);
  const [networkTestResults, setNetworkTestResults] =
    useState<DailyNetworkConnectivityTestStats | null>(null);
  const [websocketTestResults, setWebsocketTestResults] =
    useState<DailyWebsocketConnectivityTestResults | null>(null);
  const [startError, setStartError] = useState<string | null>(null);

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
    setStartError(null);
    // Everything runs inside try/finally so a thrown error still lands on
    // 'completed'. Without it, a rejected startCamera() (denied camera
    // permission is the common one) leaves the page stuck on "Starting..."
    // forever, and the user never sees the results or the firewall guidance.
    try {
      await call?.startCamera();
      setAppState('running-network');
      const videoTrack = call?.participants().local.tracks.video
        .persistentTrack;
      // No camera track means the network test can't run at all. Skip it and
      // let the card report that, rather than testing nothing.
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
    } catch (err) {
      setStartError(err instanceof Error ? err.message : String(err));
    } finally {
      try {
        await call?.destroy();
      } catch {
        // Teardown failing doesn't invalidate whatever results we did get.
      }
      setAppState('completed');
    }
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

  const cards = (
    <CardLayout
      appState={appState}
      networkTestResults={networkTestResults}
      websocketTestResults={websocketTestResults}
      callQualityResults={callQualityResults}
    />
  );

  if (
    appState === 'running-network' ||
    appState === 'running-websocket' ||
    appState === 'running-call'
  ) {
    return cards;
  }

  return (
    <Flex direction="column" gap="3">
      {cards}
      {startError && (
        <Callout.Root color="red" style={{ textAlign: 'left' }}>
          <Callout.Icon>
            <ExclamationTriangleIcon />
          </Callout.Icon>
          <Callout.Text>
            The tests stopped early: <Code>{startError}</Code>
          </Callout.Text>
        </Callout.Root>
      )}
      {hasNetworkIssue(
        networkTestResults,
        websocketTestResults,
        callQualityResults
      ) && <FirewallNotice />}
      <Section style={{ textAlign: 'center' }}>
        <Button onClick={copyResults}>Copy Full Results to Clipboard</Button>
      </Section>
    </Flex>
  );
}
