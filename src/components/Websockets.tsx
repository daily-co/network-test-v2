import { DailyWebsocketConnectivityTestResults } from "@daily-co/daily-js";
import { Progress, Badge, DataList, Button, Code, Box } from "@radix-ui/themes";
import { useDaily } from "@daily-co/daily-react";

export default function Websockets({
  websocketTestResults,
}: {
  websocketTestResults: DailyWebsocketConnectivityTestResults | null;
}) {
  const call = useDaily();

  function cancelTest() {
    call?.abortTestWebsocketConnectivity();
  }

  function resultBadge(
    result: DailyWebsocketConnectivityTestResults["result"]
  ) {
    switch (result) {
      case "passed":
        return (
          <Badge color="jade" variant="soft" radius="full">
            passed
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

  function extraData(result: DailyWebsocketConnectivityTestResults["result"]) {
    switch (result) {
      case "warning":
        const failures = websocketTestResults?.failedRegions.join(", ");
        return (
          <DataList.Item>
            <DataList.Label minWidth="80px">Failed Regions</DataList.Label>
            <DataList.Value>
              <Code>{failures}</Code>
            </DataList.Value>
          </DataList.Item>
        );
    }
    return <></>;
  }

  if (websocketTestResults) {
    return (
      <DataList.Root>
        <DataList.Item>
          <DataList.Label minWidth="88px">Result</DataList.Label>
          <DataList.Value>
            {resultBadge(websocketTestResults.result)}
          </DataList.Value>
        </DataList.Item>
        {extraData(websocketTestResults.result)}
      </DataList.Root>
    );
  }

  return (
    <>
      <Progress duration="10s" />
      <Box align="center" style={{ marginTop: "1em" }}>
        <Button onClick={cancelTest}>Cancel</Button>
      </Box>
    </>
  );
}
