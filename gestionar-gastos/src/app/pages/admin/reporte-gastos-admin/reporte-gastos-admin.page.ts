import { Component,AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {Chart} from 'chart.js';
import { GastosService } from 'src/app/services/gastos.service';
import { PresupuestosService } from 'src/app/services/presupuestos.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AlertController, MenuController,LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-reporte-gastos-admin',
  templateUrl: './reporte-gastos-admin.page.html',
  styleUrls: ['./reporte-gastos-admin.page.scss'],
})
export class ReporteGastosAdminPage implements AfterViewInit {
  //Estos elementos necesitan el parametro con el mismo nombre del elemento en la pagina html
  @ViewChild('generalCanvas') private generalCanvas: ElementRef;//Referencia a espacio canvas de grafico general

  //Referencias a los espacios canvas para graficos de presupuesto de las diferentes categorias de gasto
  @ViewChild('saludCanvas') private saludCanvas: ElementRef;
  @ViewChild('transporteCanvas') private transporteCanvas: ElementRef;
  @ViewChild('viviendaCanvas') private viviendaCanvas: ElementRef;
  @ViewChild('ocioCanvas') private ocioCanvas: ElementRef;
  @ViewChild('educacionCanvas') private educacionCanvas: ElementRef;
  @ViewChild('alimentacionCanvas') private alimentacionCanvas: ElementRef;
  @ViewChild('serviciosCanvas') private serviciosCanvas: ElementRef;

  @ViewChild('estrellaCanvas') private estrellaCanvas: ElementRef;//Referencia a espacio canvas de grafico de contraste de presupuestos

  //Variables para almacenamiento de respuestas desde Firebase de consultas de cada coleccion
  gastos:any
  usuario:any
  familia:any
  usuarios:any
  presupuestos:any

  //Variables para una notificacion especifica
  alert: string
  advice: string

  private sessionUser : any//Variable para la obtencion de usuario logeado

  presp=0.0//Variable para el presupuesto total de la familia
  prespGst=0.0//Variable para el monto restante del presupuesto total de la familia
  gastoTot=0.0//Variable para el total de los gastos de la familia

  //Variables para los totales de gastos en cada categoria
  gastoSalud=0.0
  gastoTransporte=0.0
  gastoVivienda=0.0
  gastoOcio=0.0
  gastoEducacion=0.0
  gastoAlimentacion=0.0
  gastoServicios=0.0

  //Variables para las cantidades de presupuesto de cada categoria
  presupuestoSalud=0.0
  presupuestoTransporte=0.0
  presupuestoVivienda=0.0
  presupuestoOcio=0.0
  presupuestoEducacion=0.0
  presupuestoAlimentacion=0.0
  presupuestoServicios=0.0

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

