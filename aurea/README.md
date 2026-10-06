# ÁUREA · Oráculo Sistémico de 22 Arcanos

Espacio digital de **ÁUREA** — Orden Creativo · Fernando Matías Acri.

- Landing pública con preventa / lista de espera
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
| `waitlist` | Lista de espera de la landing |
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

### 7. Generar códigos de activación

En SQL Editor:

```sql
insert into public.activation_codes (code) values
  ('AUREA-001-2026'),
  ('AUREA-002-2026')
on conflict (code) do nothing;
```

Los códigos van en mayúsculas al canjearse (`AUREA-001-2026`). El cliente los pide al registrarse o en **Activar acceso**.

No expongas la lista de códigos al cliente: solo existe en la base y se valida vía RPC `redeem_activation_code`.

### 8. Servir el sitio

En local, desde `aurea/`:

```bash
# cualquier servidor estático sirve
npx serve .
# o
python -m http.server 8080
```

Abrí `http://localhost:8080`. En producción, subí la carpeta `aurea/` a tu hosting estático (Netlify, Vercel, Cloudflare Pages, Nginx, etc.).

### 9. Probar el flujo

1. Landing → **Crear mi cuenta** → registrar con nombre, email, contraseña y código.
2. Si Supabase pide confirmar email, revisá el correo y volvé a **Ingresar**.
3. Con acceso activo entrá a `#/app/carta` → carta del día → tirada de 3 → **Mis lecturas**.
4. Verificá que un segundo usuario **no** vea las lecturas del primero.
5. Verificá que un código ya usado muestre: **«Este código ya fue utilizado.»**
6. Verificá un código inventado: **«El código de activación no es válido.»**

---

## Flujo de usuario (resumen)

```
Landing pública
  ├─ Waitlist (insert en `waitlist`)
  ├─ Crear cuenta → signUp → código → RPC redeem_activation_code
  ├─ Ingresar → signInWithPassword → profiles.has_access
  │     └─ si no hay acceso → #/activar → código
  └─ Recuperar contraseña → resetPasswordForEmail → #/recuperar

Área privada (#/app/*)
  ├─ Carta del día (determinística por fecha)
  ├─ Tirada de 3 → síntesis → insert en `readings`
  ├─ 22 arcanos + modal
  ├─ Biblioteca (URLs configurables)
  └─ Mis lecturas → ver / eliminar (RLS propio)
```

---

## Seguridad

- **Solo** `SUPABASE_URL` + `anon` key en el cliente.
- Contraseñas las gestiona Supabase Auth; Áurea no las almacena en `localStorage`.
- En `localStorage` solo se guarda la preferencia de sonido (`aurea:sonido`).
- RLS: cada usuario solo ve/edita sus `profiles`, `readings`; la waitlist acepta inserts anónimos; los `activation_codes` no son legibles por el cliente (solo la RPC).
- Nunca publiques `service_role` ni `.env` con secretos en el repo público.

---

## Variables de configuración

| Constante | Archivo | Qué hace |
|-----------|---------|----------|
| `SUPABASE_URL` | `js/aurea.js` | URL del proyecto Supabase |
| `SUPABASE_ANON_KEY` | `js/aurea.js` | Clave pública anon |
| `BUY_URL` | `js/aurea.js` | Checkout del Kit Completo |
| `LAUNCH_DATE` | `js/aurea.js` | ISO del lanzamiento (default: 2026-10-13T13:00:00-03:00) |
| `LAUNCH_PRICE` | `js/aurea.js` | Precio mostrado después del lanzamiento |
| `AUREA_RESOURCES` | `js/aurea.js` | URLs de la biblioteca |

---

## Troubleshooting

| Síntoma | Causa probable |
|---------|----------------|
| Banner «Supabase todavía no está configurado» | Faltan URL o anon key en `js/aurea.js` |
| «No se pudo cargar la librería de Supabase» | CDN bloqueado o sin internet al cargar `supabase.min.js` |
| Registro no crea profile | El trigger `on_auth_user_created` no se ejecutó; revisá el SQL |
| Código inválido / ya usado | Mensajes distintos en `redeem_activation_code`; verificá la tabla `activation_codes` |
| «Tu cuenta existe pero todavía no tiene acceso» | El código no se canjeó o `profiles.has_access` es `false` |
| Waitlist: error al guardar | Email duplicado (`waitlist.email` es único) o RLS mal configurado |
| Recuperación de contraseña no llega | Site URL / Redirect URLs mal seteadas en Authentication |

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
