import type { Feature, FeatureCollection, MultiLineString } from 'geojson';

export interface GeoDataRoadsProperties {
  fclass: string;
  name: string | null;
  ref: string;
}

export type GeoDataRoadsFeature = Feature<
  MultiLineString,
  GeoDataRoadsProperties
>;

export type GeoDataRoadsCollection = FeatureCollection<
  MultiLineString,
  GeoDataRoadsProperties
>;
