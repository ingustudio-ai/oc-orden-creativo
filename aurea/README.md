# ÁUREA · Oráculo Sistémico de 22 Arcanos

Espacio digital de **ÁUREA** — Orden Creativo · Fernando Matías Acri.

- Landing pública con preventa y compra directa por WhatsApp
- Autenticación real con Supabase Auth
- Área privada: carta del día, tirada de 3, 22 arcanos, biblioteca e historial
- Estética oscura, dorada y violeta · φ ≈ 1,618 · Cinzel + Cormorant Garamond

> Áurea es una herramienta simbólica de exploración personal. No constituye diagnóstico ni reemplaza psicoterapia o atención profesional.

---

## Estructura

```
aurea/
├── index.html              # Landing + auth + área privada
├── css/aurea.css           # Identidad visual y responsive
├── js/aurea.js             # Config, datos, auth y experiencias
├── assets/
│   ├── cards/              # 22 arcanos + dorso (WebP)
│   └── images/favicon.svg
├── scripts/
│   └── backup-supabase.ps1 # Backup con pg_dump + retención
├── backups/                # Local, ignorado por Git
└── supabase/supabase.sql   # Esquema, RLS y función de activación
```

El sitio Verónica Bettina Coach vive en la raíz del proyecto (`index.html` en la raíz). **No está relacionado con Áurea.**

---

## Puesta en marcha (9 pasos)

### 1. Abrir la carpeta del sitio

Trabajá siempre dentro de `aurea/`. El producto se sirve desde ahí.

### 2. Crear el proyecto Supabase

