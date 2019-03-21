import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { NewPetPage } from "../new-pet/new-pet.page";

import { MessagesService } from "../services/messages/messages.service";
import { PetsService } from "../services/pets/pets.service";

@Component({
  selector: "app-pets",
  templateUrl: "./pets.page.html",
  styleUrls: ["./pets.page.scss"]
})
export class PetsPage implements OnInit {
  ownerName = "";
  uidOwner = "";
  pets = [];
  constructor(
    public modalController: ModalController,
    private route: ActivatedRoute,
    private messagesService: MessagesService,
    private petsService: PetsService
  ) {}

  ngOnInit() {
    this.ownerName = this.route.snapshot.paramMap.get("name");
    this.uidOwner = this.route.snapshot.paramMap.get("id");
    this.getPets();
  }

  getPets() {
    this.pets = [];
    this.messagesService.showLoading();
    const me = this;
    const task = this.petsService.listPets(this.uidOwner);
    task
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          const data = doc.data();
          data.uid = doc.id;
          me.pets.push(data);
        });
        me.orderPets();
        me.messagesService.closeLoading();
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
        me.messagesService.closeLoading();
        me.messagesService.showAlert("Error!", "Algo salío mal...");
      });
  }

  orderPets() {
    this.pets.sort(function(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }

  dateilPet() {}

  async addPet() {
    const modal = await this.modalController.create({
      component: NewPetPage,
      componentProps: {
        'uidOwner': this.uidOwner,
        'nameOwner': this.ownerName
      }
    });
    return await modal.present();
  }
}
