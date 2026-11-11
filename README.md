# Cal.com scheduling explorer

Try exhaustive assignment enumeration and a greedy host choice on the same requests, then change busy intervals and inspect available meeting starts.

**Live:** https://triggeredcode.github.io/cal-scheduling-explorer/

Inspired by [Keith Williams’s Cal.com engineering article](https://cal.com/blog/scheduling-is-np-hard-we-need-responses-in-milliseconds). This is an independent educational model, not a copy or benchmark of Cal.com’s production implementation.

## Run locally

No dependencies or build step:

```sh
python3 -m http.server 8765
```

Open http://localhost:8765. JavaScript modules require HTTP rather than opening index.html directly. Tests need Node 20+:

```sh
node --test model.test.js
```

## What is modeled

- **Everyone qualifies:** H hosts and B non-overlapping bookings. Every host is eligible for every request. Exhaustive visits H^B assignments, choosing the smallest sum of squared final loads. Greedy chooses a least-loaded host, ties in stable A/B/C order. This uniform case has an optimal balanced greedy outcome; that is not a general scheduling guarantee.
- **Rare host:** two simultaneous requests, one slot per host. First allows A or B; second requires A. Exhaustive sees both requests, includes a skip option, rejects capacity violations, and maximizes accepted bookings before balancing loads. It visits six raw combinations; five are feasible. Its best assignment is B/A. Greedy chooses A/unassigned, accepting only one.
- **Intervals:** half-open ranges. Busy overlaps are merged, subtraction retains gaps, and the optional second host is intersected. Meeting starts use a 30-minute UTC grid and must fit fully in a free range.

The UI advances both approaches by booking depth. It does not equate a full schedule with a host inspection, report fabricated latency, or prove an exponential lower bound for every exact solver. The tree drawing is capped at 64 nodes per column; displayed counts cover the full model.

Cal.com uses conditional weighted-shortfall selection, priority, and recency. This explorer isolates local balancing, not the complete production policy, routing, credits, caches, concurrency or calendar integrations. The article’s latency observations are not guaranteed by this demo.

## Files and publication

- `model.js`: pure algorithms, independent of DOM.
- `model.test.js`: count/optimality comparisons, rare-host counterexample, interval boundaries and a discrete occupancy oracle.
- `app.js`: playback and UI.
- `notes.pdf`: three-page companion notes.

GitHub Pages serves the root of `main`; `.nojekyll` disables Jekyll processing. Fonts are bundled locally under their SIL Open Font License. No analytics, services, keys or reference voice recordings are included.

Implementation and editorial adaptation used AI assistance, with automated mathematical checks and browser review.
