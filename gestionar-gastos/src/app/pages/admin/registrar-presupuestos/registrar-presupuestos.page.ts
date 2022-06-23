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
  oldPresupuestos: any
  familia:any
  usuario:any
  presupuestoExist:boolean = false
  sumPresupuestoIng:number = 0
  labelColor:string="primary"

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
    return await this.loadingController.create({ }).then(a => {//Llamado para pantalla de carga
      a.present().then(async () => {
        this.sessionUser = await this.auth.getUserAuth()//Utilizacion del servicio para obtener usuario que inicio sesion mediante Firebase    
        this.sessionUser.pipe(take(1)).subscribe(async user =>{//Recorrido de respuesta del servicio
          this.usuario = await this.auth.getUsuario(user.email)//Utilizacion de servicio para obtener usuario en base a consulta base de datos
          this.usuario.pipe(take(1)).subscribe(user =>{//Recorrido de respuesta del servicio
            this.familia=this.presupuestoService.obtenerFamilia(user[0].id_familia)//Utilizacion de servicio para obtener familia del usuario en base a consulta base de datos
            this.presupuestoService.obtenerPresupuestos(user[0].id_familia).subscribe(res => {

              //  Llenar los datos de los presupuestos si estos existen
              if(res.length > 0){            
                // console.log(res.filter(data => data.id_categoria === "pZbMomfUFtw8u2aD0sEC")[0])
                this.presupuestoExist = true
                this.presupuestoAlimentacion=res.filter(data => data.id_categoria === "834IqsQWzMFPdsE7TZKu")[0]
                this.presupuestoServicios=res.filter(data => data.id_categoria === "yfXjC94YqUqIbn4zXMjx")[0]
                this.presupuestoEducacion=res.filter(data => data.id_categoria === "EjKGtXUIHEnwC0MKrzIn")[0]
                this.presupuestoOcio=res.filter(data => data.id_categoria === "Y2xbbnUeLwCz5UhfMMJZ")[0]
                this.presupuestoTransporte=res.filter(data => data.id_categoria === "pZbMomfUFtw8u2aD0sEC")[0]
                this.presupuestoVivienda=res.filter(data => data.id_categoria === "NgNS2EM0p4UdeAQlZ4q6")[0]
                this.presupuestoSalud=res.filter(data => data.id_categoria === "Mp82DGLcR5AUOEk5DSrC")[0]
                this.presupuestoOtros=res.filter(data => data.id_categoria === "uPtleC6y1na6ZkkpePAd")[0]
                
                this.sumaPresupuesto()

              }

              a.dismiss().then(() => console.log('abort presenting'))//Mensaje para registro de finalizacion de proceso
            })
            
            this.familia.pipe(take(1)).subscribe(fam =>{//Recorrido de respuesta del servicio        
              this.diaMes=fam[0].primer_dia_mes.toString()//Asignacion de valor para restriccion de seleccion de dia, registro de presupuesto
              this.presupuestoTotal = fam[0].presupuesto_global
            })        
          })      
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

  sumaPresupuesto(){
    this.sumPresupuestoIng=   this.presupuestoAlimentacion.cantidad
                            + this.presupuestoServicios.cantidad
                            + this.presupuestoEducacion.cantidad
                            + this.presupuestoOcio.cantidad
                            + this.presupuestoTransporte.cantidad
                            + this.presupuestoVivienda.cantidad
                            + this.presupuestoSalud.cantidad
                            + this.presupuestoOtros.cantidad;
    
    if(this.sumPresupuestoIng > this.presupuestoTotal){
      this.labelColor="danger"
    } else {
      this.labelColor="primary"
    }
  }

  actionPresupuesto() {
    this.sumaPresupuesto()

    //Clausula para control de presupuestos y presupuesto total, ademas de verificacion de fecha de registro
    if(this.presupuestoTotal !== null 
        && this.presupuestoAlimentacion.cantidad !== null
        && this.presupuestoServicios.cantidad !== null
        && this.presupuestoEducacion.cantidad !== null
        && this.presupuestoOcio.cantidad !== null
        && this.presupuestoTransporte.cantidad !== null
        && this.presupuestoVivienda.cantidad !== null
        && this.presupuestoSalud.cantidad !== null
        && this.presupuestoOtros.cantidad !== null
        && this.sumPresupuestoIng <= this.presupuestoTotal){
          
          if(this.presupuestoExist){
            this.actualizarPresupuestos()
          } else {
            this.registrarPresupuesto()
          }

        } else {
          this.alert = "Imposible de procesar su petición"
          this.advice = 'Por favor, llene todos los campos necesarios o no se pase de su presupuesto'        
          return this.genericAlert(this.alert, this.advice)
        }

    
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

              this.presupuestoServicios.fecha=(new Date).toISOString()
              this.presupuestoEducacion.fecha=(new Date).toISOString()
              this.presupuestoVivienda.fecha=(new Date).toISOString()
              this.presupuestoTransporte.fecha=(new Date).toISOString()
              this.presupuestoOcio.fecha=(new Date).toISOString()
              this.presupuestoOtros.fecha=(new Date).toISOString()
              this.presupuestoSalud.fecha=(new Date).toISOString()
              
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
        this.presupuestoServicios.fecha=(new Date).toISOString()
        this.presupuestoEducacion.fecha=(new Date).toISOString()
        this.presupuestoVivienda.fecha=(new Date).toISOString()
        this.presupuestoTransporte.fecha=(new Date).toISOString()
        this.presupuestoOcio.fecha=(new Date).toISOString()
        this.presupuestoOtros.fecha=(new Date).toISOString()
        this.presupuestoSalud.fecha=(new Date).toISOString()

        //En caso de cumplir clausula, guardar los diferentes presupuestos
        this.presupuestoService.actualizarPresupuesto(this.presupuestoAlimentacion)
        this.presupuestoService.actualizarPresupuesto(this.presupuestoEducacion)
        this.presupuestoService.actualizarPresupuesto(this.presupuestoOcio)
        this.presupuestoService.actualizarPresupuesto(this.presupuestoOtros)
        this.presupuestoService.actualizarPresupuesto(this.presupuestoSalud)
        this.presupuestoService.actualizarPresupuesto(this.presupuestoServicios)
        this.presupuestoService.actualizarPresupuesto(this.presupuestoTransporte)
        this.presupuestoService.actualizarPresupuesto(this.presupuestoVivienda)
        this.actualizarFamilia()//Llamada a funcion diseñada
        a.dismiss().then(() => console.log('abort presenting'))//Mensaje para registro de finalizacion de proceso

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
