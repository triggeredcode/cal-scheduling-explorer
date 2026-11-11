# Design and model plan
A shared calendar experiment, not a dashboard. Visitors choose a scenario, advance one booking at a time, and see both methods respond on the same stage.

Palette: porcelain #f5f7fc, paper #ffffff, ink #17213b, cobalt #254bc7, muted coral #af3b49, pine #12634c. Red means enumerated alternatives/rejection; green means committed greedy choices. DM Sans carries the interface; quantities use tabular numerals. One two-column comparison, clear controls, responsive stacked stage on mobile. No decorative motion; playback starts only on request.

Baseline: H hosts, B non-overlapping requests, every host eligible every time. Exhaustive enumerates H^B complete assignments and minimizes sum of squared host counts; greedy picks the least-loaded host with stable index tie-break. This is a teaching model of local balancing, not Cal.com's full production policy. All requests known to exhaustive.

Rare-host scenario: same-time requests, host capacity one. First allows A or B; second only A. Exhaustive includes an unassigned option and maximizes accepted count, then balances loads. Six raw complete combinations, one infeasible double-booking. Greedy chooses A first, then cannot place the second request. Formula H^B is shown only for baseline, not this scenario. Counters distinguish full candidates from host inspections; neither is a measured latency.

Interval operations use half-open ranges [start,end). Busy ranges are sorted/merged safely; subtraction returns positive gaps, intersection advances an ending pointer. Slot starts include only meetings that fit entirely in each surviving range.
