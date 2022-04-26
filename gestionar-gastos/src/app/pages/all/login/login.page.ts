import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/domain/user';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthenticationService } from 'src/app/services/authentication.service';

import { NavigationExtras, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private readonly onDestroy = new Subject<void>()

  public email: string
  public password : string
  User: User = new User()
  user2: any
  userUpdate: any
  verifica: any
  alert: string
  advice: string
  aux:any

  constructor(public readonly auth: AngularFireAuth, 
              private AuthenticationService :  AuthenticationService,
              private router : Router,
              private alertCtrl: AlertController) { }

  ngOnInit() {
    this.onDestroy.next();
  }

  async logeo(){
    try {
      
      const user = await this.AuthenticationService.onLogin(this.User);

      if(this.User.email && this.User.password){
        this.user2 = await this.AuthenticationService.getUsuario(this.User.email);
        await this.user2.pipe(take(1)).subscribe(res=> {
          this.AuthenticationService.timeStampLogin(res[0]);
          this.aux = res[0]
          
          if (res[0].id_familia === "-1") {

            return this.router.navigate(["/createfamily"]);
          } else {
            return this.router.navigate(["/tabs"]);
          }
          
        })

      }else{
        console.log("error en el loggeo")
        this.alert = "Los Datos ingresados son incorrectos"
        this.advice = 'Por favor, ingréselos de nuevo'

        this.genericAlert(this.alert, this.advice)
        
      }
    } catch (error) {
      this.alert = "Ocurrió un error con el inicio de sesión"
      this.advice = 'Por favor, inténtelo de nuevo'

      this.genericAlert(this.alert, this.advice)
    }
    
  }

  async googleLogin() {

    try {

      this.user2 = await this.AuthenticationService.googleLogin()

      await this.AuthenticationService.updateUserData(this.user2, 'google')
      this.user2 = await this.AuthenticationService.getUsuario(this.user2._delegate.email)

      await this.user2.pipe(take(1)).subscribe(res=> {
        this.aux = res[0]
      
        if (this.aux.id_familia === "-1") {
          let params: NavigationExtras = {
            queryParams: {
              user:this.aux.email
            }
          }
  
          return this.router.navigate(["/createfamily"], params);
        } else {
          return this.router.navigate(["/tabs"]);
        }
  
      })
      
    } catch (error) {
      this.alert = "Ocurrió un error inesperado en con el inicio de sesión"
      this.advice = 'Por favor, inténtelo de nuevo'
      console.log(error)
      this.genericAlert(this.alert, this.advice)
    }

  }
  
  emailPasswordLogin() {
      let data = this.AuthenticationService.emailPasswordLogin(this.email, this.password);
      console.log('Response:\n', data);
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
