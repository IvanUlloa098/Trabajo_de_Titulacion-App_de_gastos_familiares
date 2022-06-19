import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Gasto } from '../domain/gasto';


@Injectable({
  providedIn: 'root'
})
export class GastosService {  
  
  constructor(public afs: AngularFirestore) { 
     
  }

  guardar(gasto:Gasto){//Funcion para guardar 'Gasto' en coleccion de Gastos
    const refGastos = this.afs.collection("gastos");//Referencia a la collecion en la que se desea guardar
      
      if (gasto.id == null){//En caso de que el objeto recibido no tenga un ID generarlo
        gasto.id = this.afs.createId();        
      }
  
      refGastos.doc(gasto.id).set(Object.assign({}, gasto));//Con la referencia guardar los datos
  }
  obtenerGastos(idG:any):Observable<any[]>{
    return this.afs.collection("gastos",
            ref=> ref.where("id_usuario","==",idG)).valueChanges();//Consultar en la coleccion gastos todos los valores correspondientes a un usuario
  }  
  obtenerusrFamilia(idF:any):Observable<any[]>{    
    //Consultar en la coleccion users todos los usuarios correspondientes a una familia y que se encuentren activos
    return this.afs.collection("users",
            ref=> ref.where("id_familia","==",idF).where("active","==",true)).valueChanges();
  }
  
}
