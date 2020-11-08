Next up:

- [ ] UI improvements
  - [x] Test mobile - specially timeline
      - [ ] Swipe is slow, because of Nivo.
  - [ ] Show task started and each turnpoint on Timeline?
  - [ ] Control which flight to follow
      - [ ] Use flight's task!
  - [x] Toggle for follow flight
  - [ ] Store config in localStorage
  - [ ] Play flight
  - [ ] Replace nivo with something faster
- [ ] Deploy
  - [x] Loading screen
  - [x] Flight upload screen
  - [ ] Load flights from BGA
- [ ] Flight phases
  - [ ] Render phases chart
  - [ ] Show phase stats

Backlog:
  - [ ] Wind calculation: http://blueflyvario.blogspot.com/2012/09/calculating-wind-speed-from-gps-track.html

Crazy Ideas:

- Integrate flarm - as you navigate flight, you see all planes that were there
    at that moment.

Notes:

- Code for the bga viewer: https://github.com/GlidingWeb/IGCWebView | https://github.com/GlidingWeb/IgcWebview2/

Done:
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
