import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Familia } from 'src/app/domain/family';
import { take } from 'rxjs/operators';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';

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
                public menuCtrl: MenuController,
                private loadingController: LoadingController ) {
                  this.menuCtrl.enable(false)
                }

  async ngOnInit() {
    // Obtención del usuario que actualmente tiene la sesión abierta
    this.sessionUser = await this.auth.getUserAuth()
  }

  async crear(){

    if((this.fam.nombre === null || this.fam.nombre === undefined) || 
      (this.fam.presupuesto_global === null || this.fam.presupuesto_global === undefined) ||
      (this.fam.primer_dia_mes === null || this.fam.primer_dia_mes === undefined)){
        this.alert = "Ocurrió un error"
        this.advice = 'Por favor, ingrese los datos necesarios'
        
        //  Mostrar mensaje de al usuario
        return this.genericAlert(this.alert, this.advice);

      }

    // Control de la interacción del usuario usando una rueda de carga
    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => { 

        if(this.fam){

          // Obtener los datos del usurio de FireStore dado- 
          //    el email proporcionado por la API de autentificación
          await this.sessionUser.pipe(take(1)).subscribe(async user =>{
    
            try {
              this.User = await this.auth.getUsuario(user.email)
              this.aux = await this.auth.createFamily(this.fam)
        
              await this.aux.pipe(take(1)).subscribe( async res=> {
      
                await this.User.pipe(take(1)).subscribe(res2=> {
                  this.auth.changeFamily(res2[0], res[0])
                  this.auth.modifyRole(res2[0], 'A')

                  a.dismiss().then(() => console.log('abort presenting'));
                }) 
        
              }) 
      
            } catch (error) {
              console.log("error al crear familia")
      
              this.alert = "Ocurrió un error inesperado al ingresar su familia"
              this.advice = 'Por favor, inténtelo de nuevo'
        
              return this.genericAlert(this.alert, this.advice)
      
            } finally {
              a.dismiss().then(() => console.log('abort presenting'));
            }
      
            return this.router.navigate(["/home"]);
          })
    
        }else{
          console.log("error al crear familia")
    
          this.alert = "Debe llenar todos los datos necesarios"
          this.advice = 'Por favor, inténtelo de nuevo'
    
          return this.genericAlert(this.alert, this.advice)
        }

      }) 
    })

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
            return await this.loadingController.create({ }).then(a => {
              a.present().then(async () => { 
        
                console.log('Accept '+data.email)
                await this.join(data.email)

                a.dismiss().then(() => console.log('abort presenting'));
        
              }) 
            })
              
          }  
        }  
      ]  
    }); 
     
    await prompt.present()

  }

  async dismiss() {
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
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

            return this.router.navigate(["/home"]);
          })

        }

      })

      return this.router.navigate(["/home"]);

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
