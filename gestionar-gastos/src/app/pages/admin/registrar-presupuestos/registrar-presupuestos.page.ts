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
  //Declaracion e iniciacion de un objeto para cada uno de los diferentes presupuestos
  presupuestoAlimentacion:Presupuesto=new Presupuesto()
  presupuestoServicios:Presupuesto=new Presupuesto()
  presupuestoEducacion:Presupuesto=new Presupuesto()
  presupuestoOcio:Presupuesto=new Presupuesto()
  presupuestoTransporte:Presupuesto=new Presupuesto()
  presupuestoVivienda:Presupuesto=new Presupuesto()
  presupuestoSalud:Presupuesto=new Presupuesto()
  presupuestoOtros:Presupuesto=new Presupuesto()  

  //Variable para almacenamiento de respuesta desde Firebase de las consultas de cada coleccion
  presupuestos:any 
  familia:any
  usuario:any

  //Variables para una notificacion especifica
  alert: string 
  advice: string 

  diaMes:string //Variable que define el dia que tiene una familia para definir un presupuesto

  presupuestoTotal:number //Variable para verificacion de sumatoria de los diferentes sub-preseupuestos

  ultimaActualizaicon:string //Variable para obtencion de la fecha de los ultimos presupuestos activos

  private sessionUser : any //Variable para la obtencion de usuario logeado

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private presupuestoService: PresupuestosService, //Declaracion de servicios para presupuestos
    private alertCtrl: AlertController,//Declaracion de servicios para alertas
    private loadingController: LoadingController,//Declaracion de servicios de pantalla de progreso
    private auth :  AuthenticationService,//Declaracion de servicios de autenticacion
    public menuCtrl: MenuController ) {//Declaracion de servicios para control del menu principal
      this.menuCtrl.enable(true)//Menu activado
    }

  async ngOnInit() { //Funcion inicial
    this.obtenerultAct()//Llamada a funcion diseñada
    this.sessionUser = await this.auth.getUserAuth()//Utilizacion del servicio para obtener usuario que inicio sesion mediante Firebase    
    this.sessionUser.pipe(take(1)).subscribe(async user =>{//Recorrido de respuesta del servicio
      this.usuario = await this.auth.getUsuario(user.email)//Utilizacion de servicio para obtener usuario en base a consulta base de datos
      this.usuario.pipe(take(1)).subscribe(user =>{//Recorrido de respuesta del servicio
        this.familia=this.presupuestoService.obtenerFamilia(user[0].id_familia)//Utilizacion de servicio para obtener familia del usuario en base a consulta base de datos
        this.familia.pipe(take(1)).subscribe(fam =>{//Recorrido de respuesta del servicio        
          this.diaMes=fam[0].primer_dia_mes.toString()//Asignacion de valor para restriccion de seleccion de dia, registro de presupuesto
        })        
      })      
    })
  }
  async genericAlert(alert_message, advice){//Funcion para creacion de alerta

    const prompt = await this.alertCtrl.create({//Llamado a creacion con el mensaje antes definido 
      //Mensaje
      header: 'Lo sentimos',  
      subHeader: alert_message,
      message: advice,  
      
      buttons: ['Aceptar']//Boton de confirmacion  
    }); 

    await prompt.present()

  }
  async registrarPresupuesto(){//Funcion para asignacion de valores para los presupuestos
    return await this.loadingController.create({ }).then(a => {//Llamado para pantalla de carga
      a.present().then(async () => {
        this.sessionUser.pipe(take(1)).subscribe(async user =>{//Recorrido de respuesta del servicio
          try {//Clausula try-catch
            this.usuario = await this.auth.getUsuario(user.email)
            this.usuario.pipe(take(1)).subscribe(user =>{
              //Asignacion de valores correspondienteas a cada presupuesto
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
              //Valores de categoria registrados en Firebase
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
              this.presupuestoServicios.cantidad+this.presupuestoTransporte.cantidad+this.presupuestoVivienda.cantidad//Calculo de Presupuesto total de la familia 
              //Clausula para control de presupuestos y presupuesto total, ademas de verificacion de fecha de registro
              if(sumatoria<=this.presupuestoTotal && new Date(this.presupuestoAlimentacion.fecha).toDateString()!==this.ultimaActualizaicon){
                //En caso de cumplir clausula, guardar los diferentes presupuestos
                this.presupuestoService.guardar(this.presupuestoAlimentacion)
                this.presupuestoService.guardar(this.presupuestoEducacion)
                this.presupuestoService.guardar(this.presupuestoOcio)
                this.presupuestoService.guardar(this.presupuestoOtros)
                this.presupuestoService.guardar(this.presupuestoSalud)
                this.presupuestoService.guardar(this.presupuestoServicios)
                this.presupuestoService.guardar(this.presupuestoTransporte)
                this.presupuestoService.guardar(this.presupuestoVivienda)
                this.actualizarFamilia()//Llamada a funcion diseñada
              }else {
                //Caso contrario, definir mesaje para alerta y lanzar alerta
                this.alert = "El total de los presupuestos supera al total \n O ya se encuentran registrados presupuestos para esta fecha "
                this.advice = 'Por favor revise los valores'        
                return this.genericAlert(this.alert, this.advice)
              }
            })            
          } catch(error){
            //Caso de encontrar un error, definir mesaje para alerta y lanzar alerta
              console.log(error)  
              this.alert = "Ocurrió un error inesperado al registrar el presupuesto"
              this.advice = 'Por favor, inténtelo de nuevo'        
              return this.genericAlert(this.alert, this.advice)
          }finally {
            a.dismiss().then(() => console.log('abort presenting'))//Mensaje para registro de finalizacion de proceso
          }
        })        
      }) 
    })
  }
  async actualizarPresupuestos(){//Funcion para actualizar estado de presupuestos anteriores
    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => {
        this.sessionUser.pipe(take(1)).subscribe(async user =>{
          try {        
            this.usuario = await this.auth.getUsuario(user.email)
            this.usuario.pipe(take(1)).subscribe(user =>{
            //Utilizacion de servicio para obtener presupuestos de la familia en base a consulta base de datos
            this.presupuestos= this.presupuestoService.obtenerPresupuestos(user[0].id_familia)
            let fechaActual=new Date(this.presupuestoAlimentacion.fecha)//Variable auxiliar para comparacion de fechas(Actual y registrada)
            this.presupuestos.pipe(take(1)).subscribe(prsp =>{
              if(prsp.length>0){//Clausula de verificacion de presupuestos anteriores
                for (let index = 0; index < prsp.length; index++) {                
                  let fechaAux=new Date(prsp[index].fecha)//Variable auxiliar para comparacion de fechas(Actual y registrada)             
                  //Clausula de verificacfion de fechas anteriores en presupuestos
                  if(fechaAux.getMonth()<fechaActual.getMonth() && fechaAux.getFullYear()<=fechaActual.getFullYear()){
                    //Caso de cumplir cambiar de estado
                    prsp[index].activo=false
                    this.presupuestoService.actualizarPresupuesto(prsp[index])//Funcion para actualizar presupuesto
                  }                
                }
              }else{
                //Caso contrario, definir mesaje para alerta y lanzar alerta
                this.alert = "Presupuesto Unico"
                this.advice = 'Ningun presupuesto anterior que actualizar'        
                return this.genericAlert(this.alert, this.advice)
              }                              
            })
          })          
        } catch(error){
          //Caso de encontrar un error, definir mesaje para alerta y lanzar alerta
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
  async obtenerultAct(){//Funcion para obtener fecha registrada en ultimo presupuesto
    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => {
        this.sessionUser.pipe(take(1)).subscribe(async user =>{
          try {
            this.usuario = await this.auth.getUsuario(user.email)
            this.usuario.pipe(take(1)).subscribe(user =>{
            this.presupuestos= this.presupuestoService.obtenerPresupuestos(user[0].id_familia)            
            this.presupuestos.pipe(take(1)).subscribe(prsp =>{
              if(prsp.length>0){//Clausua para verificacion de presupuestos ya existentes
                this.ultimaActualizaicon=new Date(prsp[0].fecha).toDateString()//Asignacion de fecha a variable de tipo fecha
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
  async actualizarFamilia(){//Funcion para actualizacion de valor del presupuesto total de la familia
    this.sessionUser = await this.auth.getUserAuth()    
    this.sessionUser.pipe(take(1)).subscribe(async user =>{
      this.usuario = await this.auth.getUsuario(user.email)
      this.usuario.pipe(take(1)).subscribe(user =>{
        this.presupuestoService.actualizarFamiliaPrsp(user[0].id_familia,this.presupuestoTotal)//Llamado de servicio para actualizacion de valor, envio de id familia y valor                
      })      
    })
  }
}
