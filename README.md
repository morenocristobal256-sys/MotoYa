# MotoYa — Sitio público

**Lema:** Tu envío, nuestra misión.

Primera versión de la web pública de MotoYa. Sitio estático, adaptable a móviles, con identidad negro/dorado/blanco.

## Incluye
- Portada y presentación del proyecto.
- Servicios: mototaxi, moto delivery y MotoYa Comercios.
- Sección de comunidad con espacios previstos para foro y chat.
- Formulario público de pre-registro conectado a Supabase.
- Fecha estimada de beta: 15 de enero de 2027 (tentativa).

## Estado y límites de esta versión
- El formulario de pre-registro está conectado a Supabase y se probó el envío y la aparición de registros en la tabla `pre_registros`.
- La tabla usa Row Level Security (RLS): el navegador puede insertar registros válidos, pero no tiene permiso público para leerlos, editarlos ni borrarlos.
- Se añadió una protección antispam básica en el navegador (campo señuelo y control de tiempo). No sustituye CAPTCHA ni límites de frecuencia en el servidor; completar esas defensas es requisito antes de una promoción amplia.
- El foro y el chat todavía no están conectados a sistemas de publicación, autenticación ni moderación.
- El aviso de privacidad está actualizado como versión preliminar; falta definir plazo de conservación y canal de solicitudes antes de abrir ampliamente el registro.
- No solicitar cédula, documentos, datos bancarios ni información sensible.

## Publicación
Puede publicarse como sitio estático con GitHub Pages desde la raíz de la rama `main`.
