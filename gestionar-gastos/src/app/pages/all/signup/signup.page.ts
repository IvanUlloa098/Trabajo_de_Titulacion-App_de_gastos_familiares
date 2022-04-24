import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { throws } from 'assert';
import { User } from 'src/app/domain/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  User : User = new User()
  ID: any

  alert: string
  advice: string
  
  constructor( private router: Router, private auth: AuthenticationService, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  async registro(){
    
    const user = await this.auth.onRegistro(this.User);
    this.User.role = 'N'
    this.User.description = 'Hola, estoy manejando mis finanzas'
    this.User.active = true
    this.User.id_familia = "-1"
    this.User.photoURL = 'https://firebasestorage.googleapis.com/v0/b/gestionar-gastos.appspot.com/o/default.png?alt=media&token=e8ff50d0-3177-4b40-acf6-d29127a6baf3'
    this.User.createdAt = new Date()
    this.User.lastLogin = new Date()
    this.User.provider = 'gestion-gastos'

    try {

      if(user){
        this.ID = this.auth.verificacion();
        console.log(" ES EL ID (EMAIL)",  this.ID);
  
        this.auth.save(this.User);
        console.log("exito de registro ");

        this.alert = "Se ha registrado el usuario con éxito"
        this.advice = '¡Comienze a gestionar su dinero!'
        this.genericAlert(this.alert, this.advice)

        this.router.navigate(["/login"])
  
      }else{
        console.log("error en registro")
        this.alert = "Ocurrió un error inesperado en con el registro"
        this.advice = 'Por favor, inténtelo de nuevo'
  
        this.genericAlert(this.alert, this.advice)
      }

    } catch (error) {
      this.alert = "Ocurrió un error inesperado en con el registro"
      this.advice = 'Por favor, inténtelo de nuevo'

      this.genericAlert(this.alert, this.advice)
    }
    

  }

  regresar(){
    this.router.navigate(["/login"])
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
