import { setDeparture } from './js/app.js';
import { formHandler } from './js/app.js';

import './styles/style.scss';
import './styles/reset.scss';
import './styles/responsive.scss';

setDeparture();

document.getElementById('form').addEventListener('submit', formHandler);
