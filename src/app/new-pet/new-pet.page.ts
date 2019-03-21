import { Component, OnInit, Input } from "@angular/core";
import { ModalController, AlertController } from "@ionic/angular";

import { Camera, CameraOptions } from "@ionic-native/camera/ngx";

import { MessagesService } from '../services/messages/messages.service';

@Component({
  selector: "app-new-pet",
  templateUrl: "./new-pet.page.html",
  styleUrls: ["./new-pet.page.scss"]
})
export class NewPetPage implements OnInit {
  @Input() uidOwner;
  @Input() nameOwner;

  photo = "https://api.adorable.io/avatars/285/abott@adorable.png";
  photoToSend = "https://api.adorable.io/avatars/285/abott@adorable.png";

  constructor(
    private modalCtrl: ModalController,
    private camera: Camera,
    public alertController: AlertController,
    private messagesService: MessagesService
  ) {}

  ngOnInit() {}

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
        const base64Image = "data:image/jpeg;base64," + imageData;
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
    this.modalCtrl.dismiss();
  }
}
