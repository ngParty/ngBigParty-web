import { h, render } from 'preact';

import 'material-design-icons/iconfont/material-icons.css';
import 'material-design-icons/iconfont/MaterialIcons-Regular.ttf';
import 'material-design-icons/iconfont/MaterialIcons-Regular.woff';
import 'material-design-icons/iconfont/MaterialIcons-Regular.woff2';
import 'material-design-lite';
import 'material-design-lite/dist/material.indigo-pink.min.css';
import './styles.css';

import { App } from './app/App';

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';
const mountPoint = document.getElementById('app') || document.createElement('div');
let root: Element;

boot();

// register ServiceWorker via OfflinePlugin, for prod only:
if (isProd) {
  // require( './pwa' );
}


if (isDev) {
  // in development, set up HMR:
  if (module.hot) {
    // require('preact/devtools');   // turn this on if you want to enable React DevTools!
    module.hot.accept('./app/App', () => requestAnimationFrame(boot));
  }

}

function boot() {
  root = render(<App />, mountPoint, root);
}
