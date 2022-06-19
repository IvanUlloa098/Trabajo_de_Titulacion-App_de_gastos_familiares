import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Presupuesto } from '../domain/presupuesto';


@Injectable({
  providedIn: 'root'
})
export class PresupuestosService {

  constructor(public afs: AngularFirestore) { }
  guardar(presupuesto:Presupuesto){//Funcion para guardar 'Presupuesto' en coleccion de Presupuestos
    const refPresupuestos = this.afs.collection("presupuestos");//Referencia a la collecion en la que se desea guardar
      
      if (presupuesto.id == null){//En caso de que el objeto recibido no tenga un ID generarlo
        presupuesto.id = this.afs.createId();//Con la referencia guardar los datos     
      }
  
      refPresupuestos.doc(presupuesto.id).set(Object.assign({}, presupuesto));
  }
  obtenerPresupuestoCtgr(idC:any,idF:any):Observable<any[]>{
    //Consultar en la coleccion presupuestos todos los valores correspondientes a una familia y una categoria
    return this.afs.collection("presupuestos",
            ref=> ref.where("id_familia","==",idF).where("id_categoria","==",idC)).valueChanges();
  }
  obtenerPresupuestoFml(idF:any):Observable<any[]>{
    //Consultar en la coleccion families todos los valores correspondientes a un identificador
    return this.afs.collection("families",
            ref=> ref.where("id_familia","==",idF)).valueChanges();
  }
  obtenerPresupuestos(idF:any):Observable<any[]>{
    //Consultar en la coleccion presupuestos activos todos los valores correspondientes a una familia 
    return this.afs.collection("presupuestos",
            ref=> ref.where("id_familia","==",idF).where("activo","==",true)).valueChanges();
  }
  obtenerFamilia(idF:any):Observable<any[]>{
    //Consultar en la coleccion families todos los valores correspondientes a un identificador
    return this.afs.collection("families",
            ref=> ref.where("id","==",idF)).valueChanges();
  }
  async actualizarPresupuesto(presupuesto) {
    //Funcion para actulizar el registro de actividad en un documento de la coleccion presupuestos
    return await this.afs.collection("presupuestos").doc(presupuesto.id).update({activo: false})
  }
  async actualizarFamiliaPrsp(familia,monto) {
    //Funcion para actulizar el registro del presupuesto general en un documento de la coleccion familia
    return await this.afs.collection("families").doc(familia).update({presupuesto_global: monto})
  }
}
