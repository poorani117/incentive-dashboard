import { ZipcodeElement } from './pages.service';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

export interface ZipcodeElement {
	id: number;
	zip_code: number;
	county_id: number;
	created_at: string;
	created_by: number;
	deleted_at: number;
	deleted_by: string;
	updated_at: string;
	updated_by: string;
}

@Injectable({
  providedIn: 'root'
})

export class PagesService {
  ROOT_URL = 'https://prelive-incentive.pickmysolar.com';
  zipcodes: ZipcodeElement[];
  
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  addZipcode(zip_code: string, county_id: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    const params = new HttpParams()
      .set('zip_code', zip_code)
      .set('county_id', county_id);

    const requestBody = params.toString();
    return this.http.post<any>(this.ROOT_URL + '/zipcodes', requestBody, { headers});
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error);


      console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  getZipcodes(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    return this.http
      .get(this.ROOT_URL +  '/zipcodes', {headers})
      .pipe(map(this.extractData),
      tap((res: any = {}) => {
        this.zipcodes = res.data.data;
      }));
  }

  editZipcodes(element:any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    const params = new HttpParams()
      .set('zip_code', element.zip_code)
      .set('county_id', element.county_id);

    const requestBody = params.toString();
    return this.http.put<any>(this.ROOT_URL + '/zipcodes/' + element.id, requestBody, { headers})
    .pipe(
      tap((res: any = {}) => {
        this.zipcodes.forEach((item) => {
          if(item.id === res.id){
            item.zip_code = element.zip_code;
            console.log(this.zipcodes);
          }
        });
     }));
  }

