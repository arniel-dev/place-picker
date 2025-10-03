import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { LoadingScreenComponent } from '../../shared/loading-screen/loading-screen.component';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent, LoadingScreenComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isLoading = signal(false);
  error = signal('');
  private httpClient = inject(HttpClient);
  private placeService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.isLoading.set(true);
    const subscription = this.placeService.loadAvailablePlaces().subscribe({
      next: (resData) => {
        this.places.set(resData.places);
      },
      error: (errMsg: string) => {
        this.error.set(errMsg);
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe;
    });
  }

  onSelectPlace(selectedPlace: Place) {
    const subscription = this.httpClient
      .put('http://localhost:3000/user-places', { selectedPlace })
      .subscribe({
        next(value) {
          console.log(value);
        },
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe;
    });
  }
}
