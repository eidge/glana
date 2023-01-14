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

  - Replays:
    - [ ] When playing a flight, everytime a thermal finishes it's average
      animates on the map. Like when points are collected in platform game.
    - [ ] Add ability to export replay as a video
    - [ ] Track gradient based on stat (e.g. vario, speed, altitude, etc)

- [ ] Phases
  - [ ] Click thermal to see vertical chart of that thermal (i.e. to
      understand if I'm using a thermal for too long - i.e. should have left
      earlier!).
  - [ ] Highlight current row in altitude chart + flight track

- Stats
  - Thermals
    - [ ] % left vs right
    - [ ] # tries (duration less than 45s)
    - [ ] High point, low point, altitude gain
  - Glides
    - [ ] Implement Netto as a stat, it's a great indicator of how well you've
        picked your route (i.e. did you manage to stay in lift?)
        - It can be used as an average / mean to show an aggregated view, but also
            to colour the flight track to show where you got the track wrong!
    - [ ] Average glide distance (distance between thermals)
  - Other
    - [ ] Wind calculation: http://blueflyvario.blogspot.com/2012/09/calculating-wind-speed-from-gps-track.html
    - [ ] Use radar chart to display task stats: Number of climbs, avg climb rate,
      number of glides, median glide length, median glide speed


Crazy Ideas:

- Integrate flarm - as you navigate flight, you see all planes that were there
    at that moment.
- Do flight plans with "local airfield" calculation for planning flights in the
    alps, like you can with this: https://www.glideplan.com/styled-2/page8/index.html

Notes:

- Code for the bga viewer: https://github.com/GlidingWeb/IGCWebView | https://github.com/GlidingWeb/IgcWebview2/
- Reach out to this guy for publicity: https://chessintheair.com/do-you-know-your-turf-off-season-homework-for-cross-country-pilots/
- Vision: To be the best flight analysis and planning tool!

