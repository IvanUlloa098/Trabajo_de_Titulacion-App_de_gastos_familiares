import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Familia } from 'src/app/domain/family';
import { take } from 'rxjs/operators';
import { AlertController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-createfamily',
  templateUrl: './createfamily.page.html',
  styleUrls: ['./createfamily.page.scss'],
})
export class CreatefamilyPage implements OnInit {

  fam : Familia = new Familia() 
  User: any
  user2: any
  id:any
  aux: any

  alert: string
  advice: string

  private sessionUser : any

  constructor(  private router: Router, 
                private auth :  AuthenticationService, 
                private alertCtrl: AlertController, 
                private activate: ActivatedRoute,
                public menuCtrl: MenuController ) {
                  this.menuCtrl.enable(false)
                }

  async ngOnInit() {
    this.sessionUser = await this.auth.getUserAuth()
  }

  async crear(){

    if(this.fam){

      await this.sessionUser.pipe(take(1)).subscribe(async user =>{

        try {
          this.User = await this.auth.getUsuario(user.email)
          this.aux = await this.auth.createFamily(this.fam)
    
          await this.aux.pipe(take(1)).subscribe( async res=> {
  
            await this.User.pipe(take(1)).subscribe(res2=> {
              this.auth.changeFamily(res2[0], res[0])
              this.auth.modifyRole(res2[0], 'A')
            }) 
    
          }) 
  
        } catch (error) {
          console.log("error al crear familia")
  
          this.alert = "Ocurrió un error inesperado al ingresar su familia"
          this.advice = 'Por favor, inténtelo de nuevo'
    
          return this.genericAlert(this.alert, this.advice)
  
        }
  
        return this.router.navigate(["/tabs"]);
      })

    }else{
      console.log("error al crear familia")

      this.alert = "Debe llenar todos los datos necesarios"
      this.advice = 'Por favor, inténtelo de nuevo'

      return this.genericAlert(this.alert, this.advice)
    }
  }

  async prompt(){

    const prompt = await this.alertCtrl.create({  
      header: 'Buscar familia',  
      message: 'Ingrese el correo del jefe de la familia',  
      inputs: [  
        {  
          name: 'email',          
          placeholder: 'ejemplo@mail.com' ,
          type: 'email',
           
        },  
      ],  
      buttons: [  
        {  
          text: 'Cancelar',  
          handler: data => {  
            console.log('Cancel clicked');  
          }  
        },  
        {  
          text: 'Buscar',  
          handler: async data => {  
            console.log('Accept '+data.email)
            await this.join(data.email)
              
          }  
        }  
      ]  
    }); 
     
    await prompt.present()

  }

  async join(email) {
    
    try {
      this.User = await this.auth.getUsuario(email);
      //console.log(this.id);  
      await this.User.pipe(take(1)).subscribe( async res=> {
        
        if (res[0].id_familia === "-1") {
          console.log("no existe esa familia")

          this.alert = "No existe ninguna familia registrada con el correo electrónico ingresado"
          this.advice = 'Por favor, inténtelo de nuevo'
    
          return this.genericAlert(this.alert, this.advice)

        } else {

          await this.sessionUser.pipe(take(1)).subscribe(async user =>{
            this.aux = await this.auth.getUsuario(user.email)
            this.fam.id = res[0].id_familia

            await this.aux.pipe(take(1)).subscribe( res2=> {
              this.auth.changeFamily(res2[0],  this.fam)
              this.auth.modifyRole(res2[0], 'U')
              
            })

            return this.router.navigate(["/tabs"]);
          })

        }

      })

      return this.router.navigate(["/tabs"]);

    } catch (error) {
      console.log("error al asignar familia")

      this.alert = "Ocurrió un error inesperado al ingresar su familia"
      this.advice = 'Por favor, inténtelo de nuevo'

      return this.genericAlert(this.alert, this.advice)

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
