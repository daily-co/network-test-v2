import { Badge, Box, Text, Flex } from "@radix-ui/themes";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import * as Separator from "@radix-ui/react-separator";

export interface TestResultProps {
  result: string;
  extraData?: () => JSX.Element;
}
export default function TestResults({ result, extraData }: TestResultProps) {
  function resultBadge(result: string) {
    const colors = {
      passed: "jade",
      failed: "tomato",
      good: "jade",
      bad: "tomato",
      warning: "orange",
    };
    const color = colors[result] || "gray";
    return (
      <Badge color={color} variant="soft" size="3">
        <Text style={{ fontSize: "1.2em" }}>{result}</Text>
      </Badge>
    );
  }

  return (
    <Accordion.Root type="single" collapsible>
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Flex>
            <Box width="90%">Result: {resultBadge(result)}</Box>
            {extraData && (
              <Box>
                <Accordion.Trigger className="AccordionTrigger">
                  <Flex gap="2">
                    <Text style={{ marginTop: "0.3em" }}>details</Text>
                    <ChevronDownIcon
                      className="AccordionChevron"
                      aria-hidden
                      style={{ marginTop: "0.5em" }}
                    />
                  </Flex>
                </Accordion.Trigger>
              </Box>
            )}
          </Flex>
        </Accordion.Header>
        <Accordion.Content className="AccordionContent">
          <Separator.Root
            className="SeparatorRoot"
            orientation="horizontal"
            style={{ margin: "15px 0" }}
          />

          {extraData && extraData()}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
