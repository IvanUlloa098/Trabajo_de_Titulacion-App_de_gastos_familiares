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
  
  gastosF:Gasto[]=[]
  usuarios:any
  gastos:any

  
 
  constructor(private route: ActivatedRoute,
    private router: Router, 
    private gastoService: GastosService) { }

  ngOnInit() {
    
    this.cargarUsuarios()    
  }
  async cargarUsuarios(){
    this.usuarios=this.gastoService.obtenerusrFamilia("7Jq8PcqKZso18jwqjhoN")    
    this.usuarios.forEach((element) => {           
      for (let index = 0; index < element.length; index++) {
        this.gastos=this.gastoService.obtenerGastos(element[index].uid)        
        this.cargarGastos()
      }
    });  
  }
  async cargarGastos(){
    this.gastos.forEach((element) => {
      for (let index1 = 0; index1 < element.length; index1++) {        
        let aux:Gasto=new Gasto()
        aux.id=element[index1].id        
        aux.monto=element[index1].monto
        aux.id_usuario=element[index1].id_usuario
        aux.id_categoria=element[index1].id_categoria
        aux.fecha=element[index1].fecha
        aux.descripcion=element[index1].descripcion                        
        this.gastosF.push(aux)        
      }          
    });
  }
}
