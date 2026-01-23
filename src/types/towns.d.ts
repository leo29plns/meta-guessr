import type { Feature, FeatureCollection, MultiPolygon } from 'geojson';

export interface GeoDataTownsProperties {
  fid: number;
  codgeo: string;
  nom_officiel_commune_arrondissement_municipal: string;
  'Population 2020': number;
  Superficie: number;
  'Naissance 2022': number;
  'Deces 2022': number;
  'Revenus median 2020': string;
  geo_point: {
    lon: number;
    lat: number;
  };
}

export type GeoDataTownsFeature = Feature<MultiPolygon, GeoDataTownsProperties>;

export type GeoDataTownsCollection = FeatureCollection<
  MultiPolygon,
  GeoDataTownsProperties
>;
