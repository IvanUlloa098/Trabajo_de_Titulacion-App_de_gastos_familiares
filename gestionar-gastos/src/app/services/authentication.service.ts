import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Platform } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { first, switchMap, take, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as firebase from 'firebase/compat/app';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { User } from '../domain/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  public user: Observable<any>;
  public estaLogeado: any = false;
  constructor( private afAuth: AngularFireAuth,
               private afs: AngularFirestore,
               private platform: Platform,
               private googlePlus: GooglePlus,
               private router : Router) {

                afAuth.authState.
                subscribe(user => (this.estaLogeado = user));

    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user){
          return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  //iniciar sesion
  async onLogin (user: User) {
    try{
      this.afs.collection("users", ref => ref.where("email", "==", user.email).where("password", "==", user.password)).doc().valueChanges();
      return await this.afAuth.signInWithEmailAndPassword( user.email, user.password)
    }catch(error) {
      console.log( 'error en LOGIN' , error );
    }
  }

  async timeStampLogin (user) {
    try{
      return await this.afs.collection("users").doc(user.uid).update({lastLogin: new Date()})
    }catch(error) {
      console.log( 'error en TIMESTAMP' , error );
    }
  }

  async changeFamily(user, family) {
    console.log('HERE')
    try{
      return await this.afs.collection("users").doc(user.uid).update({id_familia: family.id})
    }catch(error) {
      console.log( 'error en CHANGEFAMILY' , error );
    }
  }

  async modifyRole(user, role) {
    try{
      return await this.afs.collection("users").doc(user.uid).update({role: role})
    }catch(error) {
      console.log( 'error en CHANGEFAMILY' , error );
    }
  }

  async createFamily(family) {
    try{
      const refContactos = this.afs.collection("families")

      if(family.id == null){
        family.id = this.afs.createId()
      }
      
      refContactos.doc(family.id).set(Object.assign({}, family))
      return await this.getFamily(family.id)

    }catch(error) {
      console.log( 'error en CHANGEFAMILY' , error )
    }
  }

  async getFamily(id) {
    return await this.afs.collection("families", ref => ref.where("id", "==", id)).valueChanges();
    
  }

  async onRegistro (user: User){
    try{
      return await this.afAuth.createUserWithEmailAndPassword( user.email, user.password);

    } catch(error){
      console.log("error en REGISTRO  " , error);
      console.error('Error' + JSON.stringify(error));
    }
  }

  emailV: any;
  //verificacion quien inicio sesion
  async verificacion(){
    try{
      //console.log(" VER " , (await this.afAuth.currentUser).uid) ;
      this.emailV = (await this.afAuth.currentUser).email;
      return this.emailV;
      
    }catch(error){
      console.log("error en envio de verificacion")
    }
    
  }

  // cierra sesion
  salirCuenta() {
    console.log("Logout");

    this.afAuth.signOut().then( auth => { this.router.navigate(['/login']) });
  }

  // guarda usuario
  async save(user: User){
    const refContactos = this.afs.collection("users");

    if(user.uid == null){
      user.uid = this.afs.createId();
    }
    refContactos.doc(user.uid).set(Object.assign({}, user));

  }


  async getUsuario(email: any) {
    return await this.afs.collection("users", ref => ref.where("email", "==", email)).valueChanges()

  }

  async getCurrentUser(): Promise<any> {
    return this.user.pipe(first()).toPromise();
  }

  async signupUser(name: string, email: string, password: string): Promise<any> {
    try {
      await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = await this.afAuth.currentUser;

      return await user.updateProfile({
        displayName: name,
        photoURL: 'https://goo.gl/7kz9qG'
      });

    } catch (error) {
      console.error('Error' + JSON.stringify(error));
      return error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      return error;
    }
  }

  //GOOGLE
  async googleLogin() {
    if (this.platform.is('cordova')) {
      return await this.nativeGoogleLogin();
    } else {
      return await this.webGoogleLogin();
    }
  }

  async nativeGoogleLogin()  {
    try {
      const gplusUser: any = await this.googlePlus.login({
        webClientId: environment.googleWebClientId,
        offline: true
      });

      const googleCredential = firebase.default.auth.GoogleAuthProvider.credential(gplusUser.idToken);
      const firebaseUser = await firebase.default.auth().signInWithCredential(googleCredential);
      console.log(JSON.stringify(firebaseUser.user));
      this.updateUserData(firebaseUser.user, 'google');
      return await JSON.parse(JSON.stringify(firebaseUser.user))
      
    } catch (error) {
      console.error('Error: Login Google - Native' + JSON.stringify(error));
      return error;
    }
  }

  async webGoogleLogin() {
    try {
      const provider = new firebase.default.auth.GoogleAuthProvider();
      const credential = await this.afAuth.signInWithPopup(provider);
      this.updateUserData(credential.user, 'google');
      return await JSON.parse(JSON.stringify(credential.user))
    } catch (error) {
      console.error('Error: Login Google - Web' + JSON.stringify(error));
      return error;
    }
  }

  // EMAIL AND PASSWORD
  async emailPasswordLogin(email: string, password: string): Promise<void> {
    try {
      const emailCredential = firebase.default.auth.EmailAuthProvider.credential(email, password);
      const firebaseUser = await firebase.default.auth().signInWithCredential(emailCredential);
      return await this.updateUserData(firebaseUser.user, 'email');
    } catch (error) {
      return error;
    }
  }

  // ---------
  userExists(email: string) {
    console.log('userExists' + email);
    return this.afs
    .collection('users', ref => ref.where('email', '==', email))
    .valueChanges()
    .pipe(first())
    .toPromise();
  }

  // Guardar los datos del usuario en Firestore
  async updateUserData(usertemp: any, provider: any){
    console.log('update' + JSON.stringify(usertemp));
    const doc: any = await this.userExists(usertemp.email);
    console.log('doc' + JSON.stringify(doc));

    let data: any;
    let user: any = JSON.parse(JSON.stringify(usertemp));

    console.log('doc' + JSON.stringify(doc));

    if (doc == null || doc == ''  ) {
      // Crear Cuenta
      data = {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || '7',
        photoURL: user.photoURL || 'https://goo.gl/7kz9qG',
        provider: provider,
        lastLogin: new Date(Number(user.lastLoginAt)) || new Date(),
        createdAt: new Date(Number(user.createdAt)) || new Date(),
        role: 'N',
        description: 'Hola, estoy manejando mis finanzas',
        id_familia: "-1",
        active: true,
        password: "N"
      };
    } else if (doc.active == false){
      throw { error_code: 999, error_message: 'Acceso denegado, servicio deshabilitado, consulte con el administrador.' }; 
    } else {
      // Actualizar cuenta
      data = {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || '',
        photoURL: user.photoURL || 'https://goo.gl/7kz9qG',
        provider: provider,
        lastLogin: new Date(Number(user.lastLoginAt)) || new Date()
      };
    }

    console.log('data', JSON.stringify(data));
    const userRef = this.afs.collection<any>('users');

    return userRef.doc(`${user.uid}`).set(data, { merge: true});
  }

  getUserAuth(){
    return this.afAuth.authState;
  }

}