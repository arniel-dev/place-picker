import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchData(
      'http://localhost:3000/places',
      'Something went wrong. Please try again later.'
    );
  }

  loadUserPlaces() {
    return this.fetchData(
      'http://localhost:3000/user-places',
      'Something went wrong. Please try again later.'
    );
  }

  addPlaceToUserPlaces(place: Place) {}

  removeUserPlace(place: Place) {}

  private fetchData(
    url: string,
    errMsg: string
  ): Observable<{ places: Place[] }> {
    return new Observable((observer) => {
      this.httpClient.get<{ places: Place[] }>(url).subscribe({
        next: (res) => {
          observer.next(res);
          observer.complete();
        },
        error: (_err: HttpErrorResponse) => {
          observer.error(errMsg);
        },
      });
    });
  }
}
