# Encuesta de Semillas 2026 (Cloudflare Worker + D1)

Encuesta a núcleos vendedores de semillas de palma de aceite, año calendario 2026 (SISPA), con los colores
de Fedepalma. Las respuestas se guardan en una base de datos Cloudflare D1; las empresas no envían archivos.

## Contenido

```
wrangler.jsonc               configuración del Worker (nombre, archivos, base de datos)
public/                      lo que se publica
  index.html                 lleva a la encuesta
  encuesta-semillas.html     la encuesta (para las empresas)
  admin-semillas.html        ver y descargar las respuestas en Excel (con clave)
  assets/vendor/             SheetJS 0.18.5 (genera los archivos Excel)
src/worker.js                atiende /api/respuestas y /api/exportar; lo demás lo sirve public/
src/api/respuestas.js        valida y guarda cada envío en D1
src/api/exportar.js          entrega las respuestas a admin-semillas.html (pide ADMIN_KEY)
db/schema.sql                tablas de la base de datos
```

## Publicar

1. **Base de datos** (si no la has creado): *Storage & databases → D1 → Create*, nombre `encuesta-semillas`,
   y en *Console* ejecuta las instrucciones de `db/schema.sql`.
2. **ID de la base:** ya está en `wrangler.jsonc` (`eacff7ee-…`). Si algún día creas otra base, cambia ese
   valor por su **Database ID**.
3. **Subir el Worker**, de una de estas formas:
   - **Con GitHub (sin instalar nada):** crea un repositorio nuevo, sube el contenido de esta carpeta (con
     `wrangler.jsonc` en la raíz) y en Cloudflare abre el Worker `semillas` → *Settings → Build →
     Connect* y elige ese repositorio. Deja el comando de despliegue `npx wrangler deploy`. Cada cambio en el
     repositorio se publica solo.
   - **Desde tu computador** (necesita Node.js): en esta carpeta ejecuta `npx wrangler login` y luego
     `npx wrangler deploy`.
4. **Clave de administración:** en el Worker, *Settings → Variables and Secrets → Add*, tipo **Secret**,
   nombre `ADMIN_KEY` y una clave larga (mínimo 12 caracteres). Se guarda en Cloudflare y no se pierde en
   los siguientes despliegues.

La base de datos se conecta sola desde `wrangler.jsonc`; no hace falta agregarla en *Bindings*.

Quedan en `https://semillas.<tu-subdominio>.workers.dev/encuesta-semillas` (para las empresas) y
`…/admin-semillas` (para ti).

## Cómo funciona

- La empresa llena cuatro pasos (empresa, producción e inventario, ventas, revisión), agrega todos los
  materiales y ventas que necesite y al enviar recibe un número de radicado. El avance se guarda en su navegador.
- El servidor vuelve a validar todo antes de guardar; un campo oculto descarta envíos de robots.
- En `admin-semillas` se ven los envíos y se descarga un Excel con las hojas *Empresas*, *Inventario y uso*
  y *Ventas*. Si una empresa envía otra vez, se toma su envío más reciente.
- Para cambiar el año de la encuesta, ajusta `anio` en `public/encuesta-semillas.html` y `ANIO` en
  `src/api/respuestas.js`.
