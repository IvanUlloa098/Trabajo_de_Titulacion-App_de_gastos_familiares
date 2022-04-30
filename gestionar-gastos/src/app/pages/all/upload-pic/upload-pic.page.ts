import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, take, tap } from 'rxjs/operators';
import {AngularFireStorage,AngularFireUploadTask} from '@angular/fire/compat/storage';
import {AngularFirestore,AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertController } from '@ionic/angular';

export interface FILE {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-upload-pic',
  templateUrl: './upload-pic.page.html',
  styleUrls: ['./upload-pic.page.scss'],
})

export class UploadPicPage implements OnInit {

  ngFireUploadTask: AngularFireUploadTask;

  progressNum: Observable<number>;

  progressSnapshot: Observable<any>;

  fileUploadedPath: Observable<string>;

  files: Observable<FILE[]>;

  FileName: string;
  FileSize: number;

  isImgUploading: boolean;
  isImgUploaded: boolean;

  private ngFirestoreCollection: AngularFirestoreCollection<FILE>;
  private sessionUser: any;
  private aux: any

  private alert: string
  private advice: string
  
  constructor(private alertCtrl: AlertController, private auth: AuthenticationService, private angularFirestore: AngularFirestore,private angularFireStorage: AngularFireStorage) {
    this.isImgUploading = false;
    this.isImgUploaded = false;
    
    this.ngFirestoreCollection = angularFirestore.collection<FILE>('filesCollection');
    this.files = this.ngFirestoreCollection.valueChanges();
  }

  async ngOnInit() { 
    this.sessionUser = this.auth.getUserAuth()
  }

  fileUpload(event: FileList) {
      
    const file = event.item(0)

    if (file.type.split('/')[0] !== 'image') { 
      console.log('File type is not supported!')
      return;
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

  async genericAlert(alert_message, advice){

    const prompt = await this.alertCtrl.create({  
      header: 'Lo sentimos',  
      subHeader: alert_message,
      message: advice,  
      
      buttons: ['Aceptar']  
    }); 

    await prompt.present()

  }

}
