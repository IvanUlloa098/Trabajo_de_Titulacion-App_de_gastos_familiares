import { Component,AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {Chart} from 'chart.js';
import { GastosService } from 'src/app/services/gastos.service';
import { PresupuestosService } from 'src/app/services/presupuestos.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AlertController, MenuController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-reporte-gastos-admin',
  templateUrl: './reporte-gastos-admin.page.html',
  styleUrls: ['./reporte-gastos-admin.page.scss'],
})
export class ReporteGastosAdminPage implements AfterViewInit {

  @ViewChild('generalCanvas') private generalCanvas: ElementRef;
  @ViewChild('saludCanvas') private saludCanvas: ElementRef;
  @ViewChild('transporteCanvas') private transporteCanvas: ElementRef;
  @ViewChild('viviendaCanvas') private viviendaCanvas: ElementRef;
  @ViewChild('ocioCanvas') private ocioCanvas: ElementRef;
  @ViewChild('educacionCanvas') private educacionCanvas: ElementRef;
  @ViewChild('alimentacionCanvas') private alimentacionCanvas: ElementRef;
  @ViewChild('serviciosCanvas') private serviciosCanvas: ElementRef;
  @ViewChild('estrellaCanvas') private estrellaCanvas: ElementRef;

  gastos:any
  usuario:any
  familia:any
  usuarios:any

  presupuestos:any

  alert: string
  advice: string

  private sessionUser : any

  presp=0.0
  prespGst=0.0
  gastoTot=0.0

  gastoSalud=0.0
  gastoTransporte=0.0
  gastoVivienda=0.0
  gastoOcio=0.0
  gastoEducacion=0.0
  gastoAlimentacion=0.0
  gastoServicios=0.0

  presupuestoSalud=0.0
  presupuestoTransporte=0.0
  presupuestoVivienda=0.0
  presupuestoOcio=0.0
  presupuestoEducacion=0.0
  presupuestoAlimentacion=0.0
  presupuestoServicios=0.0

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private gastoService: GastosService,
    private presupuestoService: PresupuestosService,
    private alertCtrl: AlertController,
    private auth :  AuthenticationService,
    public menuCtrl: MenuController ) {
      this.menuCtrl.enable(true)
    }

    generalChart: any;
    saludChart: any;
    transporteChart: any;
    viviendaChart: any;
    alimentacionChart: any;
    ocioChart: any;
    serviciosChart: any;
    educacionChart: any; 
    estrellaChart: any;  

  async ngAfterViewInit() {
    this.entrada()
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
  async entrada(){
    this.sessionUser = await this.auth.getUserAuth()    
    this.sessionUser.pipe(take(1)).subscribe(async user =>{
      try {        
        this.usuario = await this.auth.getUsuario(user.email)
        this.usuario.pipe(take(1)).subscribe(async user =>{
          this.usuarios=this.gastoService.obtenerusrFamilia(user[0].id_familia)
          this.familia=this.presupuestoService.obtenerFamilia(user[0].id_familia)
          this.presupuestos=this.presupuestoService.obtenerPresupuestos(user[0].id_familia)
          this.familia.pipe(take(1)).subscribe(async fam=>{
            this.presp=fam[0].presupuesto_global
            this.usuarios.pipe(take(1)).subscribe(async user =>{
              for (let index = 0; index < user.length; index++) {
                this.gastos=this.gastoService.obtenerGastos(user[index].uid)
                this.gastos.pipe(take(1)).subscribe(async gasto =>{
                  for (let index = 0; index < gasto.length; index++) {
                    this.gastoTot+=gasto[index].monto
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
                    this.prespGst=0
                  }else {
                    this.prespGst=this.presp-this.gastoTot
                  }
                  this.presupuestos.pipe(take(1)).subscribe(async prespt =>{
                    for (let index = 0; index < prespt.length; index++) {
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
                    this.graficaGeneral()
                    this.graficaTransporte()
                    this.graficaSalud()
                    this.graficaAlimentacion()
                    this.graficaEducacion()
                    this.graficaOcio()                    
                    this.graficaServicios()
                    this.graficaVivienda()
                    this.graficaEstrella()
                  })                  
                })
              }                                         
            })
          })
        })
      } catch(error){
          console.log(error)  
          this.alert = "Ocurrió un error inesperado al cargar la informacion del usuario"
          this.advice = 'Por favor, inténtelo de nuevo'    
          return this.genericAlert(this.alert, this.advice)
      }
    })
  } 
  graficaGeneral(){
    if(this.generalChart!=null){
      this.generalChart.destroy()
    }
    this.generalChart = new Chart(this.generalCanvas.nativeElement, {
      type: 'polarArea',
      data: {
        labels: ['Presupuesto', 'Presupuesto Restante', 'Gastos Totales'],
        datasets: [{
          label: 'Cantidad en Dolares $',
          data: [this.presp, this.prespGst, this.gastoTot],
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
  graficaSalud(){    
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
  graficaVivienda(){
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
  graficaTransporte(){
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
  graficaOcio(){
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
  graficaEducacion(){
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
  graficaServicios(){
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
  graficaAlimentacion(){
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
  graficaEstrella(){
    if(this.estrellaChart!=null){
      this.estrellaChart.destroy()
    }    
    this.estrellaChart = new Chart(this.estrellaCanvas.nativeElement, {
      type: 'radar',
      data: {
        labels: ['Alimentacion', 'Servicios', 'Educacion','Ocio','Transporte','Vivienda','Salud'],
        datasets: [{
          label: 'Porcentaje de Consumo',
          data: [(this.gastoAlimentacion*100/this.presupuestoAlimentacion),
          (this.gastoServicios*100/this.presupuestoServicios),
          (this.gastoEducacion*100/this.presupuestoEducacion),
          (this.gastoOcio*100/this.presupuestoOcio),
          (this.gastoTransporte*100/this.presupuestoTransporte),
          (this.gastoVivienda*100/this.presupuestoVivienda),
          (this.gastoSalud*100/this.presupuestoSalud)
        ],
          fill: true,
          backgroundColor: 'rgba(54, 162, 235, 0.4)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(10, 10, 10)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(54, 162, 235)',
          borderWidth:1,
          pointHitRadius:5,
          pointRadius:5
          
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
