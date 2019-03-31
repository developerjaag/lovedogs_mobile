import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { NewOwnerPage } from '../new-owner/new-owner.page';
import { FormControl } from '@angular/forms';
import { MessagesService } from '../services/messages/messages.service';
import { OwnersService } from '../services/owners/owners.service';

import { debounceTime, startWith, map } from 'rxjs/operators';
import { Owner } from '../models/owner.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-owners',
  templateUrl: './owners.page.html',
  styleUrls: ['./owners.page.scss']
})
export class OwnersPage implements OnInit {

  owners: any[] = [];
  ownersOptions$: Observable<Owner[]>;
  searchField = new FormControl('');

  constructor(
    public modalController: ModalController,
    public navController: NavController,
    private messagesService: MessagesService,
    private ownersService: OwnersService
  ) {
    this.loadOwners();
  }

  ngOnInit() {
  }

  listenFilter() {
    this.ownersOptions$ = this.searchField.valueChanges.pipe(
      debounceTime(350),
      startWith<string>(''),
      map(value => value ? this.filterOwner(value) : this.owners.slice())
    );
  }

  private filterOwner(value: string) {
    const filterValue = value.toLowerCase().trim();
    return this.owners.filter(owner => owner.name.toLowerCase().includes(filterValue));
  }

  async addOwner() {
    const modal = await this.modalController.create({
      component: NewOwnerPage
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.owners.push(data.newOwner);
      this.orderOwners();
      this.searchField.setValue(data.newOwner.name);
    }
  }

  loadOwners() {
    this.owners = [];
    this.messagesService.showLoading();
    const me = this;
    const task = this.ownersService.listOwners();

    task
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const data = doc.data();
          data.uid = doc.id;
          me.owners.push(data);
        });
        me.orderOwners();
        me.listenFilter();
        me.messagesService.closeLoading();
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error);
        me.messagesService.closeLoading();
        me.messagesService.showAlert('Error!', 'Algo salió mal...');
      });
  }

  orderOwners() {
    this.owners.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }

  goToPet(uidOwner: string, name: string) {
    this.navController.navigateForward('/pets/' + uidOwner + '/' + name);
  }
}
