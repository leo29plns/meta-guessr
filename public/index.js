import { consoleLog } from '@/scripts/console-log.js';
import { Map, TileLayer } from 'leaflet';

const map = new Map("map").setView([48.8566, 2.3522], 13);

new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

consoleLog();
