import { Badge, Text } from '@radix-ui/themes';

// Shown when a run finished but this test never produced a result, so the card
// has nothing to report. Without it the card sits on a progress bar forever.
export default function NotRun() {
  return (
    <Text>
      Result:{' '}
      <Badge color="gray" variant="soft" size="3">
        <Text style={{ fontSize: '1.2em' }}>not run</Text>
      </Badge>
    </Text>
  );
}
