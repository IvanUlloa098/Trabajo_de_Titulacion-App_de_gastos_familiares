import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Gasto } from '../domain/gasto';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GastosService {  

  private regressionUrl = "https://us-central1-gestionar-gastos.cloudfunctions.net/regressionReq";
  
  constructor(public afs: AngularFirestore, private http: HttpClient) { 
     
  }

  guardar(gasto:Gasto){
    const refGastos = this.afs.collection("gastos");
      
      if (gasto.id == null){
        gasto.id = this.afs.createId();        
      }
  
      refGastos.doc(gasto.id).set(Object.assign({}, gasto));
  }
  obtenerGastos(idG:any):Observable<any[]>{
    return this.afs.collection("gastos",
            ref=> ref.where("id_usuario","==",idG)).valueChanges();
  }  
  obtenerusrFamilia(idF:any):Observable<any[]>{    
    return this.afs.collection("users",
            ref=> ref.where("id_familia","==",idF).where("active","==",true)).valueChanges();
  }
  
  regression(id: any) {
    let body = new URLSearchParams();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': "*"
      })
    };

    body.set('id_usuario', id);

    return this.http.post<any>(this.regressionUrl, body, httpOptions).toPromise();
  }
  
}
