import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { map } from 'rxjs/operators';


import { AngularFirestore } from '@angular/fire/firestore';

import { SheduleService } from '../services/shedule/shedule.service';
import { PetsService } from '../services/pets/pets.service';
import { OwnersService } from '../services/owners/owners.service';
import { MessagesService } from '../services/messages/messages.service';

import * as moment from 'moment';


@Component({
  selector: 'app-schedule-detail',
  templateUrl: './schedule-detail.page.html',
  styleUrls: ['./schedule-detail.page.scss'],
})
export class ScheduleDetailPage implements OnInit {

  formDetail: FormGroup;


  @Input() schedule;
  segment = 'Cita';
  uidSchedule: string;
  uidPet: string;
  uidOwner: string;
  scheduleData: any;
  ownerData: any;
  petData: any;
  photos = [];
  oldSchedules = [];


  constructor(
    public formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private sheduleService: SheduleService,
    private messagesService: MessagesService,
    public petsService: PetsService,
    public ownersService: OwnersService,
    private afs: AngularFirestore,
    private camera: Camera,
    public alertController: AlertController,

  ) {
    this.formDetail = this.validartorsFormNewSchedule();
  }


  ngOnInit() {
    this.uidPet = this.schedule.event.extendedProps.uidPet;
    this.uidOwner = this.schedule.event.extendedProps.uidOwner;
    this.uidSchedule = this.schedule.event.id;
    this.getSchedule();
    this.getDataPet();
    this.getDataOwner();
    this.getPhotosShedule();
  }

  validartorsFormNewSchedule() {
    return this.formBuilder.group({
      input_date: ['', [Validators.required]],
      input_category: ['', [Validators.required]]
    });
  }

  get input_dateField() {
    return this.formDetail.get('input_date');
  }
  get input_categoryField() {
    return this.formDetail.get('input_category');
  }

  getSchedule() {
    this.messagesService.showLoading();
    this.sheduleService.getOneSchedule(this.uidSchedule).then((data) => {
      this.scheduleData = data.data();
      this.messagesService.closeLoading();

      console.log(this.scheduleData);
      this.input_dateField.setValue(this.scheduleData.start);
      switch (this.scheduleData.backgroundColor) {
        case 'blue':
          this.input_categoryField.setValue('completo');
          break;
        case 'pink':
          this.input_categoryField.setValue('unas');
          break;
        case 'green':
          this.input_categoryField.setValue('motilar');
          break;
      }
    });
  }

  getDataPet() {
    moment.locale('es');
    this.petsService.petDetail(this.uidPet).then((datos) => {
      const data = datos.data();
      if (data.birthday) {
        const a = moment(data.birthday);
        const b = moment();
        data.ago = a.from(b);
        const temReplace = data.ago;
        data.ago = temReplace.replace('hace', '');
      }
      this.petData = data;
    });
  }

  getDataOwner() {
    this.ownersService.getOwner(this.uidOwner).then((datos) => {
      this.ownerData = datos.data();
    });
  }

  getPhotosShedule() {

    this.afs.collection('PhotosSchedules', ref => ref.where('uidSchedule', '==', this.uidSchedule))
      .snapshotChanges().subscribe(actions => {

        this.photos = [];
        actions.forEach(action => {
          const value: any = action.payload.doc.data();
          const id = action.payload.doc.id;
          // console.log(id, value);

          const p = {
            url: value.photo,
            uidPet: value.uidPet,
            uidSchedule: value.uidSchedule,
            idPhoto: id
          };

          this.photos.push(p);

        });



      });


  }



  async cancelConfirm() {
    const alert = await this.alertController.create({
      header: 'Cancelar!',
      message: 'Cancelar esta cita?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        }, {
          text: 'Si',
          handler: () => {
            this.cancelarCita();
          }
        }
      ]
    });

    await alert.present();
  }


  cancelarCita() {

    this.sheduleService.cancelSchedule(this.uidSchedule);
    this.messagesService.presentToast('Cita cancelada!');
    this.modalCtrl.dismiss({
      'reload': true
    });
  }

  editar() {
    this.messagesService.showLoading();
    let toAdd = '60';
    let color = 'blue';

    const temDate = String(this.input_dateField.value);
    const slideDate = temDate.substring(0, 19);
    const start = moment(slideDate, 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DDTHH:mm');

    switch (this.formDetail.value.input_category) {
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

    const end = moment(start).add(toAdd, 'm').format('YYYY-MM-DDTHH:mm');
    const task = this.sheduleService.editSchedule(this.uidSchedule, start, end, color);

    task.then(() => {
      this.messagesService.closeLoading();
      this.messagesService.presentToast('Cita editada!');
      this.modalCtrl.dismiss({
        'reload': true
      });
    }).catch((err) => {
      console.log(JSON.stringify(err));
      this.messagesService.closeLoading();
      this.messagesService.showAlert('Error!', 'Algo salio mal...');
    });

  }


  async selectOriginPhoto() {
    const alert = await this.alertController.create({
      header: 'Origen',
      message: 'Elige el origen de la foto',
      buttons: [
        {
          text: 'Álbum',
          handler: () => {
            this.chosePhoto(0);
          }
        }, {
          text: 'Cámara',
          handler: () => {
            this.chosePhoto(1);
          }
        }
      ]
    });

    await alert.present();
  }

  chosePhoto(sourceType: number) {

    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: false,
      correctOrientation: true,
      cameraDirection: 1,
      sourceType: sourceType
    };

    this.camera.getPicture(options).then(
      imageData => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        const base64Image = 'data:image/jpeg;base64,' + imageData;
        const name = String(new Date().getUTCMilliseconds());
        this.sheduleService.savePhotoInSchedule(base64Image, this.uidSchedule, this.uidPet, name);
      },
      err => {
        // Handle error
        this.messagesService.showAlert('Ups!', 'No se pudo completar el proceso...');
      }
    );
  }

  uploadPhoto() {

  }

  eliminarFoto(photo) {

    this.sheduleService.deletePhotoSchedule(photo);

  }

  close() {
    this.modalCtrl.dismiss();
  }

}
