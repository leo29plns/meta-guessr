import { Map as LeafletMap, TileLayer } from 'leaflet';
import { consoleLog } from '@/scripts/console-log.js';

const map = new LeafletMap('map').setView([48.8566, 2.3522], 13);

new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution:
		'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

consoleLog();
