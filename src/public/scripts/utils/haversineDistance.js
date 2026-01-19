import { degToRad } from './degToRad.js';

/**
 * Computes distance between two points (using Haversine formula).
 * https://en.wikipedia.org/wiki/Haversine_formula
 *
 * @param {number} lat1 - Latitude of point A
 * @param {number} long1 - Longitude of point A
 * @param {number} lat2 - Latitude of point B
 * @param {number} long2 - Longitude of point B
 * @returns {number} Distance in meters
 */
export const haversineDistance = (lat1, long1, lat2, long2) => {
  const EARTH_RADIUS_METERS = 6371e3;

  // Convert to radians for trigonometric calculations
  const lat1Rad = degToRad(lat1);
  const lat2Rad = degToRad(lat2);

  const latDiffRad = degToRad(lat2 - lat1);
  const longDiffRad = degToRad(long2 - long1);

  // Part 'a' of the formula: the square of half the chord length
  const squareHalfChord =
    Math.sin(latDiffRad / 2) * Math.sin(latDiffRad / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(longDiffRad / 2) *
      Math.sin(longDiffRad / 2);

  // Part 'c': the angular distance in radians
  const centralAngleRad =
    2 * Math.atan2(Math.sqrt(squareHalfChord), Math.sqrt(1 - squareHalfChord));

  return Math.round(EARTH_RADIUS_METERS * centralAngleRad);
};