  deleteZipcode(element:any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));

    return this.http.delete<any>(this.ROOT_URL + '/zipcodes/' + element.id, { headers})
    .pipe(
      tap((res: any = {}) => {
        console.log('success')
     }));
  }




  getCounties(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    return this.http
      .get(this.ROOT_URL +  '/counties', {headers})
      .pipe(map(this.extractData));
  }

  addCountry(name: string, short_name: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    const params = new HttpParams()
      .set('name', name)
      .set('short_name', short_name);

    const requestBody = params.toString();
    return this.http.post<any>(this.ROOT_URL + '/countries', requestBody, { headers});
  }

  editCountry(element:any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    const params = new HttpParams()
      .set('name', element.name)
      .set('short_name', element.short_name);

    const requestBody = params.toString();
    return this.http.put<any>(this.ROOT_URL + '/countries/' + element.id, requestBody, { headers})
    .pipe(
      tap((res: any = {}) => {
     }));
  }

  deleteCountry(element:any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));

    return this.http.delete<any>(this.ROOT_URL + '/countries/' + element.id, { headers})
    .pipe(
      tap((res: any = {}) => {
        console.log('success')
     }));
  }

  addCounty(county: string, countyShort: string, stateId: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    const params = new HttpParams()
      .set('name', county)
      .set('short_name', countyShort)
      .set('state_id', stateId);

    const requestBody = params.toString();
    return this.http.post<any>(this.ROOT_URL + '/counties', requestBody, { headers});
  }

  editCounty(element:any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    const params = new HttpParams()
    .set('name', element.name)
    .set('short_name', element.short_name)
    .set('state_id', element.state_id);

    const requestBody = params.toString();
    return this.http.put<any>(this.ROOT_URL + '/counties/' + element.id, requestBody, { headers})
    .pipe(
      tap((res: any = {}) => {
     }));
  }

  deleteCounty(element:any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));

    return this.http.delete<any>(this.ROOT_URL + '/counties/' + element.id, { headers})
    .pipe(
      tap((res: any = {}) => {
        console.log('success')
     }));
  }

  getStates(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    return this.http
      .get(this.ROOT_URL +  '/states', {headers})
      .pipe(map(this.extractData));
  }

  addState(state: string, stateShort: string, countryId: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    const params = new HttpParams()
      .set('name', state)
      .set('short_name', stateShort)
      .set('country_id', countryId);

    const requestBody = params.toString();
    return this.http.post<any>(this.ROOT_URL + '/states', requestBody, { headers});
  }

  editState(element:any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    const params = new HttpParams()
    .set('name', element.name)
    .set('short_name', element.short_name)
    .set('country_id', element.country_id);

    const requestBody = params.toString();
    return this.http.put<any>(this.ROOT_URL + '/states/' + element.id, requestBody, { headers})
    .pipe(
      tap((res: any = {}) => {
     }));
  }

  deleteState(element:any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));

    return this.http.delete<any>(this.ROOT_URL + '/states/' + element.id, { headers})
    .pipe(
      tap((res: any = {}) => {
        console.log('success')
     }));
  }

  getValueTypes(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    return this.http
      .get(this.ROOT_URL +  '/valuetypes', {headers})
      .pipe(map(this.extractData));
  }

  addValueType(value: string, perfPayment: any, paymentBased: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    const params = new HttpParams()
      .set('name', value)
      .set('perfPayment', perfPayment)
      .set('paymentBased', paymentBased);
      console.log(params)
    const requestBody = params.toString();
    return this.http.post<any>(this.ROOT_URL + '/valuetypes', requestBody, { headers});
  }

  editValueType(element:any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    const params = new HttpParams()
    .set('name', element.value)
    .set('perfPayment', element.perfPayment)
    .set('paymentBased', element.paymentBased);

    const requestBody = params.toString();
    return this.http.put<any>(this.ROOT_URL + '/valuetypes/' + element.id, requestBody, { headers})
    .pipe(
      tap((res: any = {}) => {
     }));
  }

  deleteValueType(element:any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));

    return this.http.delete<any>(this.ROOT_URL + '/valuetypes/' + element.id, { headers})
    .pipe(
      tap((res: any = {}) => {
        console.log('success')
     }));
  }
  

  getCountries(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    return this.http
      .get(this.ROOT_URL +  '/countries', {headers})
      .pipe(map(this.extractData));
  }






  addIncentive(name: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    const params = new HttpParams()
      .set('name', name)

    const requestBody = params.toString();
    return this.http.post<any>(this.ROOT_URL + '/incentivetypes', requestBody, { headers});
  }

  getIncentives(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    return this.http
      .get(this.ROOT_URL +  '/incentivetypes', {headers})
      .pipe(map(this.extractData),
      tap((res: any = {}) => {
        this.zipcodes = res.data.data;
      }));
  }

  editIncentive(element:any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    const params = new HttpParams()
    .set('name', element.name)

    const requestBody = params.toString();
    return this.http.put<any>(this.ROOT_URL + '/incentivetypes/' + element.id, requestBody, { headers})
    .pipe(
      tap((res: any = {}) => {
     }));
  }

  deleteIncentive(element:any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));

    return this.http.delete<any>(this.ROOT_URL + '/incentivetypes/' + element.id, { headers})
    .pipe(
      tap((res: any = {}) => {
        console.log('success');
     }));
  }

  addDealType(name: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    const params = new HttpParams()
      .set('deal_type', name)

    const requestBody = params.toString();
    return this.http.post<any>(this.ROOT_URL + '/dealtypes', requestBody, { headers});
  }

  getDealType(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    return this.http
      .get(this.ROOT_URL +  '/dealtypes', {headers})
      .pipe(map(this.extractData),
      tap((res: any = {}) => {
        this.zipcodes = res.data.data;
      }));
  }

  editDealType(element:any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    const params = new HttpParams()
    .set('deal_type', element.name)

    const requestBody = params.toString();
    return this.http.put<any>(this.ROOT_URL + '/dealtypes/' + element.id, requestBody, { headers})
    .pipe(
      tap((res: any = {}) => {
     }));
  }

  deleteDealType(element:any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));

    return this.http.delete<any>(this.ROOT_URL + '/dealtypes/' + element.id, { headers})
    .pipe(
      tap((res: any = {}) => {
        console.log('success');
     }));
  }




}
