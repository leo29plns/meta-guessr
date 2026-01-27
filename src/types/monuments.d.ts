import type { Feature, FeatureCollection, Point } from 'geojson';

export interface GeoDataMonumentsProperties {
  nom_du_site: string;
  commentaires: string | null;
}

export type GeoDataMonumentsFeature = Feature<
  Point,
  GeoDataMonumentsProperties
>;

export type GeoDataMonumentsCollection = FeatureCollection<
  Point,
  GeoDataMonumentsProperties
>;
