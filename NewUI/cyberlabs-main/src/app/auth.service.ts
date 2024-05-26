import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { JwtHelperService} from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common'; // Import isPlatformBrowser
import { User } from './Models/User';

interface VirtualMachine {
  name: string;
  vmId: number;
  status: string;
  maxmem: number;
}



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  apiURL : string = "http://localhost:3000";
  counter = 0; 

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  async registerUser(user : User){
    const registerURL = "/Auth/signup"
    return fetch(this.apiURL + registerURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user }),

    }).then(response => response.json());
  }
  async GetVms(): Promise<VirtualMachine[]> {
    const registerURL = "/vm/list";
    try {
        const response = await fetch(this.apiURL + registerURL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const responseData = await response.json();
        const parsedData: VirtualMachine[] = responseData.data.data.map((vm: any) => ({
            name: vm.name,
            vmId: vm.vmid,
            status: vm.status,
            maxmem: vm.maxmem
        }));
        return parsedData;
    } catch (error) {
        // Handle error here
        console.error('Error fetching VMs:', error);
        return []; // Return empty array or handle the error accordingly
    }
}



  async  loginUser(username : string, password : string, isInstructor : boolean) {
    const loginURL = "/Auth/signin";
    return fetch(this.apiURL + loginURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username,password, isInstructor }),

    }).then(response => response.json())
    .then(response => localStorage.setItem('SavedToken',response.token)); 
  }

  async logout(){
    localStorage.removeItem('SavedToken'); 
  }

  async isAuthenticated() : Promise<boolean> {
    if (isPlatformBrowser(this.platformId)) {
      const helper = new JwtHelperService();
      const token = localStorage.getItem('SavedToken');  
      console.log(token); 
      
      
      
      if(token === undefined){
        console.log('you did it'); 
        return false; 
      }
      else{
        const isExpired = helper.isTokenExpired(token);
     
        return !isExpired;
      }
      
      
    }
    return false; // Return false for non-browser environments
  }
}