    //Variables para las instancias de los diferentes graficos
    generalChart: any;
    saludChart: any;
    transporteChart: any;
    viviendaChart: any;
    alimentacionChart: any;
    ocioChart: any;
    serviciosChart: any;
    educacionChart: any; 
    estrellaChart: any;  

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
        this.presupuestos=this.presupuestoService.obtenerPresupuestos(user[0].id_familia)//Utilizacion de servicio para obtener presupuestos de la familia en base a consulta base de datos
        this.familia.pipe(take(1)).subscribe(fam=>{
          this.presp=fam[0].presupuesto_global//Asignacion de valor
          this.usuarios.pipe(take(1)).subscribe(user =>{
            for (let index = 0; index < user.length; index++) {
              this.gastos=this.gastoService.obtenerGastos(user[index].uid)//Utilizacion de servicio para obtener gastos del usuario en base a consulta base de datos
              this.gastos.pipe(take(1)).subscribe(gasto =>{
                for (let index = 0; index < gasto.length; index++) {
                  this.gastoTot+=gasto[index].monto //Sumatoria de todos los gastos
                  //Calculo de gastos de las diferentes categorias, se diferencian mediante codigo almacenado en firebase
                  if(gasto[index].id_categoria=="834IqsQWzMFPdsE7TZKu"){
                    this.gastoAlimentacion+=gasto[index].monto
                  }
                  if(gasto[index].id_categoria=="yfXjC94YqUqIbn4zXMjx"){
                    this.gastoServicios+=gasto[index].monto
                  }
                  if(gasto[index].id_categoria=="EjKGtXUIHEnwC0MKrzIn"){
                    this.gastoEducacion=gasto[index].monto
                  }
                  if(gasto[index].id_categoria=="Y2xbbnUeLwCz5UhfMMJZ"){
                    this.gastoOcio=gasto[index].monto
                  }
                  if(gasto[index].id_categoria=="pZbMomfUFtw8u2aD0sEC"){
                    this.gastoTransporte=gasto[index].monto
                  }
                  if(gasto[index].id_categoria=="NgNS2EM0p4UdeAQlZ4q6"){
                    this.gastoVivienda=gasto[index].monto
                  }
                  if(gasto[index].id_categoria=="Mp82DGLcR5AUOEk5DSrC"){
                    this.gastoSalud=gasto[index].monto
                  }
                }
                if(this.gastoTot>=this.presp){
                  this.prespGst=0//En caso de que el gasto total sea mayor al presupuesto general, el presupuesto restante es 0
                }else {
                  this.prespGst=this.presp-this.gastoTot//Caso contrario el gasto total es la resta del presupuesto menos los gastos
                }
                this.presupuestos.pipe(take(1)).subscribe(prespt =>{
                  for (let index = 0; index < prespt.length; index++) {
                    //Asignacion de valores de las diferentes categorias, se diferencian mediante codigo almacenado en firebase
                    if(prespt[index].id_categoria=="834IqsQWzMFPdsE7TZKu"){
                      this.presupuestoAlimentacion=prespt[index].cantidad
                    }
                    if(prespt[index].id_categoria=="yfXjC94YqUqIbn4zXMjx"){
                      this.presupuestoServicios=prespt[index].cantidad
                    }
                    if(prespt[index].id_categoria=="EjKGtXUIHEnwC0MKrzIn"){
                      this.presupuestoEducacion=prespt[index].cantidad
                    }
                    if(prespt[index].id_categoria=="Y2xbbnUeLwCz5UhfMMJZ"){
                      this.presupuestoOcio=prespt[index].cantidad
                    }
                    if(prespt[index].id_categoria=="pZbMomfUFtw8u2aD0sEC"){
                      this.presupuestoTransporte=prespt[index].cantidad
                    }
                    if(prespt[index].id_categoria=="NgNS2EM0p4UdeAQlZ4q6"){
                      this.presupuestoVivienda=prespt[index].cantidad
                    }
                    if(prespt[index].id_categoria=="Mp82DGLcR5AUOEk5DSrC"){
                      this.presupuestoSalud=prespt[index].cantidad
                    }                      
                  }
                  //Llamado a las funciones correspondientes para generar un grafico para cada categoria
                  this.graficaGeneral() //General
                  this.graficaTransporte()
                  this.graficaSalud()
                  this.graficaAlimentacion()
                  this.graficaEducacion()
                  this.graficaOcio()                    
                  this.graficaServicios()
                  this.graficaVivienda()
                  this.graficaEstrella() //Comparativa entre presupuestos
                })                  
              })
            }                                         
          })
        })
      })      
    })
  } 
  graficaGeneral(){//Inicializacion de grafica 'Polar Area' para comparacion de presupuesto total contra gastos totales
    if(this.generalChart!=null){//En caso de que el grafico este inicializado
      this.generalChart.destroy()//Destruir la instancia
    }
    this.generalChart = new Chart(this.generalCanvas.nativeElement, {//Declaracion de la grafica 
      type: 'polarArea',//Tipo
      data: {//Datos de la grafica
        labels: ['Presupuesto', 'Presupuesto Restante', 'Gastos Totales'],//Etiquetas
        datasets: [{
          label: 'Cantidad en Dolares $',//Etiqueta
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
  }
  graficaSalud(){//Iniciacion grafica 'Polar Area' para comparacion de presupuesto de salud contra gastos de la misma categoria
    if(this.saludChart!=null){
      this.saludChart.destroy()
    }
    var aux=0.0    
    if (this.gastoSalud>=this.presupuestoSalud){
      aux=0
    } else{
      aux=this.presupuestoSalud-this.gastoSalud
    }
    this.saludChart = new Chart(this.saludCanvas.nativeElement, {
      type: 'polarArea',
      data: {
        labels: ['Presupuesto', 'Presupuesto Restante', 'Gastos Totales'],
        datasets: [{
          label: 'Cantidad en Dolares $',
          data: [this.presupuestoSalud, aux, this.gastoSalud],
          backgroundColor: [
            'rgba(255, 159, 64, 0.4)',
            'rgba(54, 162, 235, 0.4)',                          
            'rgba(255, 99, 132, 0.4)'                                      
          ],
          borderColor:['#ff9f40','#36a2eb','#ff6384'],
          hoverBackgroundColor:['#ff9f40','#36a2eb','#ff6384'],
          hoverBorderColor:['#ff9f40','#36a2eb','#ff6384'],
          borderWidth:[1,1,1],
          hoverBorderWidth:[1,1,1]
        }]
      }
    });
  }
  graficaVivienda(){//Iniciacion grafica 'Polar Area' para comparacion de presupuesto de vivienda contra gastos de la misma categoria
    if(this.viviendaChart!=null){
      this.viviendaChart.destroy()
    }
    var aux=0.0
    if (this.gastoVivienda>=this.presupuestoVivienda){
      aux=0.0
    } else{
      aux=this.presupuestoVivienda-this.gastoVivienda
    }
    this.viviendaChart = new Chart(this.viviendaCanvas.nativeElement, {
      type: 'polarArea',
      data: {
        labels: ['Presupuesto', 'Presupuesto Restante', 'Gastos Totales'],
        datasets: [{
          label: 'Cantidad en Dolares $',
          data: [this.presupuestoVivienda, aux, this.gastoVivienda],
          backgroundColor: [
            'rgba(255, 159, 64, 0.4)',
            'rgba(54, 162, 235, 0.4)',                          
            'rgba(255, 99, 132, 0.4)'                                      
          ],
          borderColor:['#ff9f40','#36a2eb','#ff6384'],
          hoverBackgroundColor:['#ff9f40','#36a2eb','#ff6384'],
          hoverBorderColor:['#ff9f40','#36a2eb','#ff6384'],
          borderWidth:[1,1,1],
          hoverBorderWidth:[1,1,1]
        }]
      }
    });
  }
  graficaTransporte(){//Iniciacion grafica 'Polar Area' para comparacion de presupuesto de transporte contra gastos de la misma categoria
    if(this.transporteChart!=null){
      this.transporteChart.destroy()
    }
    var aux=0.0
    if (this.gastoTransporte>=this.presupuestoTransporte){
      aux=0
    } else{
      aux=this.presupuestoTransporte-this.gastoTransporte
    }
    this.transporteChart = new Chart(this.transporteCanvas.nativeElement, {
      type: 'polarArea',
      data: {
        labels: ['Presupuesto', 'Presupuesto Restante', 'Gastos Totales'],
        datasets: [{
          label: 'Cantidad en Dolares $',
          data: [this.presupuestoTransporte, aux, this.gastoTransporte],
          backgroundColor: [
            'rgba(255, 159, 64, 0.4)',
            'rgba(54, 162, 235, 0.4)',                          
            'rgba(255, 99, 132, 0.4)'                                      
          ],
          borderColor:['#ff9f40','#36a2eb','#ff6384'],
          hoverBackgroundColor:['#ff9f40','#36a2eb','#ff6384'],
          hoverBorderColor:['#ff9f40','#36a2eb','#ff6384'],
          borderWidth:[1,1,1],
          hoverBorderWidth:[1,1,1]
        }]
      }
    });
  }
  graficaOcio(){//Iniciacion grafica 'Polar Area' para comparacion de presupuesto de ocio contra gastos de la misma categoria
    if(this.ocioChart!=null){
      this.ocioChart.destroy()
    }
    var aux=0.0
    if (this.gastoOcio>=this.presupuestoOcio){
      aux=0
    } else{
      aux=this.presupuestoOcio-this.gastoOcio
    }
    this.ocioChart = new Chart(this.ocioCanvas.nativeElement, {
      type: 'polarArea',
      data: {
        labels: ['Presupuesto', 'Presupuesto Restante', 'Gastos Totales'],
        datasets: [{
          label: 'Cantidad en Dolares $',
          data: [this.presupuestoOcio, aux, this.gastoOcio],
          backgroundColor: [
            'rgba(255, 159, 64, 0.4)',
            'rgba(54, 162, 235, 0.4)',                          
            'rgba(255, 99, 132, 0.4)'                                      
          ],
          borderColor:['#ff9f40','#36a2eb','#ff6384'],
          hoverBackgroundColor:['#ff9f40','#36a2eb','#ff6384'],
          hoverBorderColor:['#ff9f40','#36a2eb','#ff6384'],
          borderWidth:[1,1,1],
          hoverBorderWidth:[1,1,1]
        }]
      }
    });
  }
  graficaEducacion(){//Iniciacion grafica 'Polar Area' para comparacion de presupuesto de educacion contra gastos de la misma categoria
    if(this.educacionChart!=null){
      this.educacionChart.destroy()
    }
    var aux=0.0
    if (this.gastoEducacion>=this.presupuestoEducacion){
      aux=0
    } else{
      aux=this.presupuestoEducacion-this.gastoEducacion
    }
    this.educacionChart = new Chart(this.educacionCanvas.nativeElement, {
      type: 'polarArea',
      data: {
        labels: ['Presupuesto', 'Presupuesto Restante', 'Gastos Totales'],
        datasets: [{
          label: 'Cantidad en Dolares $',
          data: [this.presupuestoEducacion, aux, this.gastoEducacion],
          backgroundColor: [
            'rgba(255, 159, 64, 0.4)',
            'rgba(54, 162, 235, 0.4)',                          
            'rgba(255, 99, 132, 0.4)'                                      
          ],
          borderColor:['#ff9f40','#36a2eb','#ff6384'],
          hoverBackgroundColor:['#ff9f40','#36a2eb','#ff6384'],
          hoverBorderColor:['#ff9f40','#36a2eb','#ff6384'],
          borderWidth:[1,1,1],
          hoverBorderWidth:[1,1,1]
        }]
      }
    });
  }
  graficaServicios(){//Iniciacion grafica 'Polar Area' para comparacion de presupuesto de servicios contra gastos de la misma categoria
    if(this.serviciosChart!=null){
      this.serviciosChart.destroy()
    }
    var aux=0.0
    if (this.gastoServicios>=this.presupuestoServicios){
      aux=0
    } else{
      aux=this.presupuestoServicios-this.gastoServicios
    }
    this.serviciosChart = new Chart(this.serviciosCanvas.nativeElement, {
      type: 'polarArea',
      data: {
        labels: ['Presupuesto', 'Presupuesto Restante', 'Gastos Totales'],
        datasets: [{
          label: 'Cantidad en Dolares $',
          data: [this.presupuestoServicios, aux, this.gastoServicios],
          backgroundColor: [
            'rgba(255, 159, 64, 0.4)',
            'rgba(54, 162, 235, 0.4)',                          
            'rgba(255, 99, 132, 0.4)'                                      
          ],
          borderColor:['#ff9f40','#36a2eb','#ff6384'],
          hoverBackgroundColor:['#ff9f40','#36a2eb','#ff6384'],
          hoverBorderColor:['#ff9f40','#36a2eb','#ff6384'],
          borderWidth:[1,1,1],
          hoverBorderWidth:[1,1,1]
        }]
      }
    });
  }
  graficaAlimentacion(){//Iniciacion grafica 'Polar Area' para comparacion de presupuesto de alimentacion contra gastos de la misma categoria
    if(this.alimentacionChart!=null){
      this.alimentacionChart.destroy()
    }
    var aux=0.0
    if (this.gastoAlimentacion>=this.presupuestoAlimentacion){
      aux=0
    } else{
      aux=this.presupuestoAlimentacion-this.gastoAlimentacion
    }
    this.alimentacionChart = new Chart(this.alimentacionCanvas.nativeElement, {
      type: 'polarArea',
      data: {
        labels: ['Presupuesto', 'Presupuesto Restante', 'Gastos Totales'],
        datasets: [{
          label: 'Cantidad en Dolares $',
          data: [this.presupuestoAlimentacion, aux, this.gastoAlimentacion],
          backgroundColor: [
            'rgba(255, 159, 64, 0.4)',
            'rgba(54, 162, 235, 0.4)',                          
            'rgba(255, 99, 132, 0.4)'                                      
          ],
          borderColor:['#ff9f40','#36a2eb','#ff6384'],
          hoverBackgroundColor:['#ff9f40','#36a2eb','#ff6384'],
          hoverBorderColor:['#ff9f40','#36a2eb','#ff6384'],
          borderWidth:[1,1,1],
          hoverBorderWidth:[1,1,1]
        }]
      }
    });
  }
  graficaEstrella(){//Iniciacion grafica 'Radar' para comparacion de los diferentes presupuestos
    if(this.estrellaChart!=null){
      this.estrellaChart.destroy()
    }    
    this.estrellaChart = new Chart(this.estrellaCanvas.nativeElement, {
      type: 'radar',//Tipo
      data: {
        labels: ['Alimentacion', 'Servicios', 'Educacion','Ocio','Transporte','Vivienda','Salud'],//Etiquetas de categorias
        datasets: [{
          label: 'Porcentaje de Consumo',
          //Calculo de porcentaje para cada categoria
          //Regla de 3, siendo 100% el presupuesto, calculo de porcentaje de gasto
          data: [(this.gastoAlimentacion*100/this.presupuestoAlimentacion),
          (this.gastoServicios*100/this.presupuestoServicios),
          (this.gastoEducacion*100/this.presupuestoEducacion),
          (this.gastoOcio*100/this.presupuestoOcio),
          (this.gastoTransporte*100/this.presupuestoTransporte),
          (this.gastoVivienda*100/this.presupuestoVivienda),
          (this.gastoSalud*100/this.presupuestoSalud)
        ],
          fill: true,//Relleno de area conformada por dos lineas
          backgroundColor: 'rgba(54, 162, 235, 0.4)',//Color de relleno
          borderColor: 'rgb(54, 162, 235)',//Color de borde
          pointBackgroundColor: 'rgb(10, 10, 10)',//Color de punto final de linea, sin focus
          pointBorderColor: '#fff',//Color de borde del punto final de linea, sin focus
          pointHoverBackgroundColor: '#fff',//Color de punto final de linea, con focus
          pointHoverBorderColor: 'rgb(54, 162, 235)',//Color de borde del punto final de linea, con focus
          borderWidth:1,//Ancho de bordes
          pointHitRadius:5,//Radio de interaccion de punto
          pointRadius:5//Radio de punto
          
        }]
      },
      options: {
        elements: {
          line: {
            borderWidth: 3
          }
        }
      },
    });
  }
}
