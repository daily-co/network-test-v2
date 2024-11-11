import { DailyCallQualityTestResults } from "@daily-co/daily-js";
import { DataList, Code } from "@radix-ui/themes";
import { useDaily } from "@daily-co/daily-react";
import RunningIndicator from "./RunningIndicator";
import TestResults from "./TestResults";

export default function CallQuality({
  callQualityResults,
}: {
  callQualityResults: DailyCallQualityTestResults | null;
}) {
  const call = useDaily();

  function cancelTest() {
    call?.stopTestCallQuality();
  }

  function formatBitrate(b: number) {
    if (b > 1000000) {
      return Math.round(b / 10000.0) / 100.0 + " Mbps";
    } else if (b > 1000) {
      return Math.round(b / 1000.0) + " kbps";
    } else {
      return b + " bps";
    }
  }

  function extraData() {
    switch (callQualityResults?.result) {
      case "good":
      case "warning":
      case "bad":
        return (
          <DataList.Root>
            <DataList.Item>
              <DataList.Label minWidth="88px">Max RTT</DataList.Label>
              <DataList.Value>
                {callQualityResults.data.maxRoundTripTime &&
                  Math.round(callQualityResults.data.maxRoundTripTime * 1000.0)}
                ms
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label minWidth="88px">Avg RTT</DataList.Label>
              <DataList.Value>
                {callQualityResults.data.avgRoundTripTime &&
                  Math.round(callQualityResults.data.avgRoundTripTime * 1000.0)}
                ms
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label minWidth="88px">
                Avg Send Packet Loss
              </DataList.Label>
              <DataList.Value>
                {callQualityResults.data.avgSendPacketLoss &&
                  Math.round(
                    callQualityResults.data.avgSendPacketLoss * 1000.0
                  ) / 10.0}
                %
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label minWidth="88px">
                Avg Available Outgoing Bitrate
              </DataList.Label>
              <DataList.Value>
                {callQualityResults.data.avgAvailableOutgoingBitrate &&
                  formatBitrate(
                    callQualityResults.data.avgAvailableOutgoingBitrate
                  )}
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label minWidth="88px">Avg Sent Bitrate</DataList.Label>
              <DataList.Value>
                {callQualityResults.data.avgSendBitsPerSecond &&
                  formatBitrate(callQualityResults.data.avgSendBitsPerSecond)}
              </DataList.Value>
            </DataList.Item>
          </DataList.Root>
        );
      case "failed":
        return (
          <DataList.Root>
            <DataList.Item>
              <DataList.Label minWidth="88px">Error Message</DataList.Label>
              <DataList.Value>
                <Code>{callQualityResults.errorMsg}</Code>
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label minWidth="88px">Error Data</DataList.Label>
              <DataList.Value>
                <Code>{JSON.stringify(callQualityResults.error, null, 4)}</Code>
              </DataList.Value>
            </DataList.Item>
          </DataList.Root>
        );
      default:
        return <></>;
    }
  }

  if (callQualityResults) {
    return (
      <TestResults result={callQualityResults.result} extraData={extraData} />
    );
  }

  return <RunningIndicator duration="30s" buttonCallback={cancelTest} />;
}
