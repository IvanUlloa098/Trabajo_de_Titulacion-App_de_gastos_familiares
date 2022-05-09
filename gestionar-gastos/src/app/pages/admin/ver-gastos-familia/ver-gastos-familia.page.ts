import { Component, OnInit } from '@angular/core';
import { Gasto } from 'src/app/domain/gasto';
import { GastosService } from 'src/app/services/gastos.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AlertController, MenuController,LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-ver-gastos-familia',
  templateUrl: './ver-gastos-familia.page.html',
  styleUrls: ['./ver-gastos-familia.page.scss'],
})
export class VerGastosFamiliaPage implements OnInit {
  
  gastosF:Gasto[]=[]
  usuarios:any
  gastos:any
  usuario:any  

  alert: string
  advice: string

  private sessionUser : any  
 
  constructor(private route: ActivatedRoute,
    private router: Router, 
    private gastoService: GastosService,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private auth :  AuthenticationService,
    public menuCtrl: MenuController ) {
      this.menuCtrl.enable(false)
    }

  async ngOnInit() {
    this.sessionUser = await this.auth.getUserAuth()
    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => {
        try {
          this.obtenerGastosFml()
          a.dismiss().then(() => console.log('abort presenting'))          
        } catch (error) {
          console.log('ERROR al cargar datos')
          this.alert = "Ocurrió un error al cargar sus datos"
          this.advice = 'Por favor, inténtelo de nuevo'

          this.genericAlert(this.alert, this.advice)

        } finally {
          a.dismiss().then(() => console.log('abort presenting'))
        }

      }) 
    })
        
  }  
  async obtenerGastosFml(){     
    this.sessionUser.pipe(take(1)).subscribe(async user =>{
      try {        
        this.usuario = await this.auth.getUsuario(user.email)
        this.usuario.pipe(take(1)).subscribe(async user =>{
          this.usuarios=this.gastoService.obtenerusrFamilia(user[0].id_familia)          
          this.usuarios.pipe().subscribe(async user =>{
            this.gastos=this.gastoService.obtenerGastos(user[0].uid)
            this.gastos.pipe(take(1)).subscribe(async gasto =>{
              for (let index = 0; index < gasto.length; index++) {
                let aux:Gasto=new Gasto()
                aux.id=gasto[index].id        
                aux.monto=gasto[index].monto
                aux.id_usuario=gasto[index].id_usuario
                aux.id_categoria=gasto[index].id_categoria
                aux.fecha=gasto[index].fecha
                aux.descripcion=gasto[index].descripcion                        
                this.gastosF.push(aux)
              }
            })            
          })         
        })        
      } catch(error){
          console.log(error)  
          this.alert = "Ocurrió un error inesperado al cargar la informacion del usuario"
          this.advice = 'Por favor, inténtelo de nuevo'
    
          return this.genericAlert(this.alert, this.advice)
      }
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
