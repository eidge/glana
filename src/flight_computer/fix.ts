import Position from './position';

class Fix {
  updatedAt: Date;
  gpsAltitude: number;
  pressureAltitude: number | null;
  position: Position;

  constructor(
    updatedAt: Date,
    latitude: number,
    longitude: number,
    gpsAltitude: number,
    pressureAltitude: number | null = null
  ) {
    this.updatedAt = updatedAt;
    this.gpsAltitude = gpsAltitude;
    this.pressureAltitude = pressureAltitude;
    this.position = new Position(
      latitude,
      longitude,
      pressureAltitude || gpsAltitude
    );
  }
}

export default Fix;
