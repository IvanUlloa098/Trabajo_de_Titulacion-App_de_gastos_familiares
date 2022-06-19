import { Component,AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {Chart} from 'chart.js';
import { GastosService } from 'src/app/services/gastos.service';
import { PresupuestosService } from 'src/app/services/presupuestos.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AlertController, MenuController,LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-reporte-gastos',
  templateUrl: './reporte-gastos.page.html',
  styleUrls: ['./reporte-gastos.page.scss'],
})
export class ReporteGastosPage implements AfterViewInit{
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

  private sessionUser : any//Variable para la obtencion de usuario logeado

  presp=0.0//Variable para el presupuesto total de la familia
  prespGst=0.0//Variable para el monto restante del presupuesto total de la familia
  gastoTot=0.0//Variable para el total de los gastos de la familia

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private gastoService: GastosService,//Declaracion de servicios para gastos
    private presupuestoService: PresupuestosService,//Declaracion de servicios para presupuestos
    private alertCtrl: AlertController,//Declaracion de servicios para alertas
    private auth :  AuthenticationService,//Declaracion de servicios de autenticacion
    private loadingController: LoadingController,//Declaracion de servicios de pantalla de progreso
    public menuCtrl: MenuController ) {//Declaracion de servicios para control del menu principal
      this.menuCtrl.enable(true)//Menu activado
    }

    //Variable para la instancia del grafico
    doughnutChart: any;
    
  async ngAfterViewInit() {//Funcion inicial de la pagina    
    return await this.loadingController.create({ }).then(a => {//Llamado para pantalla de carga
      a.present().then(async () => {
        try {
          this.entrada()          
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
 
  async genericAlert(alert_message, advice){//Funcion para creacion de alerta
    const prompt = await this.alertCtrl.create({//Llamado a creacion con el mensaje antes definido   
      header: 'Lo sentimos',  
      subHeader: alert_message,
      message: advice,      
      buttons: ['Aceptar']//Boton de confirmacion
    });
    await prompt.present()
  }

  async entrada(){
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
              })
            }                                         
          })
        })
      })
      
    })
  }  
}
