Next up:

- [ ] Bugs:
  - [ ] Handle showing time appropriately -> Should always show local time of
      flight, not local time of browser!!!

- UI Improvements
  - [ ] Store config in localStorage
  - [ ] Keep track points visible for x minutes.
  - [ ] When a task is abandoned, on the flight summary screen display how much
      of the task was done instead of the total distance.
      - I should add a new calculated value for "remaining task km" and then a
          min stat for it
  - [x] Bring followedFlight forward (z-index) to avoid it being clobbered by
      other flights.
      - [ ] Flight marker (glider) zIndex should be above all traces!
  - [x] Hide zoom controls on mobile
  - [x] Synchronize flights by real-time by default. If a viewing multiple
      flights from different days, then synchronize by startedAt (push a toast
      message in doing so).
  - [ ] Timeline details padding:
    - [ ] Should pad to flights max value
    - [ ] Should break evenly - every line should have the same number of
        flights
  - [ ] Allow switching tasks
    - From the ones available in the flights.
    - Upload / Create a new one.

- [ ] Stats
  - [ ] When flight group has more than one task, ask user to select a task to
      use.
  - [ ] When playing a flight, everytime a thermal finishes it's average
      animates on the map. Like when points are collected in platform game.

- [ ] Phases
  - [ ] Click thermal to see vertical chart of that thermal (i.e. to
      understand if I'm using a thermal for too long - i.e. should have left
      earlier!).
  - Filters
    - [x] Filter by phase: Thermal | Glide
    - [ ] Filter phases inside / outside task or both.
  - [ ] Consider showing all flights phases in the same table, to compare glides
        and thermals at the same time.
  - [ ] Show task started & each turnpoint as a flight phase
  - [ ] Highlight current row in altitude chart + flight track

- [ ] Thermals
  - % left vs right
  - # tries (duration less than 45s)
  - # thermals
  - average vario

- Task - per leg:
  - [ ] #thermals, average vario, average glide angle & distance
  - [ ] Implement Netto as a stat, it's a great indicator of how well you've
      picked your route (i.e. did you manage to stay in lift?)
      - It can be used as an average / mean to show an aggregated view, but also
          to colour the flight track to show where you got the track wrong!

- [ ] Summary
  - [ ] Average vario, average glide angle, glide distance (distance between
      thermals)
  - [ ] High point, low point, altitude gain
  - [x] Make each flight a card - unknown regs are G-DOE
  - [x] Use this screen to show / hide flights & also upload new flights

- [x] BGA
  - [x] Airspace Layer
  - [x] Barrel config - this should come from the bga, maybe FAI vs BGA tps.
  - Engine detection:
    - [x] Chart
    - [x] Track
  - Handle invalid traces from BGA:
    - [x] Single trace
    - [x] Multiple traces (all broken, some broken)
  - [x] Flight stats
  - [x] Photos markers
  - [x] Clouds/Weather Layer

Backlog of ideas:
  - [ ] Wind calculation: http://blueflyvario.blogspot.com/2012/09/calculating-wind-speed-from-gps-track.html
  - [ ] Use radar chart to display task stats: Number of climbs, avg climb rate,
      number of glides, median glide length, median glide speed
  - [ ] Export video or image (e.g. for instagram)
      - Full track, summary stats

Crazy Ideas:

- Integrate flarm - as you navigate flight, you see all planes that were there
    at that moment.
- Do flight plans with "local airfield" calculation for planning flights in the
    alps, like you can with this: https://www.glideplan.com/styled-2/page8/index.html

Notes:

- Code for the bga viewer: https://github.com/GlidingWeb/IGCWebView | https://github.com/GlidingWeb/IgcWebview2/
- Reach out to this guy for publicity: https://chessintheair.com/do-you-know-your-turf-off-season-homework-for-cross-country-pilots/
- Vision: To be the best flight analysis and planning tool!

