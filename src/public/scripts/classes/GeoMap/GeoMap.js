import {
  CircleMarker,
  GeoJSON,
  LayerGroup,
  Map as LeafletMap,
  Rectangle,
  TileLayer,
} from 'leaflet';

import geoData from '@/data/geodata.geojson' with { type: 'json' };
import monumentsGeoData from '@/data/monuments.geojson' with { type: 'json' };
import roadsGeoData from '@/data/roads_essentials_2.geojson' with {
  type: 'json',
};
import sonAirGeoData from '@/data/son_air3.geojson' with { type: 'json' };
import townsGeoData from '@/data/towns.geojson' with { type: 'json' };

/**
 * @import { GeoDataRoadsCollection } from 'src/types/roads'
 * @import { GeoDataTownsCollection } from 'src/types/towns'
 * @import { GeoDataMonumentsCollection } from 'src/types/monuments'
 * @import { Layer, PathOptions, LatLngExpression, LatLngBoundsExpression } from 'leaflet'
 */

/**
 * @typedef {Object} SonAirProperties
 * @property {number} son_mean
 * @property {number} polution_mean
 */

/**
 * @typedef {Object} SonAirFeature
 * @property {'Feature'} type
 * @property {SonAirProperties} properties
 * @property {{ type: 'Point', coordinates: [number, number] }} geometry
 */

/**
 * @typedef {Object} SonAirGeoData
 * @property {'FeatureCollection'} type
 * @property {string} name
 * @property {SonAirFeature[]} features
 */

/** Grid cell dimensions based on data point spacing */
const CELL_LAT_SIZE = 0.00587; // Latitude spacing between points
const CELL_LNG_SIZE = 0.00778; // Longitude spacing between points

/**
 * Gets rectangle bounds centered on a point.
 * @param {number} lat - Center latitude
 * @param {number} lng - Center longitude
 * @returns {LatLngBoundsExpression}
 */
function getCellBounds(lat, lng) {
  const halfLat = CELL_LAT_SIZE / 2;
  const halfLng = CELL_LNG_SIZE / 2;
  return [
    [lat - halfLat, lng - halfLng],
    [lat + halfLat, lng + halfLng],
  ];
}

/**
 * Gets a color and opacity based on a value from 1-3 (1=cool/green, 3=hot/red).
 * Low values (green) are nearly transparent, high values (red) are more visible.
 * @param {number} value - Value between 1 and 3
 * @returns {{ color: string, opacity: number }}
 */
function getHeatStyle(value) {
  // Normalize value to 0-1 range
  const normalized = Math.max(0, Math.min(1, (value - 1) / 2));

  // Opacity: 0.05 at value 1, up to 0.7 at value 3
  const opacity = 0.05 + normalized * 0.65;

  let color;
  // Gradient from green (1) -> yellow (2) -> red (3)
  if (normalized <= 0.5) {
    // Green to Yellow
    const r = Math.round(255 * (normalized * 2));
    const g = 200;
    const b = 50;
    color = `rgb(${r}, ${g}, ${b})`;
  } else {
    // Yellow to Red
    const r = 255;
    const g = Math.round(200 * (1 - (normalized - 0.5) * 2));
    const b = 50;
    color = `rgb(${r}, ${g}, ${b})`;
  }

  return { color, opacity };
}

/** @type {Record<string, PathOptions>} */
const ROAD_STYLES = {
  primary: { color: '#e74c3c', weight: 4, opacity: 0.9 },
  secondary: { color: '#e67e22', weight: 3, opacity: 0.8 },
  tertiary: { color: '#f1c40f', weight: 2, opacity: 0.7 },
  default: { color: '#3498db', weight: 1.5, opacity: 0.6 },
};

/** @type {PathOptions} */
const TOWN_BASE_STYLE = {
  color: '#2d6a4f',
  weight: 1.5,
  opacity: 1,
  fillColor: '#95d5b2',
  fillOpacity: 0.5,
};

/** @type {PathOptions} */
const TOWN_HOVER_STYLE = {
  color: '#1b4332',
  weight: 3,
  fillColor: '#40916c',
  fillOpacity: 0.7,
};

