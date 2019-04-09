import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { MessagesService } from '../services/messages/messages.service';
import { OwnersService } from '../services/owners/owners.service';
import { PetsService } from '../services/pets/pets.service';


import { debounceTime, startWith, map } from 'rxjs/operators';
import { Owner } from '../models/owner.model';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { Schedule } from '../models/shedule.model';
import { SheduleService } from '../services/shedule/shedule.service';

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

  pets = [];
  andTime = 0;

  ownerSelected: any;

  constructor(
    public formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private messagesService: MessagesService,
    private ownersService: OwnersService,
    private petsService: PetsService,
    private sheduleService: SheduleService
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


  loadPets(owner) {
    this.pets = [];
    this.ownerSelected = owner;
    this.messagesService.showLoading();
    const me = this;
    const task = this.petsService.listPets(owner.uid);
    task
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const data = doc.data();
          data.uid = doc.id;
          me.pets.push(data);
        });
        me.orderPets();
        me.searchField.setValue(owner.name);
        me.messagesService.closeLoading();
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error);
        me.messagesService.closeLoading();
        me.messagesService.showAlert('Error!', 'Algo salió mal...');
      });
  }

  orderPets() {
    this.pets.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }

  validartorsFormNewSchedule() {
    return this.formBuilder.group({
      input_date: ['', [Validators.required]],
      input_pet: ['', [Validators.required]],
      input_category: ['', [Validators.required]]
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  save() {
    this.messagesService.showLoading();
    let toAdd = '60';
    let color = 'blue';
    switch (this.formNewSchedule.value.input_category) {
      case 'completo':
        toAdd = '60';
        color = 'blue';
        break;
      case 'unas':
        toAdd = '15';
        color = 'pink';
        break;
      case 'motilar':
        toAdd = '30';
        color = 'green';
        break;

      default:
        toAdd = '60';
        color = 'blue';
        break;
    }

    const end = moment( this.date ).add(toAdd, 'm').format('YYYY-MM-DDTHH:mm');

    const newSchedule: Schedule = {
      start: this.date,
      end: end,
      title: this.formNewSchedule.value.input_pet.name,
      uidPet: this.formNewSchedule.value.input_pet.uid,
      uidOwner: this.ownerSelected.uid,
      backgroundColor: color
    };

    const task = this.sheduleService.saveSchedule(newSchedule);
    task.then((data) => {
      newSchedule.id = data.id;
      this.messagesService.closeLoading();
      this.messagesService.presentToast('Cita agendada!');
      this.modalCtrl.dismiss({
        'newSchedule': newSchedule
      });
    }).catch((err) => {
      console.log(JSON.stringify(err));
      this.messagesService.closeLoading();
      this.messagesService.showAlert('Error!', 'Algo salio mal...');
    });


  }

}
