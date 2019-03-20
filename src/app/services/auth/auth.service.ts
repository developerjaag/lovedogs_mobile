import { Injectable } from '@angular/core';
import { NavController } from "@ionic/angular";

import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from "firebase/app";

import { MessagesService } from '../messages/messages.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private readonly afs: AngularFirestore,
    private navCtrl: NavController, private messagesService: MessagesService) { }


 // init lister for user data
 initAuthListener() {
  const me = this;
  me.messagesService.showLoading();
  this.afAuth.authState.subscribe((fbUser: firebase.User) => {
    if (fbUser) {
      // check if is the first time to user enter
      const usuariosRef = me.afs.firestore
        .collection("Users")
        .doc(fbUser.uid);

      usuariosRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
              me.navCtrl.navigateRoot("/home");
          } else {
            me.messagesService.showAlert('Ups!', 'Datos no válidos');
          }
          me.messagesService.closeLoading();
        })
        .catch(function(error) {
          me.messagesService.closeLoading();
          console.log('error en user ref ', error);
          
        });
    }  else {
      me.messagesService.closeLoading();
      this.navCtrl.navigateRoot("/login");
    }
  });
} // end ionitAuthListener

 // return current user
 getUser() {
  return firebase.auth().currentUser;
} // end getUser

 // login with email and password
 loginEmailPassword(email: string, password: string) {
  const me = this;
  this.messagesService.showLoading();
  this.afAuth.auth
    .signInWithEmailAndPassword(email, password)
    .then()
    .catch(function() {
      me.messagesService.closeLoading();
      me.messagesService.showAlert('Ups!', 'Datos no válidos');
    });
} // end loginEmailPassword

} // end class
