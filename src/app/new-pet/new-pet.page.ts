import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

import { Camera, CameraOptions } from "@ionic-native/camera/ngx";


@Component({
  selector: 'app-new-pet',
  templateUrl: './new-pet.page.html',
  styleUrls: ['./new-pet.page.scss'],
})
export class NewPetPage implements OnInit {

  photo = 'https://api.adorable.io/avatars/285/abott@adorable.png';
  photoToSend = 'https://api.adorable.io/avatars/285/abott@adorable.png';

  constructor( private afs: AngularFirestore, private modalCtrl: ModalController, private camera: Camera,  ) { }

  ngOnInit() {
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
        const base64Image = "data:image/jpeg;base64," + imageData;
        this.photo = base64Image;
        this.photoToSend = imageData;
      },
      err => {
        // Handle error
        console.log('Error al tomar la foto');
        
      }
    );

  }

  close() {
    this.modalCtrl.dismiss();
  }

  save() {
    this.modalCtrl.dismiss();
  }
}
