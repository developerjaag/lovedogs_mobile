import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { MessagesService } from '../services/messages/messages.service';
import { Pet } from '../models/pet.model';
import { PetsService } from '../services/pets/pets.service';

@Component({
  selector: 'app-new-pet',
  templateUrl: './new-pet.page.html',
  styleUrls: ['./new-pet.page.scss']
})
export class NewPetPage implements OnInit {
  @Input() uidOwner;
  @Input() nameOwner;

  photo = 'assets/pet.png';
  photoToSend = '';

  formNewPet: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private camera: Camera,
    public alertController: AlertController,
    private messagesService: MessagesService,
    private petsService: PetsService
  ) {

  }

  ngOnInit() {
    this.formNewPet = this.validartorsFormNewPet();
  }

  validartorsFormNewPet() {
    return this.formBuilder.group({
      input_name: ['', [Validators.required]],
      input_size: [''],
      input_genere: [''],
      input_race: [''],
      input_birthday: [''],
      input_note: ['']
    });
  } // end validartorsFormLogin

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
        this.photo = base64Image;
        this.photoToSend = imageData;
      },
      err => {
        // Handle error
        this.messagesService.showAlert('Ups!', 'No se pudo completar el proceso...');
      }
    );
  }

  close() {
    this.modalCtrl.dismiss();
  }

  save() {
    this.messagesService.showLoading();


    const newPet: Pet = {
      name: this.formNewPet.value.input_name,
      race: this.formNewPet.value.input_race,
      birthday: this.formNewPet.value.input_birthday,
      genere: this.formNewPet.value.input_genere,
      size: this.formNewPet.value.input_size,
      note: this.formNewPet.value.input_note
    };

    const task = this.petsService.savePet(newPet, this.uidOwner);
    task.then((data) => {
      newPet.uid = data.id;

      if ( this.photoToSend ) {
        newPet.photo = this.photoToSend;
        this.petsService.savePhoto(newPet.uid, this.photoToSend);
      }

      this.messagesService.closeLoading();
      this.messagesService.presentToast('Mascota guardada!');
      this.modalCtrl.dismiss({
        'newPet': newPet
      });
    }).catch((err) => {
      console.log(JSON.stringify(err));
      this.messagesService.closeLoading();
      this.messagesService.showAlert('Error!', 'Algo salio mal...');
    });
  }
}
