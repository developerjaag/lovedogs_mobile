import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

import { Schedule } from "../../models/shedule.model";

@Injectable({
  providedIn: 'root'
})
export class SheduleService {

  constructor(private afs: AngularFirestore) { }

  saveSchedule(newSchedule: Schedule) {
    return this.afs.collection('Schedule').add({
      tittle: newSchedule.title,
      uidOwner: newSchedule.uidOwner,
      uidPet: newSchedule.uidPet,
      start: newSchedule.start,
      end: newSchedule.end,
      backgroundColor: newSchedule.backgroundColor
    });

  }

}
