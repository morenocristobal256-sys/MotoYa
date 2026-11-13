# Configuración y operación del pre-registro de MotoYa

## Estado comprobado
- Proyecto Supabase de MotoYa creado.
- El esquema SQL de `supabase/schema.sql` se ejecutó correctamente.
- La tabla `public.pre_registros` aparece en Table Editor.
- El formulario de la web GitHub Pages envió un registro de prueba y el registro apareció en Supabase.
- El navegador utiliza únicamente la clave publishable/public. Nunca colocar claves `secret`, `service_role` ni la contraseña de base de datos en GitHub Pages.

## Arquitectura y permisos
La web estática se aloja en GitHub Pages y envía los registros a Supabase mediante HTTPS/PostgREST. La tabla tiene Row Level Security (RLS) activado. El rol público `anon` tiene permiso de insertar únicamente los campos autorizados por el esquema y las políticas; no tiene permiso público de lectura, edición ni borrado. El equipo autorizado consulta los registros desde el panel privado de Supabase.

## Protección antispam actual
El formulario incluye un campo señuelo oculto y un control básico del tiempo de interacción. Son filtros de baja complejidad que pueden ser eludidos por bots sofisticados. No equivalen a CAPTCHA ni a rate limiting en el servidor.

## Antes de promocionar ampliamente
1. Integrar un CAPTCHA como Cloudflare Turnstile o alternativa equivalente, verificando el token en servidor (no basta con validarlo solo en JavaScript).
2. Implementar límites de frecuencia en servidor/Edge Function y monitorear intentos abusivos.
3. Definir un plazo de conservación de datos y un canal real para solicitudes de acceso, corrección y eliminación.
4. Revisar el aviso de privacidad y las obligaciones legales aplicables antes de una convocatoria masiva.
5. Mantener el acceso al panel Supabase restringido y activar autenticación multifactor en las cuentas administrativas.

## Prueba manual
1. Enviar un registro de prueba con datos ficticios.
2. Abrir Supabase → Table Editor → `pre_registros`.
3. Confirmar que aparece el registro.
4. No compartir capturas con datos personales reales.

## Archivos relevantes
- `supabase/schema.sql`: estructura de tabla, restricciones y políticas RLS.
- `privacidad.html`: aviso de privacidad preliminar del pre-registro.
- `index.html`: formulario público y conexión a Supabase.
