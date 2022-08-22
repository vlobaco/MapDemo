import { Feature } from './feature.model';

export class FeatureCollection {
  type: 'FeatureCollection' = 'FeatureCollection';
  features: Feature[];

  constructor() {
    this.features = [];
  }
}
