import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Familia } from 'src/app/domain/family';
import { take } from 'rxjs/operators';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-update-family',
  templateUrl: './update-family.page.html',
  styleUrls: ['./update-family.page.scss'],
})
export class UpdateFamilyPage implements OnInit {

  private fam: Familia = new Familia()
  private aux: any

  user: any
  id:any
  nombre:any
  presupuesto_global:any
  primer_dia_mes:any

  alert: string
  advice: string
  header: string

  private sessionUser : any

  constructor(  private router: Router, 
                private auth :  AuthenticationService, 
                private alertCtrl: AlertController, 
                private activate: ActivatedRoute,
                private loadingController: LoadingController ) { }

  async ngOnInit() {

    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => {
        
        this.sessionUser = await this.auth.getUserAuth()

        await this.sessionUser.pipe(take(1)).subscribe(async user =>{
          this.user = await this.auth.getUsuario(user.email)

          await this.user.pipe(take(1)).subscribe(async res=> {
            
            this.aux = await this.auth.getFamily(res[0].id_familia)

            await this.aux.pipe(take(1)).subscribe( res2=> {
              this.id = res2[0].id
              this.nombre= res2[0].nombre
              this.presupuesto_global = res2[0].presupuesto_global
              this.primer_dia_mes = res2[0].primer_dia_mes

              a.dismiss().then(() => console.log('abort presenting'));
              
            })

          })

        })
        
      });
    });

  }

  async dismiss() {
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

  async update(email) {
    
    try {
      
      this.fam.id = this.id
      this.fam.nombre = this.nombre
      this.fam.presupuesto_global = this.presupuesto_global
      this.fam.primer_dia_mes = this.primer_dia_mes

      //console.log(this.fam)

      this.auth.updateFamily(this.fam)

      this.header = 'Listo'
      this.alert = ""
      this.advice = 'Datos actualizados correctamente'
      this.genericAlert(this.header, this.alert, this.advice)

      return this.router.navigate(["/tabs"]);

    } catch (error) {
      console.log("error al asignar familia")

      this.header = 'Lo sentimos'
      this.alert = "Ocurrió un error inesperado al ingresar su familia"
      this.advice = 'Por favor, inténtelo de nuevo'

      return this.genericAlert(this.header, this.alert, this.advice)

    }

  }

  regresar(){
    this.router.navigate(["/login"])
  }

  async genericAlert(header, alert_message, advice){

    const prompt = await this.alertCtrl.create({  
      header: header,  
      subHeader: alert_message,
      message: advice,  
      
      buttons: ['Aceptar']  
    }); 

    await prompt.present()

  }

}
