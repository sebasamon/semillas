// Worker de la Encuesta de Semillas: atiende /api/* y deja el resto a los archivos de public/.
import * as respuestas from './api/respuestas.js';
import * as exportar from './api/exportar.js';

const RUTAS = {
  '/api/respuestas': respuestas,
  '/api/exportar': exportar,
};

export default {
  async fetch(request, env, ctx) {
    const ruta = RUTAS[new URL(request.url).pathname];
    if (!ruta) return env.ASSETS.fetch(request);
    // Same handler names as Pages Functions: onRequestPost, onRequestGet… with onRequest as fallback.
    const metodo = request.method.charAt(0) + request.method.slice(1).toLowerCase();
    const handler = ruta[`onRequest${metodo}`] || ruta.onRequest;
    return handler({ request, env, ctx });
  },
};
