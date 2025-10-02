import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { LoadingScreenComponent } from '../../shared/loading-screen/loading-screen.component';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent, LoadingScreenComponent],
})
export class UserPlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isLoading = signal(false);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.isLoading.set(true);
    const subscription = this.httpClient
      .get<{ places: Place[] }>(' http://localhost:3000/user-places')
      .subscribe({
        next: (resData) => {
          this.places.set(resData.places);
        },
        error: () => {
          //todo error message
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe;
    });
  }
}
