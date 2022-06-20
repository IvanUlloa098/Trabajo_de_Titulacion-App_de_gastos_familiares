import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Gasto } from '../domain/gasto';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GastosService {  
  // Debugging de la función localmente
  // private regressionUrl = "http://localhost:5000/gestionar-gastos/us-central1/regressionReq";
  
  constructor(public afs: AngularFirestore, private http: HttpClient) { 
     
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
  
  obtenerGastosFamilia(idG:any):Observable<any[]>{
    return this.afs.collection("gastos",
            ref=> ref.where("id_familia","==",idG)).valueChanges();//Consultar en la coleccion gastos todos los valores correspondientes a un usuario
  } 

  obtenerGastoPorId(id) {
    return this.afs.collection("gastos", ref => ref.where("id", "==", id)).valueChanges()
  }

  obtenerusrFamilia(idF:any):Observable<any[]>{    
    //Consultar en la coleccion users todos los usuarios correspondientes a una familia y que se encuentren activos
    return this.afs.collection("users",
            ref=> ref.where("id_familia","==",idF).where("active","==",true)).valueChanges();
  }
  
  getCategories(){
    return this.afs.collection("categories").valueChanges()
  }

  regression(id: any) {
    let body = new URLSearchParams();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': "*"
      })
    };

    body.set('id_familia', id);

    return this.http.post<any>(environment.RG_FUNC_PATH, body, httpOptions).toPromise();
  }
  
}
