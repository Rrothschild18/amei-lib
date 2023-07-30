import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, lastValueFrom, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientListService {
  baseURL = 'https://amei-dev.amorsaude.com.br/api/v1';
  token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXN1YXJpbzJAZW1haWwuY29tIiwiZnVsbE5hbWUiOiJOb21lIDIgU29icmVub21lIiwibG9nZ2VkQ2xpbmljIjpudWxsLCJyb2xlIjoidXNlciIsImlhdCI6MTY4OTc2OTQzMywiZXhwIjoxNjg5Nzk4MjMzfQ.bCD03u7aMwGTX6HaqH48zO4iqvaFrz58oJtzX3smAMI';

  constructor(private http: HttpClient) {}

  listProcedureGroupsWithFilters(filters: any): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/`, {
      headers: this.getHeader(),
      params: <HttpParams>(<unknown>filters),
    });
  }

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

  FetchAllEntities(
    filters: any = {},
    entityName: string = ''
  ): Observable<any> {
    const results: Observable<any> = this.http.get(
      `${this.baseURL}/pacientes/`,
      {
        headers: this.getHeader(),
        params: <HttpParams>(<unknown>filters),
      }
    );

    const fields: Observable<any> = this.http.get(
      'assets/patients.fields.json'
    );

    return combineLatest([results, fields]).pipe(
      map(([results, fields]) => {
        const newPayload = {
          filters,
          fields: { ...fields },
          results: [...results.items],
        };

        return newPayload;
      })
    );
  }

  private getHeader(): HttpHeaders {
    const head = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${this.token}`);
    return head;
  }
}
