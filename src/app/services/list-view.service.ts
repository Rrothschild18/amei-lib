//store
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListViewService {
  baseURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getPatients(): Promise<any> {
    return lastValueFrom(this.http.get(`${this.baseURL}`));
  }

  // async getAllPatients(): Promise<any> {
  //   let response: any = await lastValueFrom(this.http.get(`${this.baseURL}`));
  //   this.store.dispatch([new FetchAll(response)]);
  // }

  async getPatientCreate(): Promise<any> {
    let response: any = await lastValueFrom(
      this.http.get(`${this.baseURL}/new`)
    );

    return response;
    // this.store.dispatch([new FetchAll(response)]);
  }

  FetchAllEntities(entityName: string): Observable<any> {
    return this.http.get(`${this.baseURL}/${entityName}`);
  }
}
