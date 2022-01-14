import { setDeparture } from './js/app.js';
import { formHandler } from './js/app.js';
import { getTrips } from './js/app.js';

import './styles/style.scss';
import './styles/reset.scss';
import './styles/responsive.scss';

setDeparture();
getTrips();

document.getElementById('form').addEventListener('submit', formHandler);
