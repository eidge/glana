Next up:
  - Refactor / Redesign!
      - [ ] Handle load errors!
      - [ ] Upload flights screen

- [ ] Bugs:
  - [ ] Changing playback speed messes with zoom
    - I should use extent of full line regardless of what is showing atm for
        zoomToFit
  - [ ] Handle showing time appropriately -> Should always show local time of
      flight, not local time of browser!!!

- UI Improvements
  - [ ] Store config in localStorage
  - [ ] Keep track points visible for x minutes.
  - [ ] Bring followedFlight forward (z-index) to avoid it being clobbered by
      other flights.
  - [ ] Hide zoom controls on mobile
  - [ ] Synchronize flights by real-time by default. If a viewing multiple
      flights from different days, then synchronize by startedAt (push a toast
      message in doing so).
  - [ ] Before side drawer opens we should take map boundaries and ensure they're
      visible after it's open (i.e. the map view is the same but zoomed
      out).
  - [ ] Timeline details padding:
    - [ ] Should pad to flights max value
    - [ ] Should break evenly - every line should have the same number of
        flights

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
  - [ ] Show task started & each turnpoint as a flight stage
  - [ ] Highlight current row in altitude chart + flight track

- [ ] Thermals
  - % left vs right
  - # tries (duration less than 45s)
  - # thermals
  - average vario

- Task - per leg:
  - [ ] #thermals, average vario, average glide angle & distance

- [ ] Summary
  - Average vario, average glide angle, glide distance (distance between
      thermals)
  - High point, low point, altitude gain
  - [ ] Make each flight a card - unknown regs are G-DOE
  - [ ] Use this screen to show / hide flights & also upload new flights

- [ ] BGA
  - [x] Airspace Layer
  - [x] Barrel config - this should come from the bga, maybe FAI vs BGA tps.
  - Engine detection:
    - [x] Chart
    - [x] Track
  - Handle invalid traces from BGA:
    - [x] Single trace
    - [x] Multiple traces (all broken, some broken)
  - [ ] Flight stats
  - [ ] Photos markers
  - [ ] Clouds/Weather Layer

Backlog:
  - [ ] Wind calculation: http://blueflyvario.blogspot.com/2012/09/calculating-wind-speed-from-gps-track.html

Crazy Ideas:

- Integrate flarm - as you navigate flight, you see all planes that were there
    at that moment.

Notes:

- Code for the bga viewer: https://github.com/GlidingWeb/IGCWebView | https://github.com/GlidingWeb/IgcWebview2/

Done:
