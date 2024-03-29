// @ts-nocheck

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import es from './locales/es/messages.js';
import en from './locales/en/messages.js';

// Internationalization
import { I18nProvider } from '@lingui/react';

var userLang = ( navigator.language || navigator.userLanguage).slice(0,2);

ReactDOM.render(
    <I18nProvider language={userLang} catalogs={{ es, en }}>
        <App />
    </I18nProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
