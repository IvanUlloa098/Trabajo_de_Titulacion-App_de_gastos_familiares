import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, take, tap } from 'rxjs/operators';
import {AngularFireStorage,AngularFireUploadTask} from '@angular/fire/compat/storage';
import {AngularFirestore,AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { User } from 'src/app/domain/user';


export interface FILE {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})

export class ProfilePage implements OnInit{

  ngFireUploadTask: AngularFireUploadTask;

  progressNum: Observable<number>;

  progressSnapshot: Observable<any>;

  fileUploadedPath: Observable<string>;

  files: Observable<FILE[]>;

  FileName: string;
  FileSize: number;

  isImgUploading: boolean;
  isImgUploaded: boolean;
  isUploadingEnable: boolean

  private ngFirestoreCollection: AngularFirestoreCollection<FILE>;
  private sessionUser: any;
  private aux: any

  name : any;
  email: any;
  description : any;
  photo : String;
  id : any;
  role: String

  alert: string
  advice: string

  googleProvider: boolean = false
  UserUpdate : User = new User()

  constructor(private auth: AuthenticationService,
              private loadingController: LoadingController,
              private alertCtrl: AlertController,
              private router : Router,
              private angularFirestore: AngularFirestore,
              private angularFireStorage: AngularFireStorage) { 

                this.isImgUploading = false;
                this.isImgUploaded = false;
                
                this.ngFirestoreCollection = angularFirestore.collection<FILE>('filesCollection');
                this.files = this.ngFirestoreCollection.valueChanges();

              }

  async ngOnInit() {

    this.sessionUser = await this.auth.getUserAuth()

    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => {

        try {

          await this.sessionUser.pipe(take(1)).subscribe(async user =>{

            this.aux = await this.auth.getUsuario(user.email)
    
            await this.aux.pipe(take(1)).subscribe( res=> {
              this.name = res[0].displayName
              this.email = res[0].email
              this.photo = res[0].photoURL
              this.description = res[0].description
              this.id = res[0].uid

              if(res[0].role === 'A') {
                this.role = 'Jefe de familia'
              } else {
                this.role = 'Miembro de familia'
              }

              if(res[0].provider === 'google') {
                this.googleProvider = true
              }
  
              a.dismiss().then(() => console.log('abort presenting'));
            })
            
          })
          
        } catch (error) {
          console.log('ERROR al cargar datos')
          this.alert = "Ocurrió un error al cargar sus datos"
          this.advice = 'Por favor, inténtelo de nuevo'
  
          a.dismiss().then(() => console.log('abort presenting'));
          this.genericAlert(this.alert, this.advice)
        }

      })
    })
    
  }

  Onlogout(){
    this.auth.salirCuenta();
  }

  async dismiss() {
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

  fileUpload(event: FileList) {
      
    const file = event.item(0)

    if (file.type.split('/')[0] !== 'image') { 
      console.log('File type is not supported!')
      this.alert = "Ocurrió un error al subir la imagen"
      this.advice = 'Por favor, inténtelo de nuevo'

      this.genericAlert(this.alert, this.advice)
      return
    }

    this.isImgUploading = true;
    this.isImgUploaded = false;

    this.FileName = file.name;

    const fileStoragePath = `profilePic/${new Date().getTime()}_${file.name}`;

    const imageRef = this.angularFireStorage.ref(fileStoragePath);

    this.ngFireUploadTask = this.angularFireStorage.upload(fileStoragePath, file);

    this.progressNum = this.ngFireUploadTask.percentageChanges();

    try {
      
      this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(
        finalize(async () => {
          this.fileUploadedPath = imageRef.getDownloadURL();
          
          this.fileUploadedPath.subscribe(async resp=>{
  
            await this.auth.getUserAuth().pipe(take(1)).subscribe(async user =>{
              this.aux = await this.auth.getUsuario(user.email)
              
              await this.aux.pipe(take(1)).subscribe(res=>{
                this.auth.savePhotoURL(res[0].uid, resp)
              })
            })
            console.log(resp)
            
            this.isImgUploading = false;
            this.isImgUploaded = true;

            this.router.navigate(["/profile"])
            
          },error => {
            console.log(error);
          })
        }),
        tap(snap => {
            this.FileSize = snap.totalBytes;
        })
      )

    } catch (error) {
      console.log('ERROR: No se pudo subir la imagen')
      this.alert = "Ocurrió un error al subir la imagen"
      this.advice = 'Por favor, inténtelo de nuevo'

      this.genericAlert(this.alert, this.advice)
    }
    
  }

  async onUpdate() {

    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => {
        
        try {

          if(this.email !== "" && this.name !== "" && this.description !== "") {
            this.UserUpdate.uid = this.id
            this.UserUpdate.email = this.email
            this.UserUpdate.displayName = this.name
            this.UserUpdate.description = this.description

            const validation =this.validateEmail(this.email)

            if(validation) {
              this.auth.updateUserProfileData(this.UserUpdate)
            } else {
              console.log('ERROR: No se pudo actualizar')
              this.alert = "El e-mail ingresado no es correcto"
              this.advice = 'Por favor, revise la sintaxis del correo electrónico'
        
              this.genericAlert(this.alert, this.advice)
            }
          } else{
            console.log('ERROR: No se pudo actualizar')
            this.alert = "Información vacía"
            this.advice = 'Por favor, verifique que exista información en todos los campos'
      
            this.genericAlert(this.alert, this.advice)
          }
          
        } catch (error) {
          this.alert = "Ocurrió un error al actualizar sus datos"
          this.advice = 'Por favor, inténtelo de nuevo'
      
          this.genericAlert(this.alert, this.advice)

        } finally {
          a.dismiss().then(() => console.log('abort presenting'));
        }

      })
    })

  }

  validateEmail(email) {
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
   }

  async genericAlert(alert_message, advice){

    const prompt = await this.alertCtrl.create({  
      header: 'Lo sentimos',  
      subHeader: alert_message,
      message: advice,  
      
      buttons: [
        {  
          text: 'Accept',  
          handler: async data => {  
            this.router.navigate(["/profile"]); 
          }  
        }  
      ]  
    }); 

    await prompt.present()

  }

}