import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NewPetPage } from '../new-pet/new-pet.page';

@Component({
  selector: 'app-pets',
  templateUrl: './pets.page.html',
  styleUrls: ['./pets.page.scss'],
})
export class PetsPage implements OnInit {

  constructor( public modalController: ModalController ) { }

  ngOnInit() {
  }

  dateilPet() {

  }

  async addPet() {
    const modal = await this.modalController.create({
      component: NewPetPage
    });
    return await modal.present();
  }

}
