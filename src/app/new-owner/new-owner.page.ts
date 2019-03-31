import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Owner } from '../models/owner.model';
import { OwnersService } from '../services/owners/owners.service';
import { MessagesService } from '../services/messages/messages.service';

@Component({
  selector: 'app-new-owner',
  templateUrl: './new-owner.page.html',
  styleUrls: ['./new-owner.page.scss']
})
export class NewOwnerPage implements OnInit {
  formNewOwner: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private ownersService: OwnersService,
    private messagesService: MessagesService,
    private modalCtrl: ModalController
  ) {}

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
    this.messagesService.showLoading();
    const newOwner: Owner = {
      name: this.formNewOwner.value.input_name,
      email: this.formNewOwner.value.input_email,
      cellPhone: this.formNewOwner.value.input_cellPhone,
      phone: this.formNewOwner.value.input_phone,
      address: this.formNewOwner.value.input_address,
      note: this.formNewOwner.value.input_note
    };
    const task = this.ownersService.saveOwner(newOwner);
    task.then((data) => {
      newOwner.uid = data.id;
      this.messagesService.closeLoading();
      this.messagesService.presentToast('Cliente guardado!')
      this.modalCtrl.dismiss({
        'newOwner': newOwner
      });
    }).catch((err) => {
      console.log( JSON.stringify(err) );
      this.messagesService.closeLoading();
      this.messagesService.showAlert('Error!','Algo salio mal...');
    })
  }
}
