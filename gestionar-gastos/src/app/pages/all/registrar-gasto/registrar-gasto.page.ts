import { Component, OnInit } from '@angular/core';
import { Gasto } from 'src/app/domain/gasto';
import { GastosService } from 'src/app/services/gastos.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AlertController, MenuController,LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-registrar-gasto',
  templateUrl: './registrar-gasto.page.html',
  styleUrls: ['./registrar-gasto.page.scss'],
})
export class RegistrarGastoPage implements OnInit {
  gasto:Gasto=new Gasto();
  usuario:any  

  alert: string
  advice: string

  private sessionUser : any

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private gastoService: GastosService,
    private alertCtrl: AlertController,
    private auth :  AuthenticationService,
    private loadingController: LoadingController,
    public menuCtrl: MenuController ) {
      this.menuCtrl.enable(false)
    }

  async ngOnInit() {
    this.sessionUser = await this.auth.getUserAuth()    
  }
  async registrarGasto(){
    this.gasto.id=null    
    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => {
        this.sessionUser.pipe(take(1)).subscribe(async user =>{
          try {        
            this.usuario = await this.auth.getUsuario(user.email)
            this.usuario.pipe(take(1)).subscribe(async user =>{
              this.gasto.id_usuario=user[0].uid
              this.gastoService.guardar(this.gasto)       
            })        
          } catch(error){
              console.log(error)  
              this.alert = "Ocurrió un error inesperado al registrar el gasto"
              this.advice = 'Por favor, inténtelo de nuevo'
        
              return this.genericAlert(this.alert, this.advice)
          }finally {
            a.dismiss().then(() => console.log('abort presenting'))
          }
        })

      }) 
    })
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
