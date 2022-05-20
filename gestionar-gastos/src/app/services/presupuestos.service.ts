import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Presupuesto } from '../domain/presupuesto';


@Injectable({
  providedIn: 'root'
})
export class PresupuestosService {  

  constructor(public afs: AngularFirestore) { }
  guardar(presupuesto:Presupuesto){
    const refPresupuestos = this.afs.collection("presupuestos");
      
      if (presupuesto.id == null){
        presupuesto.id = this.afs.createId();        
      }
  
      refPresupuestos.doc(presupuesto.id).set(Object.assign({}, presupuesto));
  }
  obtenerPresupuestoCtgr(idC:any,idF:any):Observable<any[]>{
    return this.afs.collection("presupuestos",
            ref=> ref.where("id_familia","==",idF).where("id_categoria","==",idC)).valueChanges();
  }
  obtenerPresupuestoFml(idF:any):Observable<any[]>{
    return this.afs.collection("families",
            ref=> ref.where("id_familia","==",idF)).valueChanges();
  }
  obtenerPresupuestos(idF:any):Observable<any[]>{
    return this.afs.collection("presupuestos",
            ref=> ref.where("id_familia","==",idF).where("activo","==",true)).valueChanges();
  }
  obtenerFamilia(idF:any):Observable<any[]>{
    return this.afs.collection("families",
            ref=> ref.where("id","==",idF)).valueChanges();
  }
  async actualizarPresupuesto(presupuesto) {
    return await this.afs.collection("presupuestos").doc(presupuesto.id).update({activo: false})
  }
}
