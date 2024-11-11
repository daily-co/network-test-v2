import { DailyNetworkConnectivityTestStats } from "@daily-co/daily-js";
import { Progress, DataList, Badge, Button, Box } from "@radix-ui/themes";
import { useDaily } from "@daily-co/daily-react";

export default function Network({
  networkTestResults,
}: {
  networkTestResults: DailyNetworkConnectivityTestStats | null;
}) {
  const call = useDaily();

  function cancelTest() {
    call?.abortTestNetworkConnectivity();
  }
  function resultBadge(result: string) {
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
  if (networkTestResults) {
    return (
      <DataList.Root>
        <DataList.Item>
          <DataList.Label minWidth="88px">Result</DataList.Label>
          <DataList.Value>
            {resultBadge(networkTestResults.result)}
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>
    );
  }

  return (
    <>
      <Progress duration="30s" />
      <Box style={{ textAlign: "center", marginTop: "1em" }}>
        <Button onClick={cancelTest}>Cancel</Button>
      </Box>
    </>
  );
}
