export interface Place {
  id: string;
  title: string;
  isFavorite: boolean;
  image: {
    src: string;
    alt: string;
  };
  lat: number;
  lon: number;
}
