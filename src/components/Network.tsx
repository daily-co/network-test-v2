import { DailyNetworkConnectivityTestStats } from "@daily-co/daily-js";

import { useDaily } from "@daily-co/daily-react";
import RunningIndicator from "./RunningIndicator";
import TestResults from "./TestResults";

export default function Network({
  networkTestResults,
}: {
  networkTestResults: DailyNetworkConnectivityTestStats | null;
}) {
  const call = useDaily();

  function cancelTest() {
    call?.abortTestNetworkConnectivity();
  }

  if (networkTestResults) {
    return <TestResults result={networkTestResults.result} />;
  }

  return <RunningIndicator duration="30s" buttonCallback={cancelTest} />;
}
