export interface Point {
  type: 'Point';
  coordinates: [number, number];
}

export class Feature {
  type: 'Feature' = 'Feature';
  geometry: Point;
  properties: {
    name: string;
    description: string;
    color: string;
  };

constructor(lng: number, lat: number, name: string, description: string, color: string) {
  this.geometry = {
    type: 'Point',
    coordinates: [lng, lat]
  };
  this.properties = { name, description, color,};
}

}
