export class User {
    username : string;
    firstname: string;
    lastname: string;
    password: string;
    email: string;
    type: string; 

    constructor(username : string, firstname : string, lastname : string, password : string, email: string, type : string) {
        this.username = username; 
        this.firstname = firstname;
        this.lastname = lastname;
        this.password = password;
        this.email = email; 
        this.type = type; 
    }


};