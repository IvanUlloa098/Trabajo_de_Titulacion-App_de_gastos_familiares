import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/domain/user';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  User : User = new User();
  ID: any;
  
  constructor( private router: Router, private auth: AuthenticationService ) { }

  ngOnInit() {
  }

  async registro(){
    const user = await this.auth.onRegistro(this.User);
    this.User.role = 'N'
    this.User.description = 'Hola, estoy manejando mis finanzas'
    this.User.active = true
    this.User.id_familia = -1
    this.User.picture = 'default'

    if(user){
      this.ID = this.auth.verificacion();
      console.log(" ES EL ID (EMAIL)",  this.ID);

      this.auth.save(this.User);
      console.log("exito de registro ");
      this.router.navigate(["/login"])

    }else{
      console.log("error en registro")
    }
  }

  regresar(){
    this.router.navigate(["/login"])
  }

}
