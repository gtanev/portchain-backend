import dbCache from '../db/dbCache';

const endpoints = () => dbCache.get('endpoints');

export function registerEndpoints(routerStack) {
  dbCache.set('endpoints', []);
  routerStack.forEach(_register.bind(null, []));
}

function _register(path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(_register.bind(null, path.concat(_split(layer.route.path))));
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(_register.bind(null, path.concat(_split(layer.regexp))));
  } else if (layer.method) {
    endpoints().push(
      layer.method.toUpperCase() +
        ' /' +
        path.concat(_split(layer.regexp)).filter(Boolean).join('/')
    );
  }
}

function _split(str) {
  if (typeof str === 'string') return str.split('/');
  if (str.fast_slash) return '';

  const match = str
    .toString()
    .replace('\\/?', '')
    .replace('(?=\\/|$)', '$')
    .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);

  return match ? match[1].replace(/\\(.)/g, '$1').split('/') : '<complex:' + str.toString() + '>';
}
