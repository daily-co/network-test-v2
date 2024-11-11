import {
  Progress,
  Button,
  Box,
  Flex,
  Text,
  ProgressProps,
} from "@radix-ui/themes";
export interface RunningIndicatorProps {
  duration: ProgressProps["duration"];
  buttonCallback: () => void;
}

export default function RunningIndicator({
  duration,
  buttonCallback,
}: RunningIndicatorProps) {
  return (
    <Flex gap="4">
      <Box style={{ width: "90%" }}>
        <Text>Running...</Text>
        <Progress style={{ marginTop: "0.1em" }} duration={duration} />
      </Box>
      <Box>
        <Button onClick={buttonCallback}>Cancel</Button>
      </Box>
    </Flex>
  );
}
