import { Component, OnInit } from '@angular/core';
import { Gasto } from 'src/app/domain/gasto';
import { GastosService } from 'src/app/services/gastos.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AlertController, MenuController,LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-ver-gastos',
  templateUrl: './ver-gastos.page.html',
  styleUrls: ['./ver-gastos.page.scss'],
})
export class VerGastosPage implements OnInit {

  //Variables para almacenamiento de respuestas desde Firebase de consultas de cada coleccion
  gastos:any
  usuario:any  

  //Variables para una notificacion especifica
  alert: string
  advice: string

  gastosF:Gasto[]=[]//Vector de objetos 'Gasto', almacenar en formato visualizacion de informacion de firebase

  private sessionUser : any//Variable para la obtencion de usuario logeado

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private gastoService: GastosService,//Declaracion de servicios para gastos
    private alertCtrl: AlertController,//Declaracion de servicios para alertas
    private auth :  AuthenticationService,//Declaracion de servicios de autenticacion
    private loadingController: LoadingController,//Declaracion de servicios de pantalla de progreso
    public menuCtrl: MenuController ) {//Declaracion de servicios para control del menu principal
      this.menuCtrl.enable(true)//Menu activado
    } 

  async ngOnInit() {//Funcion inicial de la pagina
    this.sessionUser = await this.auth.getUserAuth()//Utilizacion del servicio para obtener usuario que inicio sesion mediante Firebase    
    return await this.loadingController.create({ }).then(a => {//Llamado para pantalla de carga
      a.present().then(async () => {
        try {
          this.obtenerGastosUsr()//Llamado a funcion diseñada
        }catch(error){
           //Caso de encontrar un error, definir mesaje para alerta y lanzar alerta
           console.log(error)
           this.alert = "Ocurrió un error al cargar sus datos"
           this.advice = 'Por favor, inténtelo de nuevo'
 
           this.genericAlert(this.alert, this.advice)
 
         } finally {
           a.dismiss().then(() => console.log('abort presenting'))//Termino de pantalla de carga        
         }
      })
    })
    
  }
  async obtenerGastosUsr(){//Funcion para obtener los gastos correspondientes al usuario logeado     
    this.sessionUser.pipe(take(1)).subscribe(async user =>{        
        this.usuario = await this.auth.getUsuario(user.email)//Utilizacion de servicio para obtener usuario en base a consulta base de datos        
        this.usuario.forEach((element) => {//Recorrido de respuesta del servicio
          this.gastos=this.gastoService.obtenerGastos(element[0].uid)//Utilizacion de servicio para obtener gastos del usuario en base a consulta base de datos
          this.gastos.forEach(element => {
            for (let index = 0; index < element.length; index++) {
              let aux:Gasto=new Gasto()//Variable auxilizar de clase gasto
              //Asignacion de valores correspondientes a la lectura desde Firebase, con cambios para la visualizacion
              aux.id=element[index].id        
              aux.monto=element[index].monto
              aux.id_usuario=element[index].id_usuario
              //Cambio de contenido de variabe segun categoria
              if(element[index].id_categoria=='834IqsQWzMFPdsE7TZKu'){
                aux.id_categoria="Alimentacion"
              }
              if(element[index].id_categoria=='yfXjC94YqUqIbn4zXMjx'){
                aux.id_categoria="Servicios"
              }
              if(element[index].id_categoria=='EjKGtXUIHEnwC0MKrzIn'){
                aux.id_categoria="Educacion"
              }
              if(element[index].id_categoria=='Y2xbbnUeLwCz5UhfMMJZ'){
                aux.id_categoria="Ocio"
              }
              if(element[index].id_categoria=='pZbMomfUFtw8u2aD0sEC'){
                aux.id_categoria="Transporte"
              }
              if(element[index].id_categoria=='NgNS2EM0p4UdeAQlZ4q6'){
                aux.id_categoria="Vivienda"
              }
              if(element[index].id_categoria=='Mp82DGLcR5AUOEk5DSrC'){
                aux.id_categoria="Salud"
              }
              if(element[index].id_categoria=='uPtleC6y1na6ZkkpePAd'){
                aux.id_categoria="Otros"
              }
              aux.fecha=element[index].fecha
              aux.descripcion=element[index].descripcion                        
              this.gastosF.push(aux) //Adicion a vector para posterio lectura
            }
          });
        });     
    })  
  }
  async genericAlert(alert_message, advice){//Funcion para creacion de alerta
    const prompt = await this.alertCtrl.create({//Llamado a creacion con el mensaje antes definido   
      header: 'Lo sentimos',  
      subHeader: alert_message,
      message: advice,
      buttons: ['Aceptar']//Boton de confirmacion
    });
    await prompt.present()
  }
}
