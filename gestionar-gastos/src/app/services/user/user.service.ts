import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Platform } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { first, switchMap, take, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as firebase from 'firebase/compat/app';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private platform: Platform,
    private googlePlus: GooglePlus,
    private router : Router,
    private angularFireStorage: AngularFireStorage) { }

  async updateUserProfileData(user) {
    return await this.afs.collection("users").doc(user.uid).update({description: user.description, displayName: user.displayName, email: user.email})
  }

  getFamilyMembers(fid) {
    return this.afs.collection("users", ref => ref.where("id_familia", "==", fid).where("active", "==", true)).valueChanges();
  }

  async savePhotoURL(user, path){
    return await this.afs.collection("users").doc(user).update({photoURL: path})
  }

  async deletePreviousPhoto(path) {
    return await this.angularFireStorage.storage.refFromURL(path).delete();

  }

  async changeFamily(user, family) {
    return await this.afs.collection("users").doc(user.uid).update({id_familia: family.id})
  }

  async deleteFamily(user, family) {
    return await this.afs.collection("users").doc(user).update({id_familia: family})
  }

}
