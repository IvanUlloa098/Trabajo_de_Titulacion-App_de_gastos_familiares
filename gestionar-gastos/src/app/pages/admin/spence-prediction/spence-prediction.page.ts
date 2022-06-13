import { Component, OnInit } from '@angular/core';
import { GastosService } from 'src/app/services/gastos.service';

@Component({
  selector: 'app-spence-prediction',
  templateUrl: './spence-prediction.page.html',
  styleUrls: ['./spence-prediction.page.scss'],
})
export class SpencePredictionPage implements OnInit {

  constructor(private gastosService: GastosService) { }

  async ngOnInit() {
    const id = "HJyLcJIdpmETrn9VeD9y";

    await this.gastosService.regression(id).then((res) => console.log(res));
  }

}
