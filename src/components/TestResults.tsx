import { Progress, Badge, DataList, Button, Code, Box } from "@radix-ui/themes";

export interface TestResultProps {
  result: string;
  extraData: () => JSX.Element;
}
export default function TestResults({ result, extraData }: TestResultProps) {
  function resultBadge(result: string) {
    const colors = {
      passed: "jade",
      failed: "tomato",
      good: "jade",
      bad: "tomato",
      warning: "orange",
    } as any;
    let color = colors[result] || "gray";
    return (
      <Badge color={color} variant="soft" radius="full">
        {result}
      </Badge>
    );
  }

  return (
    <DataList.Root>
      <DataList.Item>
        <DataList.Label minWidth="88px">Result</DataList.Label>
        <DataList.Value>{resultBadge(result)}</DataList.Value>
      </DataList.Item>
      {extraData()}
    </DataList.Root>
  );
}
