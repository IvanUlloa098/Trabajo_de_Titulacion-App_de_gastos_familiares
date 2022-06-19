//Declaracion de clase Presupuesto
export class Presupuesto {
    id:string; //Identificacion 
    cantidad:number;//Monto del presupuesto
    id_categoria:string;//Identificacion de categoria al que pertenece
    id_familia : string;//Identificacion de la familia a la que pertenece
    fecha:Date;//Fecha en la cual se registra el presupuesto    
    activo:boolean;//Booleano para identificar el estado del presupuesto
}
