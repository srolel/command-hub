import * as ReactDOM from 'react-dom';
import component, {store} from './components/component';

window.store = store;

export {store as store};

export const __reload = (prevModule) => {
    store.copyStateFrom(prevModule.store);
}

const appEl = document.getElementById('app');

if (appEl) {
    ReactDOM.render(component, appEl);
}
