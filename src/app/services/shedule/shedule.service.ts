import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import * as firebase from 'firebase';

import { Schedule } from '../../models/shedule.model';

@Injectable({
  providedIn: 'root'
})
export class SheduleService {

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  saveSchedule(newSchedule: Schedule) {
    return this.afs.collection('Schedule').add({
      tittle: newSchedule.title,
      uidOwner: newSchedule.uidOwner,
      uidPet: newSchedule.uidPet,
      start: newSchedule.start,
      end: newSchedule.end,
      backgroundColor: newSchedule.backgroundColor,
      state: true
    });

  }

  savePhotoInSchedule(photo: string, uidSchedule: string, uidPet: string, name: string) {

    const photoRef = firebase.storage().ref(`Photos/Schedule/${uidSchedule}/${name}.png`).putString(photo, 'base64');

    photoRef.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        photoRef.snapshot.ref.getDownloadURL().then((downloadURL) => {
          // save on firestore
          this.afs.firestore
            .collection(`/PhotosSchedules/`)
            .add({
              photo: downloadURL,
              uidSchedule: uidSchedule,
              uidPet: uidPet
            });
        });
      }
    );

  }

  cancelSchedule(uidSchedule) {
    this.afs.firestore
      .collection('Schedule')
      .doc(uidSchedule)
      .update({
        state: false
      });
  }

  editSchedule(uid, inicio, fin, categoria) {
    return this.afs.firestore
      .collection('Schedule')
      .doc(uid)
      .update({
        backgroundColor: categoria,
        start: inicio,
        end: fin
      });
  }

  getSchedules() {
    return this.afs.collection('Schedule', ref => ref.where('state', '==', true)).get().toPromise();
  }

  getOneSchedule(uid) {
    return this.afs.collection('Schedule').doc(uid).get().toPromise();
  }

  deletePhotoSchedule(photo) {

    this.afs.collection('PhotosSchedules').doc(photo.idPhoto).delete();

     this.storage.storage.refFromURL(photo.url).delete();
  }

}
