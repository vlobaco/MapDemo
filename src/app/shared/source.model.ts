import { FeatureCollection } from './featureCollection.model';

export class Source {
  type: 'geojson' = 'geojson';
  data: FeatureCollection;

  constructor() {
    this.data = new FeatureCollection();
  }
}
