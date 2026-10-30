# Encuesta de Semillas 2026 (Cloudflare Pages + D1)

Encuesta a núcleos vendedores de semillas de palma de aceite, año calendario 2026 (SISPA), con los colores
de Fedepalma. Las respuestas se guardan en una base de datos Cloudflare D1; las empresas no envían archivos.

## Contenido

```
index.html                  lleva a la encuesta
encuesta-semillas.html      la encuesta (para las empresas)
admin-semillas.html         ver y descargar las respuestas en Excel (con clave)
functions/api/respuestas.js recibe, valida y guarda cada envío en D1
functions/api/exportar.js   entrega las respuestas a admin-semillas.html (pide ADMIN_KEY)
db/schema.sql               tablas de la base de datos
assets/vendor/              SheetJS 0.18.5 (genera los archivos Excel)
```

## Publicar en Cloudflare (plan gratuito)

1. **Base de datos:** en el panel de Cloudflare, *Storage & Databases → D1 → Create*, nombre
   `encuesta-semillas`. Abre su *Console*, pega el contenido de `db/schema.sql` y ejecútalo.
2. **Sitio:** *Workers & Pages → Create → Pages*. Hay dos formas:
   - **Subir la carpeta:** *Upload assets* (o *Drag and drop your files*) no publica la carpeta `functions`,
     que es la que guarda las respuestas. Usa esta opción solo si publicas con Wrangler:
     `npx wrangler pages deploy . --project-name encuesta-semillas` dentro de esta carpeta.
   - **Desde un repositorio de GitHub nuevo** (recomendado): sube esta carpeta a un repositorio propio y en
     *Connect to Git* elígelo. Sin framework, sin comando de compilación y `/` como carpeta de salida.
3. **Conectar la base de datos:** en el proyecto, *Settings → Bindings → Add → D1 database*:
   nombre de variable `DB`, base `encuesta-semillas`.
4. **Clave de administración:** *Settings → Variables and Secrets → Add*, tipo *Secret*, nombre `ADMIN_KEY`
   y una clave larga (mínimo 12 caracteres).
5. Vuelve a desplegar para que tome los pasos 3 y 4.

Quedan en `https://<proyecto>.pages.dev/encuesta-semillas` (para las empresas) y
`https://<proyecto>.pages.dev/admin-semillas` (para ti).

## Cómo funciona

- La empresa llena cuatro pasos (empresa, producción e inventario, ventas, revisión), agrega todos los
  materiales y ventas que necesite y al enviar recibe un número de radicado. El avance se guarda en su navegador.
- El servidor vuelve a validar todo antes de guardar; un campo oculto descarta envíos de robots.
- En `admin-semillas` se ven los envíos y se descarga un Excel con las hojas *Empresas*, *Inventario y uso*
  y *Ventas*. Si una empresa envía otra vez, se toma su envío más reciente.
- Para cambiar el año de la encuesta, ajusta `anio` en `encuesta-semillas.html` y `ANIO` en
  `functions/api/respuestas.js`.
