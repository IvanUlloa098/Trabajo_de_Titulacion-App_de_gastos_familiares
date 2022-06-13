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
  presupuestoAlimentacion:Presupuesto=new Presupuesto()
  presupuestoServicios:Presupuesto=new Presupuesto()
  presupuestoEducacion:Presupuesto=new Presupuesto()
  presupuestoOcio:Presupuesto=new Presupuesto()
  presupuestoTransporte:Presupuesto=new Presupuesto()
  presupuestoVivienda:Presupuesto=new Presupuesto()
  presupuestoSalud:Presupuesto=new Presupuesto()
  presupuestoOtros:Presupuesto=new Presupuesto()  

  presupuestos:any

  familia:any

  usuario:any

  alert: string
  advice: string

  diaMes:string

  presupuestoTotal:number

  ultimaActualizaicon:string

  private sessionUser : any 

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private presupuestoService: PresupuestosService,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private auth :  AuthenticationService,
    public menuCtrl: MenuController ) {
      this.menuCtrl.enable(true)
    }

  async ngOnInit() {
    this.obtenerultAct()
    this.sessionUser = await this.auth.getUserAuth()    
    this.sessionUser.pipe(take(1)).subscribe(async user =>{
      this.usuario = await this.auth.getUsuario(user.email)
      this.usuario.pipe(take(1)).subscribe(async user =>{
        this.familia=this.presupuestoService.obtenerFamilia(user[0].id_familia)
        this.familia.pipe(take(1)).subscribe(async fam =>{          
          this.diaMes=fam[0].primer_dia_mes.toString()
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
  async registrarPresupuesto(){    
    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => {
        this.sessionUser.pipe(take(1)).subscribe(async user =>{
          try {        
            this.usuario = await this.auth.getUsuario(user.email)
            this.usuario.pipe(take(1)).subscribe(async user =>{              
              this.presupuestoAlimentacion.id_familia=user[0].id_familia
              this.presupuestoServicios.id_familia=user[0].id_familia
              this.presupuestoEducacion.id_familia=user[0].id_familia
              this.presupuestoVivienda.id_familia=user[0].id_familia
              this.presupuestoTransporte.id_familia=user[0].id_familia
              this.presupuestoOcio.id_familia=user[0].id_familia
              this.presupuestoOtros.id_familia=user[0].id_familia
              this.presupuestoSalud.id_familia=user[0].id_familia
              this.presupuestoAlimentacion.activo=true              
              this.presupuestoServicios.activo=true
              this.presupuestoEducacion.activo=true
              this.presupuestoVivienda.activo=true
              this.presupuestoTransporte.activo=true
              this.presupuestoOcio.activo=true
              this.presupuestoOtros.activo=true
              this.presupuestoSalud.activo=true
              this.presupuestoServicios.fecha=this.presupuestoAlimentacion.fecha
              this.presupuestoEducacion.fecha=this.presupuestoAlimentacion.fecha
              this.presupuestoVivienda.fecha=this.presupuestoAlimentacion.fecha
              this.presupuestoTransporte.fecha=this.presupuestoAlimentacion.fecha
              this.presupuestoOcio.fecha=this.presupuestoAlimentacion.fecha
              this.presupuestoOtros.fecha=this.presupuestoAlimentacion.fecha
              this.presupuestoSalud.fecha=this.presupuestoAlimentacion.fecha
              this.presupuestoAlimentacion.id_categoria="834IqsQWzMFPdsE7TZKu"
              this.presupuestoServicios.id_categoria="yfXjC94YqUqIbn4zXMjx"
              this.presupuestoEducacion.id_categoria="EjKGtXUIHEnwC0MKrzIn"
              this.presupuestoVivienda.id_categoria="NgNS2EM0p4UdeAQlZ4q6"
              this.presupuestoTransporte.id_categoria="pZbMomfUFtw8u2aD0sEC"
              this.presupuestoOcio.id_categoria="Y2xbbnUeLwCz5UhfMMJZ"
              this.presupuestoOtros.id_categoria="uPtleC6y1na6ZkkpePAd"
              this.presupuestoSalud.id_categoria="Mp82DGLcR5AUOEk5DSrC"
              let sumatoria=this.presupuestoAlimentacion.cantidad+this.presupuestoEducacion.cantidad+
              this.presupuestoOcio.cantidad+this.presupuestoOtros.cantidad+this.presupuestoSalud.cantidad+
              this.presupuestoServicios.cantidad+this.presupuestoTransporte.cantidad+this.presupuestoVivienda.cantidad
              if(sumatoria<=this.presupuestoTotal && new Date(this.presupuestoAlimentacion.fecha).toDateString()!==this.ultimaActualizaicon){
                this.presupuestoService.guardar(this.presupuestoAlimentacion)
                this.presupuestoService.guardar(this.presupuestoEducacion)
                this.presupuestoService.guardar(this.presupuestoOcio)
                this.presupuestoService.guardar(this.presupuestoOtros)
                this.presupuestoService.guardar(this.presupuestoSalud)
                this.presupuestoService.guardar(this.presupuestoServicios)
                this.presupuestoService.guardar(this.presupuestoTransporte)
                this.presupuestoService.guardar(this.presupuestoVivienda)
              }else {
                this.alert = "El total de los presupuestos supera al total \n O ya se encuentran registrados presupuestos para esta fecha "
                this.advice = 'Por favor revise los valores'        
                return this.genericAlert(this.alert, this.advice)
              }
              
            })
            this.actualizarFamilia()
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
  async actualizarPresupuestos(){
    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => {
        this.sessionUser.pipe(take(1)).subscribe(async user =>{
          try {        
            this.usuario = await this.auth.getUsuario(user.email)
            this.usuario.pipe(take(1)).subscribe(async user =>{
            this.presupuestos= this.presupuestoService.obtenerPresupuestos(user[0].id_familia)
            let fechaActual=new Date(this.presupuestoAlimentacion.fecha)
            this.presupuestos.pipe(take(1)).subscribe(async prsp =>{
              for (let index = 0; index < prsp.length; index++) {                
                let fechaAux=new Date(prsp[index].fecha)                
                if(fechaAux.getMonth()<fechaActual.getMonth() && fechaAux.getFullYear()<=fechaActual.getFullYear()){
                  prsp[index].activo=false
                  this.presupuestoService.actualizarPresupuesto(prsp[index])
                }                
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
  async obtenerultAct(){
    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => {
        this.sessionUser.pipe(take(1)).subscribe(async user =>{
          try {        
            this.usuario = await this.auth.getUsuario(user.email)
            this.usuario.pipe(take(1)).subscribe(async user =>{
            this.presupuestos= this.presupuestoService.obtenerPresupuestos(user[0].id_familia)            
            this.presupuestos.pipe(take(1)).subscribe(async prsp =>{
              if(prsp.length>0){
                this.ultimaActualizaicon=new Date(prsp[0].fecha).toDateString()
              }else{
                this.ultimaActualizaicon=""
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
  async actualizarFamilia(){
    this.sessionUser = await this.auth.getUserAuth()    
    this.sessionUser.pipe(take(1)).subscribe(async user =>{
      this.usuario = await this.auth.getUsuario(user.email)
      this.usuario.pipe(take(1)).subscribe(async user =>{
        this.presupuestoService.actualizarFamiliaPrsp(user[0].id_familia,this.presupuestoTotal)                
      })      
    })
  }
}
