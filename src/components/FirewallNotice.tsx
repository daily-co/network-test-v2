import { Callout, Link } from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';

const NETWORKING_GUIDE_URL =
  'https://docs.daily.co/docs/guides/privacy-and-security/corporate-firewalls-nats-allowed-ip-list';

export default function FirewallNotice() {
  return (
    <Callout.Root color="orange" style={{ textAlign: 'left' }}>
      <Callout.Icon>
        <InfoCircledIcon />
      </Callout.Icon>
      <Callout.Text>
        Some checks did not pass cleanly. Corporate firewalls, VPNs, and
        security software are the most common cause.{' '}
        <Link
          href={NETWORKING_GUIDE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read Daily&#39;s networking guide
        </Link>{' '}
        for the domains and ports your network needs to allow.
      </Callout.Text>
    </Callout.Root>
  );
}
