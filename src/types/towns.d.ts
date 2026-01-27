import type { Feature, FeatureCollection, MultiPolygon } from 'geojson';

export interface GeoDataTownsProperties {
  insee: string;
  nom: string;
  pop2020: number;
  superfic: number;
  naiss2022: number;
  deces2020: number;
  revMed2020: number;
  NbMaisons: number;
  NbApparts: number;
  PropMaison: number;
  PropAppart: number;
  Prixm2Moyen: number;
}

export type GeoDataTownsFeature = Feature<MultiPolygon, GeoDataTownsProperties>;

export type GeoDataTownsCollection = FeatureCollection<
  MultiPolygon,
  GeoDataTownsProperties
>;