/** @type {import('leaflet').CircleMarkerOptions} */
const MONUMENT_STYLE = {
  radius: 6,
  color: '#ffffff',
  weight: 2,
  opacity: 1,
  fillColor: '#3498db',
  fillOpacity: 0.9,
};

/** @type {import('leaflet').CircleMarkerOptions} */
const BUS_STOP_STYLE = {
  radius: 5,
  color: '#ffffff',
  weight: 1.5,
  opacity: 1,
  fillColor: '#9b59b6',
  fillOpacity: 0.85,
};

export class GeoMap {
  /** @type {LeafletMap} */
  #map;

  /** @type {GeoDataRoadsCollection} */
  #roadsGeoData;

  /** @type {GeoDataTownsCollection} */
  #townsGeoData;

  /** @type {GeoDataMonumentsCollection} */
  #monumentsGeoData;

  /** @type {SonAirGeoData} */
  #sonAirGeoData;

  /** @type {import('geojson').FeatureCollection} */
  #geoData;

  /** @type {GeoJSON | null} */
  #roadsLayer = null;

  /** @type {GeoJSON | null} */
  #townsLayer = null;

  /** @type {GeoJSON | null} */
  #monumentsLayer = null;

  /** @type {LayerGroup | null} */
  #noiseLayer = null;

  /** @type {LayerGroup | null} */
  #pollutionLayer = null;

  /** @type {GeoJSON | null} */
  #busStopsLayer = null;

