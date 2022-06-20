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
  
  gastosF:Gasto[]=[]//Vector de objetos 'Gasto', almacenar en formato visualizacion de informacion de firebase
  
  //Variables para almacenamiento de respuestas desde Firebase de consultas de cada coleccion
  usuarios:any
  gastos:any
  usuario:any  

  //Variables para una notificacion especifica
  alert: string
  advice: string

  private sessionUser : any//Variable para la obtencion de usuario logeado
 
  constructor(private route: ActivatedRoute,
              private router: Router, 
              private gastoService: GastosService,//Declaracion de servicios para gastos
              private alertCtrl: AlertController,//Declaracion de servicios para alertas
              private loadingController: LoadingController,//Declaracion de servicios de pantalla de progreso
              private auth :  AuthenticationService,//Declaracion de servicios de autenticacion
              public menuCtrl: MenuController ) {//Declaracion de servicios para control del menu principal
                this.menuCtrl.enable(true)//Menu activado
                
              }

  async ngOnInit() {//Funcion inicial de la pagina
    this.sessionUser = await this.auth.getUserAuth()//Utilizacion del servicio para obtener usuario que inicio sesion mediante Firebase  
    return await this.loadingController.create({ }).then(a => {//Llamado para pantalla de carga
      a.present().then(async () => {
        try {
          this.obtenerGastosFml()//Llamado a funcion  diseñado
          a.dismiss().then(() => console.log('abort presenting'))//Termino de pantalla de carga
        } catch (error) {
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
  async obtenerGastosFml(){//Funcion para lectura de gastos de los miembors de la familia, calculo de gastos por categoria
    this.sessionUser.pipe(take(1)).subscribe(async user =>{//Recorrido de respuesta del servicio
      try {//Clausua try-catch
        this.usuario = await this.auth.getUsuario(user.email)//Utilizacion de servicio para obtener usuario en base a consulta base de datos
        this.usuario.pipe(take(1)).subscribe(user =>{
          this.usuarios=this.gastoService.obtenerusrFamilia(user[0].id_familia)//Utilizacion de servicio para obtener los usuarios miembros de la familia del usuario en base a consulta base de datos          
          this.usuarios.pipe().subscribe(user =>{
            this.gastos=this.gastoService.obtenerGastos(user[0].uid)//Utilizacion de servicio para obtener gastos del usuario en base a consulta base de datos
            this.gastos.pipe(take(1)).subscribe(gasto =>{
              for (let index = 0; index < gasto.length; index++) {
                let aux:Gasto=new Gasto()//Variable auxilizar de clase gasto
                //Asignacion de valores correspondientes a la lectura desde Firebase, con cambios para la visualizacion 
                aux.id=gasto[index].id
                aux.monto=gasto[index].monto
                aux.id_usuario=gasto[index].id_usuario
                //Cambio de contenido de variabe segun categoria
                if(gasto[index].id_categoria=='834IqsQWzMFPdsE7TZKu'){
                  aux.id_categoria="Alimentacion"
                }
                if(gasto[index].id_categoria=='yfXjC94YqUqIbn4zXMjx'){
                  aux.id_categoria="Servicios"
                }
                if(gasto[index].id_categoria=='EjKGtXUIHEnwC0MKrzIn'){
                  aux.id_categoria="Educacion"
                }
                if(gasto[index].id_categoria=='Y2xbbnUeLwCz5UhfMMJZ'){
                  aux.id_categoria="Ocio"
                }
                if(gasto[index].id_categoria=='pZbMomfUFtw8u2aD0sEC'){
                  aux.id_categoria="Transporte"
                }
                if(gasto[index].id_categoria=='NgNS2EM0p4UdeAQlZ4q6'){
                  aux.id_categoria="Vivienda"
                }
                if(gasto[index].id_categoria=='Mp82DGLcR5AUOEk5DSrC'){
                  aux.id_categoria="Salud"
                }
                if(gasto[index].id_categoria=='uPtleC6y1na6ZkkpePAd'){
                  aux.id_categoria="Otros"
                }                
                aux.fecha=gasto[index].fecha
                aux.descripcion=gasto[index].descripcion
                //Adicion a vector para posterio lectura                        
                this.gastosF.push(aux) 
              }
            })            
          })         
        })        
      } catch(error){
        //Caso de encontrar un error, definir mesaje para alerta y lanzar alerta
          console.log(error)  
          this.alert = "Ocurrió un error inesperado al cargar la informacion del usuario"
          this.advice = 'Por favor, inténtelo de nuevo'
    
          return this.genericAlert(this.alert, this.advice)
      }
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
