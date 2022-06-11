import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/domain/user';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthenticationService } from 'src/app/services/authentication.service';

import { NavigationExtras, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private readonly onDestroy = new Subject<void>()

  public email: string
  public password : string
  private sessionUser : any

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
              private alertCtrl: AlertController,
              private loadingController: LoadingController,
              public menuCtrl: MenuController,
              private userService: UserService) { 
                this.menuCtrl.enable(false)
              }

  async ngOnInit() {

    this.onDestroy.next();

    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => {

        try {
          await this.AuthenticationService.getUserAuth().pipe(take(1)).subscribe(async user =>{

            try {

              this.sessionUser = await this.AuthenticationService.getUsuario(user.email)
  
              await this.sessionUser.pipe(take(1)).subscribe(async res=> {
                if (res[0].id_familia !== "-1") {
                  this.router.navigate(["/home"])
                } else {
                  this.router.navigate(["/createfamily"])
                }
                
              })
              
            } catch (error) {
              console.log("NO USER LOGGED IN")
            } finally {
              a.dismiss().then(() => console.log('abort presenting'));
            }
            
          })
        } catch (error) {
          console.log("NO USER LOGGED IN")
        } finally {
          a.dismiss().then(() => console.log('abort presenting'));
        }


      })
    })
    
  }

  async logeo(){

    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => {

        try {
          const user = await this.AuthenticationService.onLogin(this.User);
    
          if(this.User.email && this.User.password){
            this.user2 = await this.AuthenticationService.getUsuario(this.User.email);

            try {

              await this.user2.pipe(take(1)).subscribe(res=> {
                this.AuthenticationService.timeStampLogin(res[0]);
                this.aux = res[0]
                
                if (res[0].id_familia === "-1") {
                  a.dismiss().then(() => console.log('abort presenting'));
                  this.router.navigate(["/createfamily"]);
                } else {
                  a.dismiss().then(() => console.log('abort presenting'));
                  this.router.navigate(["/home"]);
                }
                
              })
              
            } catch (error) {
              
              this.alert = "Ocurrió un error con el inicio de sesión"
              this.advice = 'Por favor, inténtelo de nuevo'
        
              a.dismiss().then(() => console.log('abort presenting'));
              this.genericAlert(this.alert, this.advice)

            }
    
          }else{
            console.log("error en el loggeo")
            this.alert = "Los Datos ingresados son incorrectos"
            this.advice = 'Por favor, ingréselos de nuevo'
    
            a.dismiss().then(() => console.log('abort presenting'));
            this.genericAlert(this.alert, this.advice)
            
          }
        } catch (error) {
          this.alert = "Ocurrió un error con el inicio de sesión"
          this.advice = 'Por favor, inténtelo de nuevo'
    
          a.dismiss().then(() => console.log('abort presenting'));
          this.genericAlert(this.alert, this.advice)
        }

      })
    })
    
  }

  async googleLogin() {

    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => {

        try {

          this.user2 = await this.AuthenticationService.googleLogin()
    
          await this.AuthenticationService.updateUserData(this.user2, 'google')
          this.user2 = await this.AuthenticationService.getUsuario(this.user2._delegate.email)
    
          await this.user2.pipe(take(1)).subscribe(res=> {
            this.aux = res[0]
          
            if (this.aux.id_familia === "-1") {    
              a.dismiss().then(() => console.log('abort presenting'));
              this.router.navigate(["/createfamily"]);

            } else {
              a.dismiss().then(() => console.log('abort presenting'));
              this.router.navigate(["/home"]);

            }
      
          })
          
        } catch (error) {
          this.alert = "Ocurrió un error inesperado en con el inicio de sesión"
          this.advice = 'Por favor, inténtelo de nuevo'
          
          a.dismiss().then(() => console.log('abort presenting'));
          this.genericAlert(this.alert, this.advice)
        }

      })
    })

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

  async dismiss() {
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

}
