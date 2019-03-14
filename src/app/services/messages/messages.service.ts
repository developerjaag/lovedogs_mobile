import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  loading : any;

  constructor(public alertController: AlertController, public loadingController: LoadingController) { }

  async showLoading() {

    this.loading = await this.loadingController.create({
      message: 'Un momento...'
    });
    await this.loading.present();

  } // end showLoading

  closeLoading() {

    if( this.loading ) {
      this.loading.dismiss()
    }
    
  }

  async showAlert(header, message, subHeader?) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
