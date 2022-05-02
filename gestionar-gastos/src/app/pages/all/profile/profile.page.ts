import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';


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
  
  private aux: any

  name : string;
  email: String;
  description : Boolean;
  photo : String;
  id : string;

  alert: string
  advice: string

  constructor(private auth: AuthenticationService,
              private loadingController: LoadingController,
              private alertCtrl: AlertController,
              private router : Router) { }

  async ngOnInit() {

    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => {

        try {

          this.auth.getUserAuth().pipe(take(1)).subscribe(async user =>{

            this.aux = await this.auth.getUsuario(user.email)
    
            await this.aux.pipe(take(1)).subscribe( res=> {
              this.name = res[0].displayName;
              this.email = res[0].email;
              this.photo = res[0].photoURL;
              this.description = res[0].description
              this.id = res[0].uid;
  
              a.dismiss().then(() => console.log('abort presenting'));
            })
            
          })
          
        } catch (error) {
          console.log('ERROR al cargar datos')
          this.alert = "Los Datos ingresados son incorrectos"
          this.advice = 'Por favor, ingréselos de nuevo'
  
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