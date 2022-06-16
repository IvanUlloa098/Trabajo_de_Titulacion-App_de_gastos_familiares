import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GastosService } from 'src/app/services/gastos.service';
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import { UserService } from 'src/app/services/user/user.service';
import { take } from 'rxjs/operators';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

Chart.register(zoomPlugin);

@Component({
  selector: 'app-spence-prediction',
  templateUrl: './spence-prediction.page.html',
  styleUrls: ['./spence-prediction.page.scss'],
})
export class SpencePredictionPage implements AfterViewInit {

  @ViewChild('generalCanvas') private generalCanvas: ElementRef;
  
  private regressionRes: any;
  private generalChart: any;  
  private sessionUser: any;
  private id: any;

  categories: any;
  isSpenceSelected: boolean;
  gasto: any;

  alert: string
  advice: string

  constructor(private gastosService: GastosService, 
              private userService: UserService,
              private loadingController: LoadingController,
              private alertCtrl: AlertController,
              private auth: AuthenticationService) {
                this.isSpenceSelected = false;
              }

  async ngAfterViewInit() {
    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => {
        this.sessionUser = await this.auth.getUserAuth();

        await this.gastosService.getCategories().pipe(take(1)).subscribe(cat => {
          this.categories = cat;
        },
        err => {
          console.log('HTTP Error', err);
          this.alert = "Ocurrió un error al cargar sus datos"
          this.advice = 'Por favor, inténtelo de nuevo'
  
          a.dismiss().then(() => console.log('abort presenting'));
          this.genericAlert(this.alert, this.advice)
        },
        () => console.log('HTTP request stream done'));

        await this.sessionUser.pipe(take(1)).subscribe(async user =>{
          
          const aux = await this.auth.getUsuario(user.email)
          await aux.pipe(take(1)).subscribe( async res=> {
            this.id = res[0];
            this.id = this.id.id_familia;
                        
            this.regressionRes = await this.gastosService.regression(this.id).then((res) => 
              this.graficaGeneral(res, a)
            ).catch(err => {
              console.log('HTTP Error', err);
              this.alert = "Ocurrió un error al cargar sus datos"
              this.advice = 'Por favor, inténtelo de nuevo'
      
              a.dismiss().then(() => console.log('abort presenting'));
              this.genericAlert(this.alert, this.advice)
            });
          })
        },
        err => {
          console.log('HTTP Error', err);
          this.alert = "Ocurrió un error al cargar sus datos"
          this.advice = 'Por favor, inténtelo de nuevo'
  
          a.dismiss().then(() => console.log('abort presenting'));
          this.genericAlert(this.alert, this.advice)
        },
        () => console.log('HTTP request stream done'));

      })
    })
    
  }

  graficaGeneral(data: any, a: any){

    this.generalChart = new Chart(this.generalCanvas.nativeElement, {
      type: 'scatter',
      options: {
        responsive:true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day'
            }
          },
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'xy',
            }
          }
        },

        onClick: async (e) => {
          this.isSpenceSelected = false;
          try {

            return await this.loadingController.create({ }).then(b => {
              b.present().then(async () => {
                const element = this.generalChart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false)
                const currentPoint = data.data.dataId[element[0].index];
                console.log(currentPoint);          

                const aux = await (await this.userService.getUserbyId(currentPoint[1]))
                aux.pipe(take(1)).subscribe(async (res) => {

                  const aux2 = await this.gastosService.obtenerGastoPorId(currentPoint[2]);
                  aux2.pipe(take(1)).subscribe(async (res2) => {
                    this.gasto = {
                      user: res[0],
                      spence: res2[0]
                    };
                    
                    this.categories.forEach(element => {
                      if (element.id === this.gasto.spence.id_categoria){
                        this.gasto.category = element;
                      }
                      
                    });                
                    
                    this.isSpenceSelected = true;
                    b.dismiss().then(() => console.log('abort presenting'));

                  },
                  err => {
                    console.log('HTTP Error', err);
                    this.alert = "Ocurrió un error al cargar sus datos"
                    this.advice = 'Por favor, inténtelo de nuevo'
            
                    b.dismiss().then(() => console.log('abort presenting'));
                    this.genericAlert(this.alert, this.advice)
                  },
                  () => console.log('HTTP request stream done'));
                },
                err => {
                  console.log('HTTP Error', err);
                  this.alert = "Ocurrió un error al cargar sus datos"
                  this.advice = 'Por favor, inténtelo de nuevo'
          
                  b.dismiss().then(() => console.log('abort presenting'));
                  this.genericAlert(this.alert, this.advice)
                },
                () => console.log('HTTP request stream done'));
              });
            });

          } catch (error) {
            console.log("NO POINT> "+error)
            this.alert = "Ocurrió un error al cargar sus datos"
            this.advice = 'Por favor, inténtelo de nuevo'
    
            a.dismiss().then(() => console.log('abort presenting'));
            this.genericAlert(this.alert, this.advice)
          }

        }
      },
      data: {
        datasets: [{
          label: 'Gastos a lo largo del tiempo',
          data: data.data.inputDate,
          showLine: true,
          pointRadius: 6,
          tension: 0.15,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        },
        {
          label: 'Linea de predicción',
          data: data.data.pointsDate,
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgb(255, 159, 64)',
          borderWidth: 2,
          type: 'line',
          pointRadius: 0
        }]
      },
      
    });

    a.dismiss().then(() => console.log('abort presenting'));
  }

  async dismiss() {
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

  async genericAlert(alert_message, advice){

    const prompt = await this.alertCtrl.create({  
      header: 'Lo sentimos',  
      subHeader: alert_message,
      message: advice,  
      
      buttons: [
        {  
          text: 'Accept'
        }  
      ]  
    }); 

    await prompt.present()

  }

}
