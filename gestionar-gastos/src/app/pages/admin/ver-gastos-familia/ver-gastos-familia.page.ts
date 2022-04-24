import { Component, OnInit } from '@angular/core';
import { Gasto } from 'src/app/domain/gasto';
import { GastosService } from 'src/app/services/gastos.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-ver-gastos-familia',
  templateUrl: './ver-gastos-familia.page.html',
  styleUrls: ['./ver-gastos-familia.page.scss'],
})
export class VerGastosFamiliaPage implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private gastoService: GastosService) { }

  ngOnInit() {
  }

  obtenerUsrFamilia(){
    
  }
}
