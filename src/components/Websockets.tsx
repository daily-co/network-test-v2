import { DailyWebsocketConnectivityTestResults } from '@daily-co/daily-js';
import { DataList, Code } from '@radix-ui/themes';
import { useDaily } from '@daily-co/daily-react';
import NotRun from './NotRun';
import RunningIndicator from './RunningIndicator';
import TestResults from './TestResults';

export default function Websockets({
  websocketTestResults,
  notRun,
}: {
  websocketTestResults: DailyWebsocketConnectivityTestResults | null;
  notRun?: boolean;
}) {
  const call = useDaily();

  function cancelTest() {
    call?.abortTestWebsocketConnectivity();
  }

  function listRegions(regions: string[] | undefined) {
    if (Array.isArray(regions) && regions.length > 0) {
      const rr = regions.map((r, i) => {
        return (
          <div key={i}>
            <Code>{r}</Code>
          </div>
        );
      });
      return <div>{rr}</div>;
    } else {
      return (
        <div>
          <Code>none</Code>
        </div>
      );
    }
  }

  function extraData() {
    return (
      <DataList.Root>
        <DataList.Item>
          <DataList.Label minWidth="80px">Passed Regions</DataList.Label>
          <DataList.Value>
            {listRegions(websocketTestResults?.passedRegions)}
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label minWidth="80px">Failed Regions</DataList.Label>
          <DataList.Value>
            {listRegions(websocketTestResults?.failedRegions)}
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label minWidth="80px">Aborted Regions</DataList.Label>
          <DataList.Value>
            {listRegions(websocketTestResults?.abortedRegions)}
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>
    );
  }

  if (websocketTestResults) {
    return (
      <TestResults result={websocketTestResults.result} extraData={extraData} />
    );
  }

  if (notRun) {
    return <NotRun />;
  }

  return <RunningIndicator duration="10s" buttonCallback={cancelTest} />;
}
