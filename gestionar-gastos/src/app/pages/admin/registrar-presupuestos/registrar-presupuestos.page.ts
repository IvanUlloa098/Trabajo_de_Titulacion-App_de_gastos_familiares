import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AlertController, MenuController,LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PresupuestosService } from 'src/app/services/presupuestos.service';
import { Presupuesto } from 'src/app/domain/presupuesto';

@Component({
  selector: 'app-registrar-presupuestos',
  templateUrl: './registrar-presupuestos.page.html',
  styleUrls: ['./registrar-presupuestos.page.scss'],
})
export class RegistrarPresupuestosPage implements OnInit {
  presupuesto:Presupuesto=new Presupuesto()
  presupuestos:any

  usuario:any

  alert: string
  advice: string

  private sessionUser : any 

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private presupuestoService: PresupuestosService,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private auth :  AuthenticationService,
    public menuCtrl: MenuController ) {
      this.menuCtrl.enable(false)
    }

  async ngOnInit() {
    this.sessionUser = await this.auth.getUserAuth()
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
  async registrarPresupuesto(){
    this.presupuesto.id=null
    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => {
        this.sessionUser.pipe(take(1)).subscribe(async user =>{
          try {        
            this.usuario = await this.auth.getUsuario(user.email)
            this.usuario.pipe(take(1)).subscribe(async user =>{
              this.presupuesto.id_familia=user[0].id_familia
              this.presupuesto.activo=true
              this.presupuestos=this.presupuestoService.obtenerPresupuestos(user[0].id_familia)
              this.presupuestos.pipe(take(2)).subscribe(async prsp =>{
                let unico=true
                for (let index = 0; index < prsp.length; index++) {                  
                  if(this.presupuesto.id_categoria==prsp[index].id_categoria && this.presupuesto.id_familia==prsp[index].id_familia){
                    unico=false                    
                  }
                }
                if(unico){
                  this.presupuestoService.guardar(this.presupuesto)
                } else{
                  this.alert = "El presupuesto para esta categoria ya esta definido"
                  this.advice = 'Por favor registre otro'        
                  return this.genericAlert(this.alert, this.advice)
                }
              })
            })

          } catch(error){
              console.log(error)  
              this.alert = "Ocurrió un error inesperado al registrar el presupuesto"
              this.advice = 'Por favor, inténtelo de nuevo'
        
              return this.genericAlert(this.alert, this.advice)
          }finally {
            a.dismiss().then(() => console.log('abort presenting'))
          }
        })

      }) 
    })
  }
}
