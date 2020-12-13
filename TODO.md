Next up:

- [ ] Store config in localStorage
- [ ] Bugs:
  - [x] Changing settings hides task (hbb + a5)
  - [x] Rendering two flights, one that has a task and one that doesn't,
      switching to folloing the flight that has no task does not clear the task.
  - [x] Task layer should always be lower than the others!
  - [ ] Changing playback speed messes with zoom
    - I should use extent of full line regardless of what is showing atm for
        zoomToFit
  - [ ] Handle showing time appropriately -> Should always show local time of
      flight, not local time of browser!!!

- UI Improvements
  - [x] There's no way to close large modals on mobile
  - [x] More than 3 flights and timeline marker occupies too much space.
      - [ ] Consider putting height + vario on same line, probably same space
          occupied!
  - [x] Consider including timelineMarker top into the padding used to calculate
      visibility in the Map. This is to prevent the flight being hidden below
      the timeline marker itself.
      - Another option is to use a dropdown for the marker, so that only one
          flight is displayed there at a time. At least for mobile. These
          solutions might play well together! That's what doarama does!
      - When centering the map, it should center on this "virtual" center
          instead of the actual map center.
  - [ ] Persist some of the settings in the url (Start time)
  - [ ] Keep track points visible for x minutes.
  - [ ] Bring followedFlight forward (z-index) to avoid it being clobbered by
      other flights.
  - [ ] Synchronize flights by real-time by default. If a viewing multiple
      flights from different days, then synchronize by startedAt (push a toast
      message in doing so).

- [ ] Stats
  - [x] table header rounded bug!
  - [x] Icon for stats
  - [x] Choose flight to show stats
  - [ ] Create layout ui component (FullSplitScreen - should handle opening and
      closing side view and mobile breakpoints)
      - [ ] Before panel opens we should take map boundaries and ensure they're
          visible after it's open (i.e. the map view is the same but zoomed
          out).
  - [ ] Per stage stats: Thermal -> height gain + average vario | Glide -> Glide
      angle + KM
  - [ ] Highlight current row in altitude chart + flight track (render entire
      track first when in stats mode!)
  - [ ] Show general stats
    - [x] Flight time
    - [x] Task Distance, Time & speed
    - [ ] High point, Low point
  - [ ] Show flight phases and stats
  - [ ] Show task legs and stats

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
  - Missing data:
    - Callsign (do you have that?)

Backlog:
  - [ ] Wind calculation: http://blueflyvario.blogspot.com/2012/09/calculating-wind-speed-from-gps-track.html

Crazy Ideas:

- Integrate flarm - as you navigate flight, you see all planes that were there
    at that moment.

Notes:

- Code for the bga viewer: https://github.com/GlidingWeb/IGCWebView | https://github.com/GlidingWeb/IgcWebview2/

Done:
- [x] Use binary search for SavedFlight.datumAt
- [x] UI improvements
  - [x] Test mobile - specially timeline
      - [x] Swipe is slow, because of Nivo.
  - [x] Control which flight to follow
      - [x] Use flight's task!
  - [x] Toggle for follow flight
  - [x] Play flight
  - [x] Setting for units 
- [x] Deploy
  - [x] Loading screen
  - [x] Flight upload screen
  - [x] Load flights from URL
  - [x] Load flights from BGA
- [x] Flight phases
  - [x] Show task started and each turnpoint on Timeline?
  - [x] Render phases chart
- [x] Show up visual bar representing phases of flight (gliding vs thermalling)
    - [x] Finish refactor of saved flight to use Analysis
    - [x] Add phases to Analysis
    - [x] Display visual bar
    - [x] Fix problems with non-linear time:
      - Some IGC tracks will have varying record intervals in the same file
          (i.e. 5 seconds before takeoff and 1 second after.)
      - I've made the chart show time linearly which fixes the graph and the
          phases bar, but, all of the relative calculations we were doing for
          hover now do not work - we were assuming indexes were linear in time,
          but they're not if time interval is not always the same!
      - So what can we do?
          - BGA samples IGC points so they're linear in time.
          - We can try change the chart library so we can use their hover
              events, might not work if we want to highlight the timestamp for
              the nearest point being hovered in the map though.
          - We can try to make all calculations based on time rather than point
              index. As time will always be linear!
- [x] Compare multiple flights
  - [x] Show multiple flight tracks
      - [x] Place marker on current timestamp
  - [x] Show multiple altitude charts
- [x] Offset
  - [x] Offset flight group by calculating diff to flight being followed
  - [x] Synchronise options for flights (takeoff time; task started)
  - [x] Saved flight should contain recordingStartedAt, flightStartedAt,
      taskStartedAt, xFinishedAt
  - [x] Create synchro mechanisms for recordingStart, flightStarted, taskStarted
- [x] Render flight as time moves forward
- [x] Tasks
  - [x] Read task from saved flight
  - [x] Render tasks
  - [x] Add task computer
