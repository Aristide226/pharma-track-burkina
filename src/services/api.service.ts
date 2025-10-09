import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Medicine } from '../models/medicine';
import { Sale } from '../models/sale';
import { User } from '../models/user'; 
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Méthodes pour les médicaments
  getMedicines(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(`${this.apiUrl}/medicines`);
  }

  getMedicineById(id: string): Observable<Medicine> {
    return this.http.get<Medicine>(`${this.apiUrl}/medicines/${id}`);
  }

  getNextMedicineId(): Observable<string> { // La méthode retourne maintenant une chaîne
    return this.getMedicines().pipe(
      map(medicines => {
        return Math.random().toString(36).substring(2, 15);
      })
    );
  }

  addMedicine(medicine: Medicine): Observable<Medicine> {
    return this.http.post<Medicine>(`${this.apiUrl}/medicines`, medicine);
  }

  updateMedicine(medicine: Medicine): Observable<Medicine> {
    return this.http.put<Medicine>(`${this.apiUrl}/medicines/${medicine.id}`, medicine);
  }

  deleteMedicine(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/medicines/${id}`);
  }

  /////VENTES
  addSale(sale: Sale): Observable<Sale> {
    return this.http.post<Sale>(`${this.apiUrl}/sales`, sale);
  }

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/sales`);
  }

  /////LOGIN
  login(username: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.apiUrl}/users?username=${username}&password=${password}`)
      .pipe(
        map(users => users.length > 0 ? users[0] : null)
      );
  }
}
