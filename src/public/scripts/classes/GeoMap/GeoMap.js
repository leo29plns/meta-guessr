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
import roadsGeoData from '@/data/roads.geojson' with { type: 'json' };
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
 * @param {number} value - Value between 1 and 3
 * @returns {{ color: string, opacity: number }}
 */
function getHeatStyle(value) {
  // Normalize value to 0-1 range
  const normalized = Math.max(0, Math.min(1, (value - 1) / 2));

  // Opacity: 0.4 at value 1, up to 0.85 at value 3
  const opacity = 0.4 + normalized * 0.45;

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

/**
 * Gets a qualitative label for a value from 1-3.
 * @param {number} value - Value between 1 and 3
 * @returns {string}
 */
function getQualityLabel(value) {
  if (value <= 1.5) return 'Correct';
  if (value <= 2.5) return 'Dégradé';
  return 'Horrible';
}

/** @type {Record<string, PathOptions>} */
const ROAD_STYLES = {
  pri: { color: '#e74c3c', weight: 4, opacity: 0.9 },
  sec: { color: '#e67e22', weight: 3, opacity: 0.8 },
  ter: { color: '#f1c40f', weight: 2, opacity: 0.7 },
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

/** Housing price thresholds for color scale (€/m²) */
const HOUSING_PRICE_MIN = 1500;
const HOUSING_PRICE_MAX = 6000;

/**
 * Gets a color based on housing price per m².
 * Green = cheap, Yellow = medium, Red = expensive.
 * @param {number} price - Price per m² in euros
 * @returns {string} RGB color string
 */
function getHousingPriceColor(price) {
  const normalized = Math.max(
    0,
    Math.min(
      1,
      (price - HOUSING_PRICE_MIN) / (HOUSING_PRICE_MAX - HOUSING_PRICE_MIN),
    ),
  );

  let r, g, b;
  if (normalized <= 0.5) {
    // Green to Yellow
    r = Math.round(255 * (normalized * 2));
    g = 200;
    b = 50;
  } else {
    // Yellow to Red
    r = 255;
    g = Math.round(200 * (1 - (normalized - 0.5) * 2));
    b = 50;
  }

  return `rgb(${r}, ${g}, ${b})`;
}

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

  /** @type {GeoJSON | null} */
  #housingLayer = null;

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
          layer.bindTooltip(content, {
            direction: 'top',
            sticky: true,
          });
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
          <strong>${props.nom}</strong><br>
          Code INSEE : ${props.insee}<br>
          Population (2020) : ${props.pop2020.toLocaleString()}<br>
          Superficie : ${props.superfic} km²<br>
          Densité : ${(props.pop2020 / props.superfic).toFixed(2)} habitants/km²<br>
          Naissances (2022) : ${props.naiss2022}<br>
          Décès (2020) : ${props.deces2020}<br>
          Revenu médian (2020) : ${props.revMed2020} €
        `;

        layer.bindTooltip(tooltipContent, {
          direction: 'top',
          permanent: false,
          offset: [0, -10],
          sticky: true,
          className: 'map-tooltip',
        });

        layer.on('mouseover', () => {
          /** @type {import('leaflet').Path} */ (layer).setStyle(
            TOWN_HOVER_STYLE,
          );
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
  // Housing Prices Layer
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Displays the housing prices layer on the map.
   * Colors each town based on average price per m².
   * If already visible, this method does nothing.
   */
  showHousing() {
    if (this.#housingLayer) return;

    this.#housingLayer = new GeoJSON(this.#townsGeoData, {
      style: (feature) => {
        const props =
          /** @type {import('src/types/towns').GeoDataTownsProperties} */ (
            feature?.properties
          );
        const price = props?.Prixm2Moyen ?? 0;
        const hasData = price > 0;
        return {
          color: '#333',
          weight: 1,
          opacity: 1,
          fillColor: hasData ? getHousingPriceColor(price) : '#999',
          fillOpacity: hasData ? 0.7 : 0.4,
        };
      },
      onEachFeature: (feature, layer) => {
        const props =
          /** @type {import('src/types/towns').GeoDataTownsProperties} */ (
            feature.properties
          );
        const hasData = props.Prixm2Moyen > 0;
        const tooltipContent = hasData
          ? `
          <strong>${props.nom}</strong><br>
          Prix moyen : ${props.Prixm2Moyen.toLocaleString()} €/m²<br>
          Nb. maisons : ${props.NbMaisons.toLocaleString()}<br>
          Nb. appartements : ${props.NbApparts.toLocaleString()}<br>
        `
          : `
          <strong>${props.nom}</strong><br>
          Pas de données disponibles
        `;

        layer.bindTooltip(tooltipContent, {
          direction: 'top',
          permanent: false,
          offset: [0, -10],
          sticky: true,
          className: 'map-tooltip',
        });

        layer.on('mouseover', () => {
          /** @type {import('leaflet').Path} */ (layer).setStyle({
            weight: 3,
            fillOpacity: 0.9,
          });
        });

        layer.on('mouseout', () => {
          const price = props?.Prixm2Moyen ?? 0;
          const hasData = price > 0;
          /** @type {import('leaflet').Path} */ (layer).setStyle({
            weight: 1,
            fillOpacity: hasData ? 0.7 : 0.4,
            fillColor: hasData ? getHousingPriceColor(price) : '#999',
          });
        });
      },
    });

    this.#housingLayer.addTo(this.#map);
  }

  /**
   * Hides the housing prices layer from the map.
   */
  hideHousing() {
    if (!this.#housingLayer) return;

    this.#map.removeLayer(this.#housingLayer);
    this.#housingLayer = null;
  }

  /**
   * Toggles the visibility of the housing prices layer.
   *
   * @returns {boolean} `true` if housing layer is now visible, `false` otherwise.
   */
  toggleHousing() {
    if (this.#housingLayer) {
      this.hideHousing();
      return false;
    }

    this.showHousing();
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
        const name = props.nom_du_site ?? 'Monument inconnu';
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

      cell.bindTooltip(`Bruit : ${getQualityLabel(value)}`, {
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

      cell.bindTooltip(`Pollution : ${getQualityLabel(value)}`, {
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

    this.#busStopsLayer = new GeoJSON(this.#geoData, {
      pointToLayer: (_, latlng) => new CircleMarker(latlng, BUS_STOP_STYLE),
      onEachFeature: (feature, layer) => {
        const props =
          /** @type {import('src/types/geodata').GeoDataProperties} */ (
            feature.properties
          );
        const stopName = props.nom;
        const commune = props.nom_comm;
        const street = props.near_road;
        const monument = props.near_monu;

        const tooltipContent = `
          <strong>${stopName}</strong><br>
          ${commune}${street ? `<br>${street}` : ''}${`<br>Proche de: ${monument}`}
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
