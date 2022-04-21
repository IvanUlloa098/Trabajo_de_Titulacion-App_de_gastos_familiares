export class User{
    uid: string;
    email: string;
    password: string;
    role: string;
    displayName: string;
    description : string;
    id_familia : number;
    photoURL: string;
    active: boolean;
    createdAt: Date;
    lastLogin: Date;
    provider: string;
}