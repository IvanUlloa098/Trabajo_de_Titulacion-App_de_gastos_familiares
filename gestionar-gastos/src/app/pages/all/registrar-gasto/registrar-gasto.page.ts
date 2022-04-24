import { Component, OnInit } from '@angular/core';
import { Gasto } from 'src/app/domain/gasto';
import { GastosService } from 'src/app/services/gastos.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-registrar-gasto',
  templateUrl: './registrar-gasto.page.html',
  styleUrls: ['./registrar-gasto.page.scss'],
})
export class RegistrarGastoPage implements OnInit {
  gasto:Gasto=new Gasto();

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private gastoService: GastosService) { }

  ngOnInit() {
  }
  registrarGasto(){
    this.gasto.id_usuario="123"
    this.gasto.id_categoria="123"
    this.gastoService.guardar(this.gasto)
  }
}
