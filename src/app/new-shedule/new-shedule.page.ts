import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { MessagesService } from '../services/messages/messages.service';
import { OwnersService } from '../services/owners/owners.service';

import { debounceTime, startWith, map, tap } from 'rxjs/operators';
import { Owner } from '../models/owner.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-shedule',
  templateUrl: './new-shedule.page.html',
  styleUrls: ['./new-shedule.page.scss'],
})
export class NewShedulePage implements OnInit {

  @Input() date: number;

  formNewSchedule: FormGroup;

  owners: any[] = [];
  ownersOptions$: Observable<Owner[]>;
  searchField = new FormControl('');
  showList = false;

  constructor(
    public formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private messagesService: MessagesService,
    private ownersService: OwnersService,
  ) {
    this.loadOwners();
    this.formNewSchedule = this.validartorsFormNewSchedule();
  }

  ngOnInit() {
    this.formNewSchedule.get('input_date').setValue(this.date);
    this.searchField.valueChanges.subscribe(value => {
      if (value.length > 1) {
        this.showList = true;
      } else {
        this.showList = false;
      }
    });
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


  loadPets(uidOwner) {

  }

  validartorsFormNewSchedule() {
    return this.formBuilder.group({
      input_date: ['', [Validators.required]]
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  save() {
    console.log('fehca ', this.formNewSchedule.value.input_date);

  }

}
