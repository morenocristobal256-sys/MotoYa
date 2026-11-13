# Conectar el pre-registro de MotoYa con Supabase

La web está alojada en GitHub Pages (sitio estático). Para guardar registros hace falta una base de datos externa. Esta configuración usa Supabase con Row Level Security (RLS): el navegador solo tendrá permiso de insertar registros; no podrá leer, editar ni borrar los datos.

## 1. Crear el proyecto
1. Entra en https://supabase.com/ y crea una cuenta/proyecto para MotoYa.
2. Guarda la contraseña de la base de datos en un lugar privado. No la pongas en GitHub ni en el código de la web.
3. En el panel del proyecto abre **SQL Editor**.
4. Abre el archivo `supabase/schema.sql` de este repositorio, copia todo su contenido, pégalo en SQL Editor y pulsa **Run**.
5. En **Project Settings → API** (o **Data API**) copia la **Project URL** y la clave **anon/public**. Nunca uses `service_role`, `secret` ni la contraseña de la base de datos en la web.

## 2. Activar el formulario
El formulario del sitio no debe anunciar que guarda registros hasta que se complete esta conexión. Cuando tengas la Project URL y la clave anon/public, se integran en el frontend como configuración pública. La clave anon está diseñada para uso en navegador; la seguridad depende de las políticas RLS del SQL anterior.

## 3. Comprobar que funciona
1. Envía un registro de prueba con datos ficticios.
2. En Supabase abre **Table Editor → pre_registros** y confirma que aparece.
3. Comprueba que la web muestra confirmación solo después de que Supabase acepte el registro.
4. No publiques ni compartas capturas que muestren datos personales reales.

## Privacidad y operación
- Recoge solo nombre, teléfono, tipo de participación, zona, correo opcional y mensaje opcional.
- No solicites cédula, dirección exacta, datos bancarios ni documentos.
- Restringe el acceso al panel Supabase a administradores autorizados y activa autenticación de dos factores en la cuenta.
- Configura copias de seguridad y una política de retención antes de abrir la convocatoria masivamente.
- Añade CAPTCHA/rate limiting antes de promocionar el formulario ampliamente para reducir spam y abuso.
- La tabla no tiene permiso público de lectura. Para consultar registros, entra al panel administrativo de Supabase con una cuenta autorizada.

**Estado:** preparación técnica lista; la recepción real de registros requiere crear el proyecto Supabase e introducir la URL y clave pública del proyecto.
