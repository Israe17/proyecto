import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global";
import { Observable } from "rxjs";
import { Cliente } from "../models/cliente";


@Injectable({
  providedIn: 'root'
})

export class ClienteService {

  public url: string;
  constructor(private _http: HttpClient) {
    this.url = server.url;

  }

  store(data: any): Observable<any> {

    let userJson = JSON.stringify(data);
    let params = 'data=' + userJson;
    let headers;
    let bearerToken = sessionStorage.getItem('token');
    if (bearerToken) {
      headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('bearertoken', bearerToken);
    } else {
      headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    }
    let options = { headers };
    return this._http.post(this.url + 'cliente/store', params, options);

  }

  getClientes(): Observable<any> {
    let headers;
    let bearerToken = sessionStorage.getItem('token');
    if(bearerToken){
        headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('bearertoken',bearerToken);
    }else{
        headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    }
    let options = {headers};
    return this._http.get(this.url+'cliente/index',options);
  }

  getCliente(id: number): Observable<any> {
    let headers;
    let bearerToken = sessionStorage.getItem('token');
    if(bearerToken){
        headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('bearertoken',bearerToken);
    }else{
        headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    }
    let options = {headers};
    return this._http.get(this.url+'cliente/'+id,options);
  }

  updateCliente(cliente: Cliente): Observable<any> {
    let userJson = JSON.stringify(cliente);
    let params = 'data=' + userJson;
    let headers;
    let bearerToken = sessionStorage.getItem('token');
    if (bearerToken) {
      headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('bearertoken', bearerToken);
    } else {
      headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    }
    let options = { headers };
    return this._http.put(this.url + 'cliente/' + cliente.id, params, options);
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
    return this._http.get(this.url+'cliente/'+id,options);
  }




}




