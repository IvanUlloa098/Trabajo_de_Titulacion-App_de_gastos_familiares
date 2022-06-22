import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonRouterOutlet, LoadingController, MenuController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import {Chart} from 'chart.js';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import { GastosService } from 'src/app/services/gastos.service';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { PresupuestosService } from 'src/app/services/presupuestos.service';
import { DATE_PIPE_DEFAULT_TIMEZONE } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {

  //Este elemento necesita el parametro con el mismo nombre del elemento en la pagina html
  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;

  //Variables para almacenamiento de respuestas desde Firebase de consultas de cada coleccion
  gastos:any
  usuario:any
  familia:any
  usuarios:any

  //Variables para una notificacion especifica
  alert: string
  advice: string
  startMes: string

  loaded: boolean = false;

  //Variable para la instancia del grafico
  doughnutChart: any;

  private sessionUser : any//Variable para la obtencion de usuario logeado
  private sessionEmail: any

  presp=0.0//Variable para el presupuesto total de la familia
  prespGst=0.0//Variable para el monto restante del presupuesto total de la familia
  gastoTot=0.0//Variable para el total de los gastos de la familia
  

  constructor(public menuCtrl: MenuController,
              private auth :  AuthenticationService,
              private router: Router,
              private loadingController: LoadingController,
              private alertCtrl: AlertController,
              private userService: UserService,
              private gastoService: GastosService,
              private localNotifications: LocalNotifications,
              private presupuestoService: PresupuestosService,
              private routerOutlet: IonRouterOutlet) { 
                this.routerOutlet.swipeGesture = false
              }

  async ngOnInit() {
    
    // Control de la interacción del usuario usando una rueda de carga
    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => { 

        // Obtención del usuario que actualmente tiene la sesión abierta
        await this.auth.getUserAuth().pipe(take(1)).subscribe(async user =>{
          
          // Control de errores
          try {
            this.sessionEmail = user.email
            this.menuCtrl.enable(true) // Visualizar el menú solo al iniciar sesión
            
            // Obtener los datos del usurio de FireStore dado- 
            //    el email proporcionado por la API de autentificación
            this.sessionUser = await this.auth.getUsuario(this.sessionEmail)
      
            await this.sessionUser.pipe(take(1)).subscribe(async res=> {
              
              //  Actualizar la págicna con las opciones del mennu de acuerdo a su rol
              if(!this.auth.sideMenu) {
                window.location.reload();
              }
              
              // Verificar si el usuario está asignado a una familia
              if(res[0].id_familia === '-1'){
                this.router.navigate(["/login"])
              }

              // Verificar si el usuario tiene un rolde administrador
              if(res[0].role == "A"){  

                this.startMes = "Saludos, "+res[0].displayName+". Comienza a ahorra contigo y tu familia. Tu eres el jefe, puedes monitorear los gastos."

                //  Todos los gastos familiares serán mostrados                
                this.gastos = this.gastoService.obtenerGastosFamilia(res[0].id_familia)

                this.gastos.pipe(take(1)).subscribe(async gasto =>{                  
                  var sumatoria=0.0
                  for (let index = 0; index < gasto.length; index++) {
                    var aux=new Date(gasto[index].fecha)
                    var actual=new Date()
                    
                    if(aux.getDate()==actual.getDate()){
                      sumatoria+=gasto[index].monto
                    }
                    
                    
                  }
                  this.localNotifications.schedule({
                    text: "Gastos del dia "+sumatoria,
                    trigger: {at: new Date()},                 
                  });

                  this.entrada(a)
                })            
              }else {
                this.startMes = "Saludos, "+res[0].displayName+". Comienza a ahorra contigo y tu familia."
                
                //  Obtención de todos los datos personales
                this.gastos=this.gastoService.obtenerGastos(res[0].uid) 

                //  Mostrar gastos personales
                this.gastos.forEach(element => {
                  for (let index = 0; index < element.length; index++) {
                    let fecha=new Date(element[index].fecha);
                    this.localNotifications.schedule({
                      text: "Gasto Registrado"+element[index].descripcion+"\n De: "+element[index].monto,
                      trigger: {at: fecha},                 
                    });
                  }

                  this.entrada(a)
                });
              }            
  
              })
               
            } catch (error) {
              console.log(error);
              this.alert = "Ocurrió un error al cargar sus datos"
              this.advice = 'Por favor, inténtelo de nuevo'

              this.genericAlert(this.alert, this.advice)
              this.router.navigate(["/login"])
            } finally {
              //  Terminar la carga de la página
              a.dismiss().then(() => console.log('abort presenting'));
              
            }
  
          })

       

      }) 

    })

  
  } 

  async entrada(a){
    this.sessionUser = await this.auth.getUserAuth()//Utilizacion del servicio para obtener usuario que inicio sesion mediante Firebase   
    this.sessionUser.pipe(take(1)).subscribe(async user =>{//Recorrido de respuesta del servicio      
      this.usuario = await this.auth.getUsuario(user.email)//Utilizacion de servicio para obtener usuario en base a consulta base de datos
      this.usuario.pipe(take(1)).subscribe(user =>{
        this.usuarios=this.gastoService.obtenerusrFamilia(user[0].id_familia)//Utilizacion de servicio para obtener los usuarios miembros de la familia del usuario en base a consulta base de datos
        this.familia=this.presupuestoService.obtenerFamilia(user[0].id_familia)//Utilizacion de servicio para obtener familia del usuario en base a consulta base de datos
        this.familia.pipe(take(1)).subscribe(fam=>{
          this.presp=fam[0].presupuesto_global//Asignacion de valor
          this.usuarios.pipe(take(1)).subscribe(user =>{
            for (let index = 0; index < user.length; index++) {
              this.gastos=this.gastoService.obtenerGastos(user[index].uid)//Utilizacion de servicio para obtener gastos del usuario en base a consulta base de datos
              this.gastos.pipe(take(1)).subscribe(gasto =>{
                for (let index = 0; index < gasto.length; index++) {
                  this.gastoTot+=gasto[index].monto//Sumatoria de todos los gastos
                }
                if(this.gastoTot>=this.presp){
                  this.prespGst=0//En caso de que el gasto total sea mayor al presupuesto general, el presupuesto restante es 0
                }else {
                  this.prespGst=this.presp-this.gastoTot//Caso contrario el gasto total es la resta del presupuesto menos los gastos
                }                  
                if(this.doughnutChart!=null){//En caso de que el grafico este inicializado
                  this.doughnutChart.destroy()//Destruir la instancia
                }                                      
                this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {//Declaracion de la grafica 
                  type: 'polarArea',//Tipo
                  options:{
                    scales:{
                      r: {
                        grid: {
                          color: 'rgb(38, 38, 38)'
                        }
                      }
                    }
                  },
                  data: {//Datos de la grafica
                    labels: ['Presupuesto', 'Presupuesto Restante', 'Gastos Totales'],//Etiquetas
                    datasets: [{
                      label: 'Cantidad en Dolares $',
                      data: [this.presp, this.prespGst, this.gastoTot],//Datos a mostrar acorde a las etiquetas
                      backgroundColor: [
                        //Colores definidos para las partes del area a graficar
                        'rgba(255, 159, 64, 0.4)',
                        'rgba(54, 162, 235, 0.4)',                          
                        'rgba(255, 99, 132, 0.4)'                                      
                      ],
                      
                      borderColor:['#ff9f40','#36a2eb','#ff6384'],//Color de borde de area, sin focus
                      hoverBackgroundColor:['#ff9f40','#36a2eb','#ff6384'],//Color de fondo de area con enfoque
                      hoverBorderColor:['#ff9f40','#36a2eb','#ff6384'],//Color de borde de area, con focus
                      borderWidth:[1,1,1],//Tamaño de borde de las partes, sin enfoque
                      hoverBorderWidth:[1,1,1]//Tamaño de borde de las partes, sin enfoque                       
                    }]
                  }
                });

                this.loaded = true
                a.dismiss().then(() => console.log('abort presenting'))//Termino de pantalla de carga   
              })
            }            
            
          })
        })
      })
      
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

  async dismiss() {
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }
  async cargarNotificaciones(){
    
  }

}
