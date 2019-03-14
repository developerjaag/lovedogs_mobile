import { Component, OnInit } from '@angular/core';
import {  ModalController } from '@ionic/angular';
import { NewOwnerPage } from '../new-owner/new-owner.page';

@Component({
  selector: 'app-owners',
  templateUrl: './owners.page.html',
  styleUrls: ['./owners.page.scss'],
})
export class OwnersPage implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  async addOwner() {
  
    const modal = await this.modalController.create({
      component: NewOwnerPage
    });
    return await modal.present();
  }



}
