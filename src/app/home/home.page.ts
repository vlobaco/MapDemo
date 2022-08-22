import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ModalController, ViewDidEnter } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { CreateMarkerComponent } from '../create-marker/create-marker.component';
import { Feature, Point } from '../shared/feature.model';
import { FeatureCollection } from '../shared/featureCollection.model';

import { Layer } from '../shared/layer.model';
import { Source } from '../shared/source.model';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, ViewDidEnter {
  mapbox = (mapboxgl as typeof mapboxgl);
  map: mapboxgl.Map;
  style = `mapbox://styles/mapbox/satellite-streets-v11`;
  // Coordenadas de la localización donde queremos centrar el mapa
  lat = 41.723701;
  lng = -0.870876;
  zoom = 10;
  featureCollection: FeatureCollection;
  enteredFeature: Feature;
  markerClicked = false;
  popUp: mapboxgl.Popup;


  constructor(
    private modalCtrl: ModalController
  ) {
    this.mapbox.accessToken = environment.mapBoxKey;
  }

  ionViewDidEnter(): void {
      this.map.repaint=true;;
  }

  ngOnInit() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat],
      doubleClickZoom: false,
    });
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {enableHighAccuracy: true},
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true
    }));
    this.popUp = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });
    this.map.on('load', () => {
      const source = new Source();
      this.featureCollection = source.data;
      this.map.addSource('markers_source', new Source());
      this.map.addLayer(new Layer('markers_layer', 'markers_source' ));
    });
    this.map.on('click', 'markers_layer', (e) => {
      if (this.enteredFeature) {
        this.closePopUp();
      }
      this.showPopUp(e.features[0] as unknown as Feature);
      this.markerClicked = true;
    });
    this.map.on('click', (e) => {
      console.log('map clicked');
      if (this.markerClicked) {
        this.markerClicked = false;
        return;
      };
      if (this.enteredFeature) {
        this.closePopUp();
        return;
      }
      this.modalCtrl.create({
        component: CreateMarkerComponent,
      }).then(modalEl => {
        modalEl.present();
        modalEl.onDidDismiss().then(resultData => {
          if (resultData.role === 'confirm') {
            this.showPopUp(
              new Feature(e.lngLat.lng, e.lngLat.lat, resultData.data.name, resultData.data.description, resultData.data.color)
            );
            this.featureCollection.features.push(this.enteredFeature);
            (this.map.getSource('markers_source') as mapboxgl.GeoJSONSource).setData(this.featureCollection);
          }
        });
      });
    });

    /*
    this.map.on('click', (e1) => {
      if (this.wasMarkerClicked) {
        this.wasMarkerClicked = false;
        return;
      }
      const el = document.createElement('div');
      el.className = 'marker';
      el.addEventListener('click', (e2)=>{
        this.wasMarkerClicked = true;
      });
      const marker = new mapboxgl.Marker(el, {draggable: true})
        .setLngLat(e1.lngLat)
        .setPopup(
          new mapboxgl.Popup({offset: 25})
            .setHTML(`<h3>Marker ${this.nMarkers}</h3>`)
        )
        .addTo(this.map);
      this.nMarkers += 1;
    });
    */
}

  showPopUp(feature: Feature) {
    console.log('show popup');
    const html = `<h5>${feature.properties.name}</h5><p>${feature.properties.description}`;
    this.enteredFeature = feature;
    this.popUp.setLngLat(this.enteredFeature.geometry.coordinates).setHTML(html).setOffset(10).addTo(this.map);
  }

  closePopUp() {
    console.log('close popup');
    this.popUp.remove();
    this.enteredFeature = null;
  }
}
