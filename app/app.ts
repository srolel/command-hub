import * as ReactDOM from 'react-dom';
import component, {store} from './components/component';
import Store from './store';

const global = window as any;

global.store = store;

export {store as store};

export const __reload = () => {
    if (global.store) store.copyStateFrom(global.store);
}

const appEl = document.getElementById('app');

if (appEl) {
    ReactDOM.render(component, appEl);
}
