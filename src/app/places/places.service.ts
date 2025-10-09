import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient);
  private errorService = inject(ErrorService);
  isLoading = signal(false);
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
    ).pipe(
      tap({
        next: (userPlaces) => this.userPlaces.set(userPlaces.places),
      })
    );
  }

  addPlaceToUserPlaces(selectedPlace: Place) {
    const prevState = this.userPlaces();

    return this.httpClient
      .put('http://localhost:3000/user-places', { selectedPlace })
      .subscribe({
        error: (error) => {
          this.errorService.showError(
            error?.message ? error.message : 'something went wrong'
          );
          this.userPlaces.set(prevState);
        },
        complete: () => {
          this.userPlaces.update((prev) => {
            const exists = prev.some((p) => p.id === selectedPlace.id);
            if (exists) {
              return prev.filter((p) => p.id !== selectedPlace.id);
            } else {
              return [...prev, { ...selectedPlace, isFavorite: true }];
            }
          });
        },
      });
  }

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
