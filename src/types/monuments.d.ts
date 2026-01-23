import type { Feature, FeatureCollection, Point } from 'geojson';

export interface GeoDataMonumentsProperties {
  fid: number;
  name: string | null;
}

export type GeoDataMonumentsFeature = Feature<
  Point,
  GeoDataMonumentsProperties
>;

export type GeoDataMonumentsCollection = FeatureCollection<
  Point,
  GeoDataMonumentsProperties
>;
