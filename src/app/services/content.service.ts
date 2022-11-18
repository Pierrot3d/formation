import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Icontent, MenuList } from '../models/menu.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private _url: string = '../../assets/json/content.json';

  constructor(private http: HttpClient) {}

  getContent(): Observable<MenuList[]> {
    return this.http.get<MenuList[]>(this._url);
  }
}
