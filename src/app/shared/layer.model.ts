export class Layer {
  id: string;
  type: 'circle' = 'circle';
  source: string;
  paint: {
    'circle-color': any;
    'circle-radius': number;
  };

  constructor(id: string, source: string) {
    this.id = id;
    this.source = source;
    this.paint = {
      'circle-color': ['match', ['get', 'color'], 'red', '#FF0000', 'green', '#00FF00', 'blue', '#0000FF', '#CCC'],
      'circle-radius': 10,
    };
  }

}
