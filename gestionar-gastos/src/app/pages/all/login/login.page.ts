import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/domain/user';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthenticationService } from 'src/app/service/authentication.service';

import { NavigationExtras, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private readonly onDestroy = new Subject<void>();

  public email: string;
  public password : string;
  User: User = new User();
  user2: any;
  userUpdate: any;
  verifica: any;
  alerta: any;
  aux:any

  constructor(public readonly auth: AngularFireAuth, 
              private AuthenticationService :  AuthenticationService,
              private router : Router) { }

  ngOnInit() {
    this.onDestroy.next();
  }

  async logeo(){
    try {
      
      const user = await this.AuthenticationService.onLogin(this.User);

      if(user){
        this.user2 = await this.AuthenticationService.getUsuario(this.User.email);
        await this.user2.pipe(take(1)).subscribe(res=> {
          this.AuthenticationService.timeStampLogin(res[0]);
          this.aux = res[0]
          
          if (res[0].id_familia === "-1") {
            let params: NavigationExtras = {
              queryParams: {
                user:res[0]
              }
            }

            return this.router.navigate(["/createfamily"], params);
          } else {
            return this.router.navigate(["/tabs"]);
          }
          
        })

      }else{
        console.log("error en el loggeo")
        this.alerta = "Datos incorrectos"
      }
    } catch (error) {
        
    }
    
  }

  async googleLogin() {
    
    this.user2 = await this.AuthenticationService.googleLogin()
    this.user2 = await this.AuthenticationService.getUsuario(this.user2.email)

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

    

  }
  
  emailPasswordLogin() {
      let data = this.AuthenticationService.emailPasswordLogin(this.email, this.password);
      console.log('Response:\n', data);
  }

}
