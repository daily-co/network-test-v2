# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install     # npm only; there is no yarn.lock and yarn should not be used
npm run dev     # dev server on http://localhost:3000
npm run build   # production build (also the fastest full typecheck)
npm start       # serve the production build
npm run lint    # eslint . using the flat config in eslint.config.mjs
```

There is no test framework in this repo. "Tests" here means the daily-js diagnostic tests the app runs in the browser, not unit tests. To verify a change, run `npm run dev` and click "Run Test" in a real browser with a camera.

## What this app is

A deliberately small Next.js 16 App Router page that runs three daily-js diagnostics in sequence and shows the results. It is meant to be forked as a starting point for a branded network test page, so keep it simple: resist adding state libraries, routes, or abstractions that aren't needed.

The three tests, run in this fixed order:

1. `testNetworkConnectivity(videoTrack)`: WebRTC/UDP reachability, about 30s
2. `testWebsocketConnectivity()`: per-region websocket reachability, about 10s
3. `testCallQuality()`: RTT, packet loss, bitrate against a real Daily room, about 30s

## Architecture

The whole flow lives in one state machine in `src/components/App.tsx`. `appState` moves `idle -> starting -> running-network -> running-websocket -> running-call -> completed`, and `start()` awaits each test in turn, storing each result in its own `useState`. The three result cards are always rendered together; each card decides what to show from two inputs:

- If its result object is `null`, it renders `RunningIndicator` (progress bar plus a Cancel button wired to that test's abort method).
- If the result exists, it renders `TestResults` with a colored badge and an optional collapsible "details" panel.

`App.tsx` additionally shows the literal string "Waiting..." for cards whose test has not started yet, so a card can be in three visual states even though only two live in the child component.

When every test is done, `hasNetworkIssue()` decides whether to render `FirewallNotice`. It treats `failed`, `warning`, and `bad` as a problem; it deliberately does not fire on `aborted` or on a `null` result. Catching `warning` is deliberate: the websocket test returns it when only some regions connect, which is the usual signature of a partly blocked firewall.

`CardLayout` is declared at module scope, not inside `App`. Keep it there. Defining it inside the component recreates it on every render, which remounts the cards and throws away the open/closed state of the details disclosures.

Key wiring details that are easy to get wrong:

- `src/app/page.tsx` is the client boundary. It creates a jotai store, calls `useCallObject({})`, and passes both into `DailyProvider`. daily-react needs that same jotai store, so any new global state should reuse `jotaiStore` rather than creating a second `Provider`.
- The network test needs a real camera track: `start()` calls `startCamera()` first and pulls `participants().local.tracks.video.persistentTrack`. If that track is missing, the network test is silently skipped and its card stays on the running indicator forever.
- `start()` calls `call.destroy()` when it finishes. The call object cannot be reused after that, so the app has no re-run path. A user has to reload the page. If you add a "run again" button, the call object has to be recreated, not just reset.
- Each test's cancel method is different and lives in the matching component: `abortTestNetworkConnectivity()` (`Network.tsx`), `abortTestWebsocketConnectivity()` (`Websockets.tsx`), `stopTestCallQuality()` (`CallQuality.tsx`).
- `copyResults()` dumps all three raw result objects as one JSON blob to the clipboard. That blob is what a customer pastes into a support ticket, so avoid reshaping or trimming it.

## UI conventions

Radix Themes provides all layout and components (`Flex`, `Box`, `Card`, `DataList`, `Badge`, `Progress`, `Callout`). There is no CSS framework: Tailwind was removed because nothing used it, and Radix Themes ships its own reset. Style with Radix props first. The only hand-written CSS lives in `src/app/globals.css`, and `TestResults.tsx` depends on it for the accordion chevron animation (`.AccordionChevron`, `.AccordionTrigger[data-state="open"]`) and the separator line.

Result strings differ per test: the network test returns `passed` / `failed` / `aborted`, the websocket test adds `warning`, and call quality returns `good` / `warning` / `bad` / `failed` / `aborted`. `TestResults` maps them to badge colors in one lookup and falls back to gray for anything unknown.

Prettier config is single quotes with semicolons, but parts of the codebase still use double quotes. Match the file you are editing.

## Dependency notes

`@daily-co/daily-js` is on `^0.91.0`. Daily only supports versions released in the past six months, and the published floor is currently 0.85.0, so when this app misbehaves check the installed version before digging into app code. Two specifics worth knowing: 0.89.1 fixed a bug that made every `testCallQuality()` call fail, and 0.91.0 added automatic failover from `daily.co` to `dailywebrtc.com` / `dailywebrtc.net`, which is why the networking guide now matters for restrictive networks.

Two dependencies are deliberately not on the latest major, and both will look like something to "fix" if you only read the version numbers:

- **eslint is pinned to `^9`, not 10.** `eslint-config-next@16` declares `eslint >=9` but bundles an `eslint-plugin-react` that calls `context.getFilename()`, which ESLint 10 removed. Linting crashes on startup with ESLint 10. Revisit when Next ships an updated config.
- **typescript is pinned to `^6`, not 7.** `typescript-eslint` hard-throws "does not support TS 7.0" at import time, which takes the whole lint run down with it. Tracked at typescript-eslint#10940.

Whenever `package.json` changes, regenerate `package-lock.json` in the same commit. A previous PR bumped versions without touching the lockfile, and the repo silently installed daily-js 0.73.0 for months.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
