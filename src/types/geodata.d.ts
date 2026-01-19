import type { Feature, FeatureCollection, Point } from 'geojson';

export interface GeoDataProperties {
  osm_id: string;
  code: string;
  fclass: string;
  'Nom arret': string;
  'Code Postal': string;
  'Nom commune': string;
  'Population 2020': string;
  Superficie: string;
  'Naissance 2022': string;
  'Deces 2022': string;
  'Revenus median 2020': string;
  name: string;
  x: string;
  y: string;
  "Prix d'achat M2_NbMaisons": string;
  "Prix d'achat M2_NbApparts": string;
  "Prix d'achat M2_PropMaison": string;
  "Prix d'achat M2_PropAppart": string;
  "Prix d'achat M2_Prixm2Moyen": string;
  'Nom rue la plus proche': string;
}

export type GeoDataFeature = Feature<Point, GeoDataProperties>;

export type GeoDataCollection = FeatureCollection<Point, GeoDataProperties>;
