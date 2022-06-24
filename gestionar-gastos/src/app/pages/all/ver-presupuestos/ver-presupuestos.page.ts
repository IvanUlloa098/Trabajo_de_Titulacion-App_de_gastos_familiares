import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AlertController, MenuController,LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PresupuestosService } from 'src/app/services/presupuestos.service';
import { Presupuesto } from 'src/app/domain/presupuesto';

@Component({
  selector: 'app-ver-presupuestos',
  templateUrl: './ver-presupuestos.page.html',
  styleUrls: ['./ver-presupuestos.page.scss'],
})
export class VerPresupuestosPage implements OnInit {
  //Variables para almacenamiento de respuestas desde Firebase de consultas de cada coleccion
  presupuestos:any
  presupuestoGlobal:number
  loadGlobal:boolean = false
  usuario:any  

  //Variables para una notificacion especifica
  alert: string
  advice: string

  private sessionUser : any//Variable para la obtencion de usuario logeado

  presupuestosF:Presupuesto[]=[]//Vector de objetos 'Presupuesto', almacenar en formato visualizacion de informacion de firebase

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private presupuestoService: PresupuestosService,//Declaracion de servicios para presupuestos
    private alertCtrl: AlertController,//Declaracion de servicios para alertas
    private auth :  AuthenticationService,//Declaracion de servicios de autenticacion
    private loadingController: LoadingController,//Declaracion de servicios de pantalla de progreso
    public menuCtrl: MenuController ) {//Declaracion de servicios para control del menu principal
      this.menuCtrl.enable(true)//Menu activado
    }

  async ngOnInit() {//Funcion inicial de la pagina
    this.sessionUser = await this.auth.getUserAuth()//Utilizacion del servicio para obtener usuario que inicio sesion mediante Firebase
    this.obtenerPresupuestos()//Llamado a funcion diseñada
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
  async obtenerPresupuestos(){//Funcion para obtener los presupuestos de la familia correspondiente al usuario logeado         
    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => {
        
        try {
          
          await this.sessionUser.pipe(take(1)).subscribe(async user =>{//Recorrido de respuesta del servicio              
            this.usuario = await this.auth.getUsuario(user.email)//Utilizacion de servicio para obtener usuario en base a consulta base de datos  
              
            this.usuario.forEach(async (element) => {
              await this.presupuestoService.obtenerFamilia(element[0].id_familia).pipe(take(1)).subscribe(fam =>{
                this.presupuestoGlobal = fam[0].presupuesto_global
                this.loadGlobal = true
              });
              
              this.presupuestos=this.presupuestoService.obtenerPresupuestos(element[0].id_familia)//Utilizacion de servicio para obtener presupuestos de la familia correspondiente al usuario en base a consulta base de datos
              this.presupuestos.pipe(take(1)).subscribe(presp =>{
                for (let index = 0; index < presp.length; index++) {
                  let aux:Presupuesto=new Presupuesto()//Variable auxilizar de clase gasto
                  //Asignacion de valores correspondientes a la lectura desde Firebase, con cambios para la visualizacion
                  aux.id=presp[index].id        
                  aux.cantidad=presp[index].cantidad
                  aux.id_familia=presp[index].id_familia
                  //Cambio de contenido de variabe segun categoria
                  if(presp[index].id_categoria=='834IqsQWzMFPdsE7TZKu'){
                    aux.id_categoria="Alimentacion"
                  }
                  if(presp[index].id_categoria=='yfXjC94YqUqIbn4zXMjx'){
                    aux.id_categoria="Servicios"
                  }
                  if(presp[index].id_categoria=='EjKGtXUIHEnwC0MKrzIn'){
                    aux.id_categoria="Educacion"
                  }
                  if(presp[index].id_categoria=='Y2xbbnUeLwCz5UhfMMJZ'){
                    aux.id_categoria="Ocio"
                  }
                  if(presp[index].id_categoria=='pZbMomfUFtw8u2aD0sEC'){
                    aux.id_categoria="Transporte"
                  }
                  if(presp[index].id_categoria=='NgNS2EM0p4UdeAQlZ4q6'){
                    aux.id_categoria="Vivienda"
                  }
                  if(presp[index].id_categoria=='Mp82DGLcR5AUOEk5DSrC'){
                    aux.id_categoria="Salud"
                  }
                  if(presp[index].id_categoria=='uPtleC6y1na6ZkkpePAd'){
                    aux.id_categoria="Otros"
                  }
                  aux.fecha=presp[index].fecha                                      
                  this.presupuestosF.push(aux) //Adicion a vector para posterio lectura 
                  
                }            
              })
            });
          })

        } catch (error) {
          this.alert = "Ocurrió un error inesperado al registrar el presupuesto"
          this.advice = 'Por favor, inténtelo de nuevo'        
          return this.genericAlert(this.alert, this.advice)
          
        } finally {
          a.dismiss().then(() => console.log('abort presenting'))//Mensaje para registro de finalizacion de proceso             
        }
        

      })
    })  

  }
}
