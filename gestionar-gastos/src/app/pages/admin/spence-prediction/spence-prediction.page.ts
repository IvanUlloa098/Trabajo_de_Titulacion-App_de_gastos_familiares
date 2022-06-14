import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GastosService } from 'src/app/services/gastos.service';
import {Chart} from 'chart.js';
import { type } from 'os';

@Component({
  selector: 'app-spence-prediction',
  templateUrl: './spence-prediction.page.html',
  styleUrls: ['./spence-prediction.page.scss'],
})
export class SpencePredictionPage implements AfterViewInit {

  @ViewChild('generalCanvas') private generalCanvas: ElementRef;
  
  private regressionRes: any;
  private generalChart: any;  

  constructor(private gastosService: GastosService) { }

  async ngAfterViewInit() {
    const id = "7Jq8PcqKZso18jwqjhoN";

    this.regressionRes = await this.gastosService.regression(id).then((res) => 
      this.graficaGeneral(res)
    );
  }

  graficaGeneral(data: any){
    // console.log(data);

    let pairs:any[] = [];
    let regr :any[] = [];

    data.raw.forEach(element => {
      const aux = {x:element[0], y:element[1]}
      pairs.push(aux)
    });

    data.points.forEach(element => {
      const aux = {x:element[0], y:element[1]}
      regr.push(aux)
    });

    console.log(regr);

    this.generalChart = new Chart(this.generalCanvas.nativeElement, {
      type: 'scatter',
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
      data: {
        datasets: [{
          label: 'Gastos a lo largo del tiempo',
          data: pairs,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        },
        {
          label: 'Linea de predicción',
          data: regr,
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgb(255, 159, 64)',
          borderWidth: 2,
          type: 'line',
          pointRadius: 0
        }]
      },
      
    });
  }

}
