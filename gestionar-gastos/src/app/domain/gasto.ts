//Declaracion de clase Gasto
export class Gasto {
    id:string; //Identificacion
    monto:number; //Monto que registra el gasto
    id_usuario:string;// Id del usuario que realiza el gasto
    id_categoria:string; //iD categoria a la que pertenece el gasto
    fecha:Date;//Fecha de registro de gasto
    descripcion:string;//Espacio para detallar informacion adicional del gasto
}
