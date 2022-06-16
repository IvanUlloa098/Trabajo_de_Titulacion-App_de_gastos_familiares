import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GastosService } from 'src/app/services/gastos.service';
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import { UserService } from 'src/app/services/user/user.service';
import { take } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';

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

  categories: any;
  isSpenceSelected: boolean;
  gasto: any;

  constructor(private gastosService: GastosService, 
              private userService: UserService,
              private loadingController: LoadingController) {
                this.isSpenceSelected = false;
              }

  async ngAfterViewInit() {
    const id = "7Jq8PcqKZso18jwqjhoN";

    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => {
        await this.gastosService.getCategories().pipe(take(1)).subscribe(cat => {
          this.categories = cat;
        });
    
        this.regressionRes = await this.gastosService.regression(id).then((res) => 
          this.graficaGeneral(res, a)
        );

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

                const aux = await this.userService.getUserbyId(currentPoint[1])
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

                  });

            })

              })
            })

          } catch (error) {
            console.log("NO POINT> "+error)
          }

        }
      },
      data: {
        datasets: [{
          label: 'Gastos a lo largo del tiempo',
          data: data.data.inputDate,
          showLine: true,
          pointRadius: 6,
          tension: 0.2,
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

}
