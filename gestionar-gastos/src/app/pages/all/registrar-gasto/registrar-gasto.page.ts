import { Component, OnInit } from '@angular/core';
import { Gasto } from 'src/app/domain/gasto';
import { GastosService } from 'src/app/services/gastos.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AlertController, MenuController,LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { DatePipe } from '@angular/common'


@Component({
  selector: 'app-registrar-gasto',
  templateUrl: './registrar-gasto.page.html',
  styleUrls: ['./registrar-gasto.page.scss'],
})
export class RegistrarGastoPage implements OnInit {
  gasto:Gasto=new Gasto();//Variable de clase 'Gasto', almacenar en formato visualizacion de informacion de firebase
  //Variable para almacenamiento de respuesta desde Firebase de consultas de la coleccion de usuarios
  usuario:any  

  //Variables para una notificacion especifica
  alert: string
  advice: string

  private sessionUser : any//Variable para la obtencion de usuario logeado

  constructor(private route: ActivatedRoute,
    private localNotifications: LocalNotifications,
    private router: Router, 
    private gastoService: GastosService,//Declaracion de servicios para gastos
    private alertCtrl: AlertController,
    private auth :  AuthenticationService,//Declaracion de servicios de autenticacion
    private loadingController: LoadingController,//Declaracion de servicios de pantalla de progreso
    public menuCtrl: MenuController,
    public datepipe: DatePipe ) {//Declaracion de servicios para control del menu principal
      this.menuCtrl.enable(true)//Menu activado
    }

  async ngOnInit() {
    this.sessionUser = await this.auth.getUserAuth()//Utilizacion del servicio para obtener usuario que inicio sesion mediante Firebase  
  }
  async registrarGasto(){//Funcion para registrar el gasto en la coleccion de firebase
    this.gasto.id=null//anular el valor de id del gasto,antecedente necesario para la generacion automatica de ID's de firebase
    return await this.loadingController.create({ }).then(a => {//Llamado para pantalla de carga
      a.present().then(async () => {
        console.log(this.gasto.id_categoria)
        if(this.gasto.monto !== undefined && this.gasto.id_categoria !== undefined) {
          this.sessionUser.pipe(take(1)).subscribe(async user =>{//Recorrido de respuesta del servicio
            try {//Calusula try-catch
              this.usuario = await this.auth.getUsuario(user.email)//Utilizacion de servicio para obtener usuario en base a consulta base de datos
              this.usuario.pipe(take(1)).subscribe(user =>{
                this.gasto.id_usuario=user[0].uid//Asignacion de id del usuario que registra el gasto
                this.gasto.id_familia=user[0].id_familia//Asignacion de id de la familia

                var fecha=new Date(this.gasto.fecha);//Crear variable con tipo fecha para generar notificacion

                if (this.gasto.fecha === undefined) {
                  this.gasto.fecha = this.datepipe.transform(new Date(), 'YYYY-MM-ddThh:mm:ssZ');
                  fecha=new Date()
                }

                if (this.gasto.descripcion === null || this.gasto.descripcion === undefined) {
                  this.gasto.descripcion = "No especificado"
                }
                  
                this.localNotifications.schedule({//LLamado a funcion de programar la notificacion en base a una fecha
                  text: "Nuevo Gasto"+this.gasto.descripcion+"\n De: "+this.gasto.monto,
                  trigger: {at: fecha},                 
                });
  
                this.gastoService.guardar(this.gasto)//Llamado a funcion diseñada
                this.alert = "Registro del gasto correcto"
                this.advice = 'Informacion Guardada'
          
                return this.genericAlert("¡Listo!", this.alert, this.advice)
                
                
                
              })        
            } catch(error){
              //Caso de encontrar un error, definir mesaje para alerta y lanzar alerta
              console.log(error)  
              this.alert = "Ocurrió un error inesperado al registrar el gasto"
              this.advice = 'Por favor, inténtelo de nuevo'
        
              return this.genericAlert('Lo sentimos',this.alert, this.advice)
            }finally {
              a.dismiss().then(() => console.log('abort presenting'))
            }
          })
        } else {          
          this.alert = "Ocurrió un error"
          this.advice = 'Por favor, llene toda la información requerida'
          
          a.dismiss().then(() => console.log('abort presenting'))
          return this.genericAlert('Lo sentimos',this.alert, this.advice)
        }
        

      }) 
    })
  }
  async genericAlert(header, alert_message, advice){//Funcion para creacion de alerta

    const prompt = await this.alertCtrl.create({//Llamado a creacion con el mensaje antes definido   
      header: header,  
      subHeader: alert_message,
      message: advice,  
      
      buttons: ['Aceptar']//Boton de confirmacion
    }); 

    await prompt.present()

  }
}
