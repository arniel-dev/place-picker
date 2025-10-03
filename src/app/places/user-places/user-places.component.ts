import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { LoadingScreenComponent } from '../../shared/loading-screen/loading-screen.component';
import { PlacesService } from '../places.service';

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
  error = signal('');

  private destroyRef = inject(DestroyRef);
  private placeService = inject(PlacesService);

  ngOnInit(): void {
    this.isLoading.set(true);
    const subscription = this.placeService.loadUserPlaces().subscribe({
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
}
