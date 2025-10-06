import { Component, input, output } from '@angular/core';

import { Place } from './place.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-places',
  standalone: true,
  imports: [NgClass],
  templateUrl: './places.component.html',
  styleUrl: './places.component.css',
})
export class PlacesComponent {
  places = input.required<Place[]>();
  selectPlace = output<Place>();

  toggleFavorite(place: Place) {
    place.isFavorite = !place.isFavorite;
    this.selectPlace.emit(place);
  }
}
