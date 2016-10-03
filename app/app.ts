import * as ReactDOM from 'react-dom';
import component from './components/component';

const appEl = document.getElementById('app');

if (appEl) {
    ReactDOM.render(component, appEl);
}
