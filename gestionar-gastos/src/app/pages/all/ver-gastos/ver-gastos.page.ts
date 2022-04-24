import { Component, OnInit } from '@angular/core';
import { Gasto } from 'src/app/domain/gasto';
import { GastosService } from 'src/app/services/gastos.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-ver-gastos',
  templateUrl: './ver-gastos.page.html',
  styleUrls: ['./ver-gastos.page.scss'],
})
export class VerGastosPage implements OnInit {

  gastos:any

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private gastoService: GastosService) { }

  ngOnInit() {
    this.gastos=this.gastoService.obtenerGastos("HX6cM5myyrCH6gM8rIbM")
  }
  
}
