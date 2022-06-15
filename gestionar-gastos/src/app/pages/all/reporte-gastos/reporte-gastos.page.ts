import { Component,AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {Chart} from 'chart.js';
import { GastosService } from 'src/app/services/gastos.service';
import { PresupuestosService } from 'src/app/services/presupuestos.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AlertController, MenuController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-reporte-gastos',
  templateUrl: './reporte-gastos.page.html',
  styleUrls: ['./reporte-gastos.page.scss'],
})
export class ReporteGastosPage implements AfterViewInit{

  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;

  gastos:any
  usuario:any
  familia:any
  usuarios:any

  alert: string
  advice: string

  private sessionUser : any

  presp=0.0
  prespGst=0.0
  gastoTot=0.0

  contador=0
  limite=0

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private gastoService: GastosService,
    private presupuestoService: PresupuestosService,
    private alertCtrl: AlertController,
    private auth :  AuthenticationService,
    public menuCtrl: MenuController ) {
      this.menuCtrl.enable(true)
    }

  doughnutChart: any;
    
  ngAfterViewInit() {    
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
          this.familia.pipe(take(1)).subscribe(async fam=>{
            this.presp=fam[0].presupuesto_global
            this.usuarios.pipe(take(1)).subscribe(async user =>{
              for (let index = 0; index < user.length; index++) {
                this.gastos=this.gastoService.obtenerGastos(user[index].uid)
                this.gastos.pipe(take(1)).subscribe(async gasto =>{
                  for (let index = 0; index < gasto.length; index++) {
                    this.gastoTot+=gasto[index].monto
                  }
                  if(this.gastoTot>=this.presp){
                    this.prespGst=this.presp
                  }else {
                    this.prespGst=this.gastoTot                
                  }                  
                  if(this.doughnutChart!=null){
                    this.doughnutChart.destroy()
                  }                                      
                  this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
                    type: 'polarArea',
                    data: {
                      labels: ['Presupuesto', 'Presupuesto Gastado', 'Gastos Totales'],
                      datasets: [{
                        label: 'Cantidad en Dolares $',
                        data: [this.presp, this.prespGst, this.gastoTot],
                        backgroundColor: [
                          'rgba(255, 159, 64, 0.2)',
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(54, 162, 235, 0.2)'            
                        ],
                        hoverBackgroundColor: [
                          '#FFCE56',
                          '#FF6384',
                          '#36A2EB'
                        ]
                      }]
                    }
                  });                  
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
}
