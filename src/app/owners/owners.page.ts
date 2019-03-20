import { Component, OnInit } from "@angular/core";
import { ModalController, NavController } from "@ionic/angular";
import { NewOwnerPage } from "../new-owner/new-owner.page";

import { MessagesService } from "../services/messages/messages.service";
import { OwnersService } from "../services/owners/owners.service";

@Component({
  selector: "app-owners",
  templateUrl: "./owners.page.html",
  styleUrls: ["./owners.page.scss"]
})
export class OwnersPage implements OnInit {
  owners: any[] = [];

  constructor(
    public modalController: ModalController,
    public navController: NavController,
    private messagesService: MessagesService,
    private ownersService: OwnersService
  ) {
    this.loadOwners();
  }

  ngOnInit() {}

  async addOwner() {
    const modal = await this.modalController.create({
      component: NewOwnerPage
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.owners.push(data.newOwner);
      this.orderOwners();
    }
  }

  loadOwners() {
    this.owners = [];
    this.messagesService.showLoading();
    const me = this;
    const task = this.ownersService.listOwners();

    task
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          const data = doc.data();
          data.uid = doc.id;
          me.owners.push(data);
        });
        me.orderOwners();
        me.messagesService.closeLoading();
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
        me.messagesService.closeLoading();
        me.messagesService.showAlert("Error!", "Algo salío mal...");
      });
  }

  orderOwners() {
    this.owners.sort(function(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }

  goToPet(uidOwner: string) {
    this.navController.navigateForward("/pets");
  }
}
