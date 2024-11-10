import { DailyCallQualityTestResults } from "@daily-co/daily-js";
import { Progress, Badge, DataList, Button, Box } from "@radix-ui/themes";
import { useDaily } from "@daily-co/daily-react";

export default function CallQuality({
  callQualityResults,
}: {
  callQualityResults: DailyCallQualityTestResults | null;
}) {
  const call = useDaily();

  function cancelTest() {
    call?.stopTestCallQuality();
  }
  function resultBadge(result: string) {
    switch (result) {
      case "good":
        return (
          <Badge color="jade" variant="soft" radius="full">
            good
          </Badge>
        );
      case "bad":
        return (
          <Badge color="tomato" variant="soft" radius="full">
            bad
          </Badge>
        );
      case "failed":
        return (
          <Badge color="tomato" variant="soft" radius="full">
            failed
          </Badge>
        );
      case "warning":
        return (
          <Badge color="orange" variant="soft" radius="full">
            warning
          </Badge>
        );
      case "aborted":
        return (
          <Badge color="gray" variant="soft" radius="full">
            canceled
          </Badge>
        );
      default:
        return (
          <Badge color="gray" variant="soft" radius="full">
            unknown
          </Badge>
        );
    }
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
          <>
            <DataList.Item>
              <DataList.Label minWidth="88px">Max RTT</DataList.Label>
              <DataList.Value>
                {Math.round(callQualityResults.data.maxRoundTripTime * 1000.0)}
                ms
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label minWidth="88px">Avg RTT</DataList.Label>
              <DataList.Value>
                {Math.round(callQualityResults.data.avgRoundTripTime * 1000.0)}
                ms
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label minWidth="88px">
                Avg Send Packet Loss
              </DataList.Label>
              <DataList.Value>
                {Math.round(
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
                {formatBitrate(
                  callQualityResults.data.avgAvailableOutgoingBitrate
                )}
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label minWidth="88px">Avg Sent Bitrate</DataList.Label>
              <DataList.Value>
                {formatBitrate(callQualityResults.data.avgSendBitsPerSecond)}
              </DataList.Value>
            </DataList.Item>
          </>
        );
      case "failed":
        return (
          <>
            <DataList.Item>
              <DataList.Label minWidth="88px">Error Message</DataList.Label>
              <DataList.Value>{callQualityResults.errorMsg}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label minWidth="88px">Error Data</DataList.Label>
              <DataList.Value>
                {JSON.stringify(callQualityResults.error)}
              </DataList.Value>
            </DataList.Item>
          </>
        );
      default:
        return <></>;
    }
  }

  if (callQualityResults) {
    return (
      <DataList.Root>
        <DataList.Item>
          <DataList.Label minWidth="88px">Result</DataList.Label>
          <DataList.Value>
            {resultBadge(callQualityResults.result)}
          </DataList.Value>
        </DataList.Item>
        {extraData()}
      </DataList.Root>
    );
  }

  return (
    <>
      <Progress duration="30s" />
      <Box align="center" style={{ marginTop: "1em" }}>
        <Button onClick={cancelTest}>Cancel</Button>
      </Box>
    </>
  );
}
