import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-marker',
  templateUrl: './create-marker.component.html',
  styleUrls: ['./create-marker.component.scss'],
})
export class CreateMarkerComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  onSubmit() {
    this.modalCtrl.dismiss({
      name: this.form.value.name,
      description: this.form.value.description,
      color: this.form.value.color,
    }, 'confirm');
  }

  onCancel() {
    this.modalCtrl.dismiss( {}, 'cancel');
  }

}