1. Andá a [supabase.com](https://supabase.com) → **New project**.
2. Elegí nombre, región y una contraseña de base de datos.
3. Esperá a que el proyecto esté **Active**.

### 3. Ejecutar el SQL

1. Dashboard → **SQL Editor** → **New query**.
2. Pegá el contenido completo de `supabase/supabase.sql`.
3. **Run**. Debería terminar sin errores.

El script crea:

| Objeto | Para qué |
|--------|----------|
| `profiles` | Nombre, email, teléfono y `has_access` |
| `activation_codes` | Códigos del Kit Completo (único, canjeable una vez) |
| `readings` | Historial de tiradas de 3 cartas |
| `waitlist` | Tabla conservada en la base, ya sin uso en la landing |
| `handle_new_user()` | Crea el profile al registrarse |
| `redeem_activation_code()` | Activa el acceso (RPC) |
| RLS + grants | Cada usuario solo ve/edita lo propio |

### 4. Copiar las credenciales del proyecto

1. Dashboard → **Project Settings** → **API**.
2. Copiá:
   - **Project URL** → `SUPABASE_URL`
   - **Project API keys** → `anon` **public** → `SUPABASE_ANON_KEY`

Nunca uses la `service_role` en el navegador.

### 5. Configurar `js/aurea.js`

Abrí `js/aurea.js` y pegá los valores al tope del archivo:

```js
const SUPABASE_URL = "https://TU-PROYECTO.supabase.co";
const SUPABASE_ANON_KEY = "eyJ...";
const BUY_URL = "https://tu-tienda/checkout"; // Kit Completo
```

También podés configurar (opcional):

- `LAUNCH_DATE` / `LAUNCH_PRICE` — fecha y precio del lanzamiento
- `AUREA_RESOURCES` — URLs de la Biblioteca (guía, kit imprimible, tiradas, bonus)

Mientras los campos sigan en `PEGAR_AQUI`, la landing muestra un banner de configuración y el área privada no opera.

### 6. Auth URL en Supabase

Dashboard → **Authentication** → **URL Configuration**:

- **Site URL**: la URL pública donde se sirve Áurea (ej. `https://aurea.tudominio.com`)
- **Redirect URLs**: añadí la misma URL (y el dominio en desarrollo si usás otro)

Sin esto, el registro y la recuperación de contraseña no redirigen bien.

### 7. Registro sin confirmación por email

Para que cada cliente nuevo entre directo, sin esperar ni confirmar el correo:

Dashboard → **Authentication** → **Sign In / Providers** (o **Providers**) → **Email**:

- **Confirm email**: desactivado (off)
- **Enable email provider**: activado (on)
- **Save**

Con eso, `signUp` devuelve sesión al instante y el código de activación se canjea en el mismo paso, llevando al cliente a `#/app/carta`.

Además, `handleRegister` tiene un reintento: si el `signUp` no devuelve sesión pero la cuenta ya existe, intenta `signInWithPassword` con las mismas credenciales. Así el alta funciona aunque «Confirm email» quede activado por error (en ese caso Supabase sí puede exigir la confirmación).

### 8. Generar códigos de activación

Los códigos **no aparecen en la web**. Los generás vos y se los pasás a quienes compran el Kit Completo (email, WhatsApp, etc.).

En SQL Editor:

```sql
insert into public.activation_codes (code) values
  ('TU-CODIGO-AQUI'),
  ('OTRO-CODIGO-AQUI')
on conflict (code) do nothing;
```

Los códigos van en mayúsculas al canjearse. El comprador los ingresa en el registro o en **Activar acceso**.

No expongas la lista de códigos al cliente: solo existe en la base y se valida vía RPC `redeem_activation_code`. El placeholder del formulario dice «Tu código de activación» a propósito: no muestra ningún ejemplo.

### 9. Servir el sitio

En local, desde `aurea/`:

```bash
# cualquier servidor estático sirve
npx serve .
# o
python -m http.server 8080
```

Abrí `http://localhost:8080`. En producción, subí la carpeta `aurea/` a tu hosting estático (Netlify, Vercel, Cloudflare Pages, Nginx, etc.).

### 10. Probar el flujo

1. Landing → **Crear mi cuenta** → registrar con nombre, email, contraseña y código.
2. El alta debe entrar directo a `#/app/carta`, sin paso de confirmación por correo.
3. Con acceso activo entrá a `#/app/carta` → carta del día → tirada de 3 → **Mis lecturas**.
4. Verificá que un segundo usuario **no** vea las lecturas del primero.
5. Verificá que un código ya usado muestre: **«Este código ya fue utilizado.»**
6. Verificá un código inventado: **«El código de activación no es válido.»**

---

## Flujo de usuario (resumen)

```
Landing pública
  ├─ Botones de compra → WhatsApp (Kit digital / Áurea completa)
  ├─ Crear cuenta → signUp (sin confirm email) → código → RPC redeem_activation_code → #/app/carta
  ├─ Ingresar → signInWithPassword → profiles.has_access
  │     └─ si no hay acceso → #/activar → código
  └─ Recuperar contraseña → resetPasswordForEmail → #/recuperar

Área privada (#/app/*)
  ├─ Carta del día (determinística por usuario + fecha)
  ├─ Tirada de 3 → síntesis → insert en `readings`
  ├─ 22 arcanos + modal
  ├─ Biblioteca (URLs configurables)
  └─ Mis lecturas → ver / eliminar (RLS propio)
```

La **carta del día** se calcula con una semilla formada por el `id` del usuario y la fecha: cada persona ve la misma carta durante todo el día, pero distinta de la de otros usuarios. Con 22 arcanos, dos personas pueden coincidir por azar.

---

## Seguridad

- **Solo** `SUPABASE_URL` + `anon` key en el cliente.
- Contraseñas las gestiona Supabase Auth; Áurea no las almacena en `localStorage`.
- En `localStorage` solo se guarda la consulta gratuita del visitante (`aurea:free_draw`).
- RLS: cada usuario solo ve/edita sus `profiles`, `readings`; los `activation_codes` no son legibles por el cliente (solo la RPC).
- `waitlist` quedó **sin lectura desde el cliente**: la tabla se conserva con los datos históricos, pero `anon` y `authenticated` solo pueden insertar. Se consulta desde el dashboard o con la `service_role` key.
- CAPTCHA opcional (Cloudflare Turnstile) en registro, ingreso y recuperación de contraseña.
- Nunca publiques `service_role` ni `.env` con secretos en el repo público.

### Cerrar la fuga de la lista de espera

Si el proyecto se creó con una versión anterior de `supabase.sql`, corré esto una vez en el **SQL Editor** de Supabase:

```sql
drop policy if exists "waitlist_select_own_email" on public.waitlist;
drop policy if exists "waitlist_select_any" on public.waitlist;
revoke all on public.waitlist from anon, authenticated;
grant insert on public.waitlist to anon, authenticated;
```

Verificación (debe devolver 0 filas para un usuario logueado):

```sql
select * from public.waitlist limit 1;
```

> Los datos históricos siguen disponibles desde **Table Editor** con tu cuenta del dashboard.

### CAPTCHA · Cloudflare Turnstile

El código ya está integrado y **desactivado por defecto**: con `TURNSTILE_SITE_KEY` vacío no aparece ningún widget ni se bloquea el acceso.

Para activarlo:

1. Crear un widget en [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) con el dominio del sitio.
2. Pegar la **Site Key** en `js/aurea.js` → `const TURNSTILE_SITE_KEY = "...";`.
3. En Supabase → **Authentication → Attack Protection**, activar *Enable CAPTCHA protection*, elegir **Turnstile** y pegar la **Secret Key**.
4. Publicar. Los formularios de registro, ingreso y recuperación muestran la verificación.

Si Cloudflare no carga (bloqueador de anuncios, red), el widget queda oculto y Supabase devuelve el error de captcha, que se muestra como «No pudimos verificar que sos una persona…».

---

## Backups

El plan Free de Supabase **no incluye backups automáticos**. El script `scripts/backup-supabase.ps1` genera un `.dump` completo (tablas, RLS, funciones y datos) y aplica retención.

Requisitos: PostgreSQL 15 o superior instalado (`winget install PostgreSQL.PostgreSQL.15`) para tener `pg_dump` en el PATH.

```powershell
# Cadena de conexión: Supabase → Project Settings → Database → Session pooler
$env:SUPABASE_DB_URL = "postgresql://postgres.PROYECTO:CLAVE@HOST:5432/postgres"

.\aurea\scripts\backup-supabase.ps1                     # retención 30 días
.\aurea\scripts\backup-supabase.ps1 -RetentionDays 90   # retención 90 días
```

- Los archivos se guardan en `aurea/backups/` (ignorada por Git: contienen datos personales).
- Recomendado: ejecutarlo **una vez por semana** o antes de cada cambio de esquema.
- Restaurar:

```powershell
pg_restore --clean --if-exists --no-owner --no-privileges -d "$env:SUPABASE_DB_URL" aurea-AAAAMMDD-HHMMSS.dump
```

- Programarlo en Windows (Task Scheduler) apuntando a `powershell.exe -File "...\aurea\scripts\backup-supabase.ps1"`.

> Cuando el proyecto pase a Supabase **Pro** (US$25/mes) los backups diarios de 7 días vienen incluidos y el script queda como respaldo adicional.

---

## Variables de configuración

| Constante | Archivo | Qué hace |
|-----------|---------|----------|
| `SUPABASE_URL` | `js/aurea.js` | URL del proyecto Supabase |
| `SUPABASE_ANON_KEY` | `js/aurea.js` | Clave pública anon |
| `TURNSTILE_SITE_KEY` | `js/aurea.js` | Site key de Cloudflare Turnstile (vacío = captcha desactivado) |
| `AUREA_RESOURCES` | `js/aurea.js` | URLs de la biblioteca |

Los botones de compra de la landing apuntan a `https://wa.me/5491131404044` con el mensaje precargado según la opción. Para cambiar el número o los textos, editá los dos enlaces con clase `offer-btn` en `index.html`.

---

## Troubleshooting

| Síntoma | Causa probable |
|---------|----------------|
| Banner «Supabase todavía no está configurado» | Faltan URL o anon key en `js/aurea.js` |
| «No se pudo cargar la librería de Supabase» | CDN bloqueado o sin internet al cargar `supabase.min.js` |
| «No se pudo conectar con el servidor. Verificá tu conexión» | El proyecto de Supabase está pausado o eliminado (el dominio `*.supabase.co` no resuelve). Restauralo en el dashboard |
| Registro no crea profile | El trigger `on_auth_user_created` no se ejecutó; revisá el SQL |
| Código inválido / ya usado | Mensajes distintos en `redeem_activation_code`; verificá la tabla `activation_codes` |
| «Tu cuenta existe pero todavía no tiene acceso» | El código no se canjeó o `profiles.has_access` es `false` |
| Botones de compra no abren WhatsApp | Revisá el número en los enlaces `wa.me` de `index.html` |
| Recuperación de contraseña no llega | Site URL / Redirect URLs mal seteadas en Authentication |
| «No pudimos verificar que sos una persona» | Turnstile configurado en el cliente pero sin Secret Key en Supabase (o dominio no autorizado en Cloudflare) |
| El widget de captcha no aparece | `TURNSTILE_SITE_KEY` vacío (estado normal) o script de Cloudflare bloqueado |
| `pg_dump` no se reconoce | Falta PostgreSQL instalado o la terminal no se reinició después de instalarlo |

---

## Contenido de los 22 arcanos

Los textos (concepto, símbolo, movimiento sistémico, pregunta e integración) están en `js/aurea.js` → `CARDS`, alineados al mazo ilustrado y al manual del oráculo.

Canónico:

| # | Arcano | Fase |
|---|--------|------|
| 00 | El Errante | I. La Raíz |
| 01 | El Origen | I. La Raíz |
| 02 | La Guardiana | I. La Raíz |
| 03 | La Matriarca | I. La Raíz |
| 04 | El Patriarca | I. La Raíz |
| 05 | El Ancestro | I. La Raíz |
| 06 | Los Amantes | II. El Vínculo |
| 07 | El Heredero | II. El Vínculo |
| 08 | El Orden | II. El Vínculo |
| 09 | El Buscador | II. El Vínculo |
| 10 | La Repetición | III. El Patrón |
| 11 | La Fuerza | III. El Patrón |
| 12 | El Sacrificio | III. El Patrón |
| 13 | El Cambio | IV. La Transformación |
| 14 | La Alquimia | IV. La Transformación |
| 15 | La Sombra | IV. La Transformación |
| 16 | La Torre | IV. La Transformación |
| 17 | La Estrella | V. La Conciencia |
| 18 | La Luna | V. La Conciencia |
| 19 | El Sol | V. La Conciencia |
| 20 | El Llamado | VI. El Despertar |
| 21 | El Mundo | VI. El Despertar |

---

© 2026 Orden Creativo · Fernando Matías Acri. Todos los derechos reservados.
