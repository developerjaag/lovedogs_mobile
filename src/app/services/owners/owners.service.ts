import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Owner } from '../../models/owner.model';

@Injectable({
  providedIn: 'root'
})
export class OwnersService {

  constructor(private afs: AngularFirestore) { }

  saveOwner(newOwner: Owner) {

    return this.afs.collection('Owners').add({

      name: newOwner.name,
      email: newOwner.email,
      phone: newOwner.phone,
      cellPhone: newOwner.cellPhone,
      address: newOwner.address,
      note: newOwner.note

    });

  }

  listOwners() {
    return this.afs.collection('Owners').get().toPromise();
  }

  getOwner(uid: string) {
    return this.afs.collection('Owners').doc(uid).get().toPromise();
  }

  editOwner() {

  }

}
