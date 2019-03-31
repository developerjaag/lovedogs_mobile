import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

import { Pet } from '../../models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class PetsService {

  constructor(private afs: AngularFirestore) { }

  listPets(uidOwner) {
    return this.afs.collection('Pets', ref => ref.where('uidOwner', '==', uidOwner)).get().toPromise();
  }

  savePet(newPet: Pet, uidOwner: string) {

    return this.afs.collection('Pets').add({
      name: newPet.name,
      race: newPet.race,
      birthday: newPet.birthday,
      genere: newPet.genere,
      size: newPet.size,
      note: newPet.note,
      uidOwner: uidOwner
    });
  }

  savePhoto(petUid: string, photo: string) {
    const me = this;

    const fotoRef = firebase
      .storage()
      .ref('Avatars/' + petUid + '/profile.png')
      .putString(photo, 'base64');

    fotoRef.on(
      'state_changed',
      function (snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      },
      function (error) {
        // Handle unsuccessful uploads
      },
      function () {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        fotoRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          // save on firestore
          me.afs.firestore
            .collection('/Pets/')
            .doc(petUid)
            .update({
              photo: downloadURL
            });
        });
      }
    );

  } // end savePhoto


  updatePet(pet: Pet) {

  }

}
