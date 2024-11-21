import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global";
import { User } from "../models/user";
import { Observable } from "rxjs";
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class UserService {
    public url:string;
    constructor(private _http:HttpClient){
        this.url = server.url;
    }

    login(user:User):Observable<any>{
      const filteredUser = {
        email: user.email,
        password_hash: user.password_hash
      };
      let userJson = JSON.stringify(user);


      let params = 'data='+userJson;

      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
      let options = {headers};
        return this._http.post(this.url+'user/login',params,options);
    }

    getIdentityFromAPI():Observable<any>{
        let headers;
        let bearerToken = sessionStorage.getItem('token');
        if(bearerToken){
          headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('bearertoken',bearerToken);
        }else{
          headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        }
        let options = {headers};
        return this._http.get(this.url+'user/getidentity',options);
      }

    logout(){
        sessionStorage.clear();
    }

    register(user:User):Observable<any>{
        let userJson = JSON.stringify(user);
        let params = 'data='+userJson;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        let options = {headers};
        return this._http.post(this.url+'user/store',params,options);
    }

    update(user:User):Observable<any>{
        let userJson = JSON.stringify(user);
        let params = 'data='+userJson;
        let headers;
        let bearerToken = sessionStorage.getItem('token');
        if(bearerToken){
            headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('bearertoken',bearerToken);
        }else{
            headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        }
        let options = {headers};
        return this._http.post(this.url+'user/update',params,options);
    }

    UpdateRol(user:User):Observable<any>{
        let userJson = JSON.stringify(user);
        let params = 'data='+userJson;
        let headers;
        let bearerToken = sessionStorage.getItem('token');
        if(bearerToken){
            headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('bearertoken',bearerToken);
        }else{
            headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        }
        let options = {headers};
        return this._http.put(this.url+'user/rol/'+user.id,params,options);
    }

    delete(id: number): Observable<any> {
      let headers;
      let bearerToken = sessionStorage.getItem('token');
      if(bearerToken){
          headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('bearertoken',bearerToken);
      }else{
          headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
      }
      let options = {headers};

      return this._http.delete(this.url + 'user/delete/' + id,options);
    }

    uploadImage(image: File): Observable<any> {
      const formularioDatos: FormData = new FormData();
      formularioDatos.append('file0', image, image.name);

      let headers = new HttpHeaders();
      const bearerToken = sessionStorage.getItem('token');

      if (bearerToken) {
        headers = headers.set('bearertoken', `${bearerToken}`);
      }

      return this._http.post(this.url + 'user/upload', formularioDatos, { headers });
    }

  // Método para obtener una imagen
  getImage(filename: string): Observable<Blob> {
    let headers;
    let bearerToken = sessionStorage.getItem('token');
    if (bearerToken) {
        headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('bearertoken', bearerToken);
    } else {
        headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    }
    let options = { headers, responseType: 'blob' as 'json' };
    return this._http.get<Blob>(`${this.url}user/getimage/${filename}`, options);
}

  updateImage(image:File,filename:string){
     const formData = new FormData();
    formData.append('file0',image,image.name);
    let headers;
      let bearerToken = sessionStorage.getItem('token');
      if(bearerToken){
        headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('bearertoken',bearerToken);
    }else{
        headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    }
      let options = { headers };
    return this._http.post(this.url+'user/updateimage/'+filename,formData,options);
  }
  deleteImage(filename:string):Observable<any>{
    let headers;
      let bearerToken = sessionStorage.getItem('token');
      if(bearerToken){
        headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('bearertoken',bearerToken);
    }else{
        headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    }
    let options = { headers };
    return this._http.delete('${this.url}user/deleteimage/${filename}', options);
  }

    getUsers():Observable<any>{
      let headers;
      let bearerToken = sessionStorage.getItem('token');
      if(bearerToken){
          headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('bearertoken',bearerToken);
      }else{
          headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
      }
      let options = {headers};
      return this._http.get(this.url+'user/index',options);
    }

    getUser(id:number):Observable<any>{
      let headers;
      let bearerToken = sessionStorage.getItem('token');
      if(bearerToken){
          headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('bearertoken',bearerToken);
      }else{
          headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
      }
      let options = {headers};

      return this._http.get(this.url+'user/show/'+id,options);
    }

    getIdentityFromStorage(){
      let identity = sessionStorage.getItem('identity');
      if(identity ){
        return JSON.parse(identity);
      }
      return null;
    }

    getToken(){
      let token = sessionStorage.getItem('token');
      if(token){
        return token;
      }
      return null;
    }

    isLoggedIn(){

      console.log(this.expiredToken());

      return !!this.getToken() && this.expiredToken() > 0;
    }

    getDecodedToken(){
      return jwtDecode(this.getToken()??'');
    }

    expiredToken(){
      const token = this.getDecodedToken();
      const ahora = new Date().getTime() / 1000;
      const expiracion = (token.exp ?? 0) - ahora;
      return expiracion;
    }


}
