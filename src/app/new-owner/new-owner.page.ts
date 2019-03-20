import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Owner } from '../models/owner.model';
import { OwnersService } from '../services/owners/owners.service';


@Component({
  selector: 'app-new-owner',
  templateUrl: './new-owner.page.html',
  styleUrls: ['./new-owner.page.scss'],
})
export class NewOwnerPage implements OnInit {

  formNewOwner: FormGroup;

  constructor( public formBuilder: FormBuilder,  private ownersService: OwnersService,
    private afs: AngularFirestore, private modalCtrl: ModalController ) { }

  ngOnInit() {
    this.formNewOwner = this.validartorsFormNewOwner();
  }

  validartorsFormNewOwner() {
    return this.formBuilder.group({
      input_name: ['', [Validators.required]],
      input_email: ['', [Validators.email]],
      input_cellPhone: [''],
      input_phone: [''],
      input_address: [''],
      input_note: ['']
    });
  } // end validartorsFormLogin

  close() {
    this.modalCtrl.dismiss();
  }

  save() {
    const newOwner: Owner = {
      name: 'test'
    }
    this.ownersService.saveOwner(newOwner);
    this.modalCtrl.dismiss();
  }

}
