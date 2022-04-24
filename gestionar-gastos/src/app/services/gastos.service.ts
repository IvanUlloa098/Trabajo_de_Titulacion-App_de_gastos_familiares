import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';



import { Observable } from 'rxjs';
import { Gasto } from '../domain/gasto';

@Injectable({
  providedIn: 'root'
})
export class GastosService {  

  constructor(public afs: AngularFirestore) { }

  guardar(gasto:Gasto){
    const refGastos = this.afs.collection("gastos");
      
      if (gasto.id == null){
        gasto.id = this.afs.createId();        
      }
  
      refGastos.doc(gasto.id).set(Object.assign({}, gasto));
  }
  obtenerGastos(id:any):Observable<any[]>{
    return this.afs.collection("gastos",
            ref=> ref.where("id","==",id)).valueChanges();
  }
  obtenerGastosFamilia(id:any):Observable<any[]>{
    return this.afs.collection("gastos",
            ref=> ref.where("id","==",id)).valueChanges();
  }
  obtenerusrFamilia(id:any):Observable<any[]>{    
    return this.afs.collection("users",
            ref=> ref.where("id_familia","==",id)).valueChanges();
  }
}
