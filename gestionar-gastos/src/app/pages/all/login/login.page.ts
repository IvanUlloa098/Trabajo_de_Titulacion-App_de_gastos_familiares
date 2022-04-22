import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/domain/user';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthenticationService } from 'src/app/service/authentication.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public email: string;
  public password : string;
  User: User = new User();
  user2: any;
  userUpdate: any;
  verifica: any;
  alerta: any;

  constructor(public readonly auth: AngularFireAuth, 
              private AuthenticationService :  AuthenticationService,
              private router : Router) { }

  ngOnInit() {
  }

  async logeo(){
    try {
    console.log("1");
    const user = await this.AuthenticationService.onLogin(this.User);

    if(user){
      this.user2 = this.AuthenticationService.getUsuario(this.User.email);
      this.user2.subscribe(res=> {
        this.AuthenticationService.timeStampLogin(res[0]);
        if (res[0].id_familia == -1) {
          return this.router.navigate(["/createfamily"]);
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

  googleLogin() {
    this.AuthenticationService.googleLogin();
    this.router.navigate(["/tabs"])
  }
  
  emailPasswordLogin() {
      let data = this.AuthenticationService.emailPasswordLogin(this.email, this.password);
      console.log('Response:\n', data);
  }

}