  /**
   * @param {string} [containerId]
   * @param {[number, number]} [center]
   * @param {number} [zoom]
   */
  constructor(containerId = 'map', center = [48.709167, 2.504722], zoom = 9) {
    this.#map = new LeafletMap(containerId, {
      zoomControl: false,
    }).setView(center, zoom);

    new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#roadsGeoData = /** @type {GeoDataRoadsCollection} */ (roadsGeoData);
    this.#townsGeoData = /** @type {GeoDataTownsCollection} */ (townsGeoData);
    this.#monumentsGeoData = /** @type {GeoDataMonumentsCollection} */ (
      monumentsGeoData
    );
    this.#sonAirGeoData = /** @type {SonAirGeoData} */ (sonAirGeoData);
    this.#geoData = /** @type {import('geojson').FeatureCollection} */ (
      geoData
    );
  }

  zoomIn() {
    this.#map.setZoom(this.#map.getZoom() + 1);
  }

  zoomOut() {
    this.#map.setZoom(this.#map.getZoom() - 1);
  }

  /**
   * Returns the style for a road based on its classification.
   *
   * @param {import('src/types/roads').GeoDataRoadsFeature} feature
   * @returns {PathOptions}
   */
  #getRoadStyle(feature) {
    const fclass = feature.properties?.fclass ?? 'default';
    return ROAD_STYLES[fclass] ?? ROAD_STYLES.default;
  }

  /**
   * Displays the roads layer on top of the map.
   * If already visible, this method does nothing.
   */
  showRoads() {
    if (this.#roadsLayer) return;

    this.#roadsLayer = new GeoJSON(this.#roadsGeoData, {
      style: (feature) =>
        this.#getRoadStyle(
          /** @type {import('src/types/roads').GeoDataRoadsFeature} */ (
            feature
          ),
        ),
      onEachFeature: (feature, layer) => {
        const props = feature.properties;
        const name = props?.name;
        const ref = props?.ref;

        if (name || ref) {
          const content = name
            ? ref
              ? `<strong>${name}</strong><br>${ref}`
              : `<strong>${name}</strong>`
            : `<strong>${ref}</strong>`;
          layer.bindPopup(content);
        }
      },
    });

    this.#roadsLayer.addTo(this.#map);
  }

  /**
   * Hides the roads layer from the map.
   */
  hideRoads() {
    if (!this.#roadsLayer) return;

    this.#map.removeLayer(this.#roadsLayer);
    this.#roadsLayer = null;
  }

  /**
   * Toggles the visibility of the roads layer.
   *
   * @returns {boolean} `true` if roads are now visible, `false` otherwise.
   */
  toggleRoads() {
    if (this.#roadsLayer) {
      this.hideRoads();
      return false;
    }

    this.showRoads();
    return true;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Towns Layer
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Displays the towns layer on the map.
   * If already visible, this method does nothing.
   */
  showTowns() {
    if (this.#townsLayer) return;

    this.#townsLayer = new GeoJSON(this.#townsGeoData, {
      style: () => TOWN_BASE_STYLE,
      onEachFeature: (feature, layer) => {
        const props =
          /** @type {import('src/types/towns').GeoDataTownsProperties} */ (
            feature.properties
          );
        const tooltipContent = `
          <strong>${props.nom_officiel_commune_arrondissement_municipal}</strong><br>
          Code INSEE : ${props.codgeo}<br>
          Population (2020) : ${props['Population 2020'].toLocaleString()}<br>
          Superficie : ${props.Superficie} km²<br>
          Densité : ${(props['Population 2020'] / props.Superficie).toFixed(2)} habitants/km²<br>
          Naissances (2022) : ${props['Naissance 2022']}<br>
          Décès (2022) : ${props['Deces 2022']}<br>
          Revenu médian (2020) : ${parseInt(props['Revenus median 2020'], 10).toLocaleString()} €
        `;

        // Use the town's geo_point as the tooltip anchor
        const townCenter = /** @type {import('leaflet').LatLngExpression} */ ([
          props.geo_point.lat,
          props.geo_point.lon,
        ]);

        layer.bindTooltip(tooltipContent, {
          direction: 'top',
          permanent: false,
          offset: [0, -10],
        });

        layer.on('mouseover', () => {
          /** @type {import('leaflet').Path} */ (layer).setStyle(
            TOWN_HOVER_STYLE,
          );
          layer.getTooltip()?.setLatLng(townCenter);
        });

        layer.on('mouseout', () => {
          /** @type {import('leaflet').Path} */ (layer).setStyle(
            TOWN_BASE_STYLE,
          );
        });
      },
    });

    this.#townsLayer.addTo(this.#map);
  }

  /**
   * Hides the towns layer from the map.
   */
  hideTowns() {
    if (!this.#townsLayer) return;

    this.#map.removeLayer(this.#townsLayer);
    this.#townsLayer = null;
  }

  /**
   * Toggles the visibility of the towns layer.
   *
   * @returns {boolean} `true` if towns are now visible, `false` otherwise.
   */
  toggleTowns() {
    if (this.#townsLayer) {
      this.hideTowns();
      return false;
    }

    this.showTowns();
    return true;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Monuments Layer
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Displays the monuments layer on the map.
   * If already visible, this method does nothing.
   */
  showMonuments() {
    if (this.#monumentsLayer) return;

    this.#monumentsLayer = new GeoJSON(this.#monumentsGeoData, {
      pointToLayer: (_, latlng) => new CircleMarker(latlng, MONUMENT_STYLE),
      onEachFeature: (feature, layer) => {
        const props =
          /** @type {import('src/types/monuments').GeoDataMonumentsProperties} */ (
            feature.properties
          );
        const name = props.name ?? 'Monument inconnu';
        layer.bindTooltip(name, { direction: 'top', offset: [0, -6] });
      },
    });

    this.#monumentsLayer.addTo(this.#map);
  }

  /**
   * Hides the monuments layer from the map.
   */
  hideMonuments() {
    if (!this.#monumentsLayer) return;

    this.#map.removeLayer(this.#monumentsLayer);
    this.#monumentsLayer = null;
  }

  /**
   * Toggles the visibility of the monuments layer.
   *
   * @returns {boolean} `true` if monuments are now visible, `false` otherwise.
   */
  toggleMonuments() {
    if (this.#monumentsLayer) {
      this.hideMonuments();
      return false;
    }

    this.showMonuments();
    return true;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Noise Layer (son_mean)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Displays the noise (son_mean) layer as a grid on the map.
   * If already visible, this method does nothing.
   */
  showNoise() {
    if (this.#noiseLayer) return;

    this.#noiseLayer = new LayerGroup();

    this.#sonAirGeoData.features.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const value = feature.properties.son_mean;
      const { color, opacity } = getHeatStyle(value);
      const bounds = getCellBounds(lat, lng);

      const cell = new Rectangle(bounds, {
        color: color,
        weight: 0,
        opacity: opacity,
        fillColor: color,
        fillOpacity: opacity,
      });

      cell.bindTooltip(`Bruit: ${value.toFixed(2)}`, {
        direction: 'top',
        offset: [0, -5],
      });

      this.#noiseLayer?.addLayer(cell);
    });

    this.#noiseLayer.addTo(this.#map);
  }

  /**
   * Hides the noise layer from the map.
   */
  hideNoise() {
    if (!this.#noiseLayer) return;

    this.#map.removeLayer(this.#noiseLayer);
    this.#noiseLayer = null;
  }

  /**
   * Toggles the visibility of the noise layer.
   *
   * @returns {boolean} `true` if noise layer is now visible, `false` otherwise.
   */
  toggleNoise() {
    if (this.#noiseLayer) {
      this.hideNoise();
      return false;
    }

    this.showNoise();
    return true;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Pollution Layer (polution_mean)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Displays the pollution (polution_mean) layer as a grid on the map.
   * If already visible, this method does nothing.
   */
  showPollution() {
    if (this.#pollutionLayer) return;

    this.#pollutionLayer = new LayerGroup();

    this.#sonAirGeoData.features.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const value = feature.properties.polution_mean;
      const { color, opacity } = getHeatStyle(value);
      const bounds = getCellBounds(lat, lng);

      const cell = new Rectangle(bounds, {
        color: color,
        weight: 0,
        opacity: opacity,
        fillColor: color,
        fillOpacity: opacity,
      });

      cell.bindTooltip(`Pollution: ${value.toFixed(2)}`, {
        direction: 'top',
        offset: [0, -5],
      });

      this.#pollutionLayer?.addLayer(cell);
    });

    this.#pollutionLayer.addTo(this.#map);
  }

  /**
   * Hides the pollution layer from the map.
   */
  hidePollution() {
    if (!this.#pollutionLayer) return;

    this.#map.removeLayer(this.#pollutionLayer);
    this.#pollutionLayer = null;
  }

  /**
   * Toggles the visibility of the pollution layer.
   *
   * @returns {boolean} `true` if pollution layer is now visible, `false` otherwise.
   */
  togglePollution() {
    if (this.#pollutionLayer) {
      this.hidePollution();
      return false;
    }

    this.showPollution();
    return true;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Bus Stops Layer
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Displays the bus stops layer on the map.
   * If already visible, this method does nothing.
   */
  showBusStops() {
    if (this.#busStopsLayer) return;

    // Filter only bus_stop features
    const busStopFeatures = this.#geoData.features.filter(
      (feature) => feature.properties?.fclass === 'bus_stop',
    );

    const busStopsCollection = {
      type: /** @type {const} */ ('FeatureCollection'),
      features: busStopFeatures,
    };

    this.#busStopsLayer = new GeoJSON(busStopsCollection, {
      pointToLayer: (_, latlng) => new CircleMarker(latlng, BUS_STOP_STYLE),
      onEachFeature: (feature, layer) => {
        const props = feature.properties;
        const stopName = props?.['Nom arret'] ?? 'Arrêt inconnu';
        const commune = props?.['Nom commune'] ?? '';
        const street = props?.['Nom rue la plus proche'] ?? '';

        const tooltipContent = `
          <strong>${stopName}</strong><br>
          ${commune}${street ? `<br>${street}` : ''}
        `;

        layer.bindTooltip(tooltipContent, {
          direction: 'top',
          offset: [0, -5],
        });
      },
    });

    this.#busStopsLayer.addTo(this.#map);
  }

  /**
   * Hides the bus stops layer from the map.
   */
  hideBusStops() {
    if (!this.#busStopsLayer) return;

    this.#map.removeLayer(this.#busStopsLayer);
    this.#busStopsLayer = null;
  }

  /**
   * Toggles the visibility of the bus stops layer.
   *
   * @returns {boolean} `true` if bus stops are now visible, `false` otherwise.
   */
  toggleBusStops() {
    if (this.#busStopsLayer) {
      this.hideBusStops();
      return false;
    }

    this.showBusStops();
    return true;
  }
}
