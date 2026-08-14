import { DailyNetworkConnectivityTestStats } from "@daily-co/daily-js";

import { useDaily } from "@daily-co/daily-react";
import NotRun from "./NotRun";
import RunningIndicator from "./RunningIndicator";
import TestResults from "./TestResults";

export default function Network({
  networkTestResults,
  notRun,
}: {
  networkTestResults: DailyNetworkConnectivityTestStats | null;
  notRun?: boolean;
}) {
  const call = useDaily();

  function cancelTest() {
    call?.abortTestNetworkConnectivity();
  }

  if (networkTestResults) {
    return <TestResults result={networkTestResults.result} />;
  }

  // Usually means there was no camera track to test with.
  if (notRun) {
    return <NotRun />;
  }

  return <RunningIndicator duration="30s" buttonCallback={cancelTest} />;
}
