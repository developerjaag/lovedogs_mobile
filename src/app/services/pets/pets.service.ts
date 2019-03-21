import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class PetsService {

  constructor(private afs: AngularFirestore) { }

  listPets(uidOwner) {
    return this.afs.collection("Pets", ref => ref.where('uidOwner', '==', uidOwner)).get().toPromise();
  }
}
