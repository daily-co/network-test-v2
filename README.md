# Daily Network Test (v2)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) that runs some tests from [daily-js](https://github.com/daily-co/daily-js). Specifically:

- [testNetworkConnectivity](https://docs.daily.co/reference/daily-js/instance-methods/test-network-connectivity)
- [testWebsocketConnectivity](https://docs.daily.co/reference/daily-js/instance-methods/test-websocket-connectivity)
- [testCallQuality](https://docs.daily.co/reference/daily-js/instance-methods/test-call-quality)

Together, these three tests can help diagnose the vast majority of reasons people can't connect to Daily calls.

This app/repo is designed to be a simple as possible, so you can use it as a jumping-off point for building your own branded network test page.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
