# Getting Started

Esta guía te llevará desde cero hasta tener VueNime corriendo en tu máquina. Si todo va bien, en 10 minutos deberías estar viendo la app en tu navegador.

## Requisitos Previos

- **Git** instalado
- **Bun** como package manager (lo instalamos abajo)
- Un navegador moderno
- Conexión a internet (la app requiere conexión para funcionar)

## 1. Instalar Bun

Bun es un runtime de JavaScript ultrarrápido que usamos como package manager. Es compatible con npm pero mucho más rápido.

### macOS / Linux

```bash
curl -fsSL https://bun.sh/install | bash
```

### Windows (PowerShell)

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

### Verificar instalación

```bash
bun --version
# Debería mostrar algo como 1.x.x
```

> **¿Por qué Bun y no npm/pnpm?** Es significativamente más rápido para instalar dependencias. Si prefieres usar npm o pnpm, también funcionan—solo cambia `bun` por tu package manager en los comandos.

## 2. Clonar el Repositorio

```bash
git clone https://github.com/jesus-molano/vuenime.git
cd vuenime
```

## 3. Instalar Dependencias

```bash
bun install
```

Esto descarga todas las dependencias del proyecto. La primera vez puede tardar un poco, pero las siguientes serán instantáneas gracias al cache de Bun.

## 4. Configurar Variables de Entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con las credenciales de Supabase:

```env
SUPABASE_URL=https://sveeygidlkpsvaxifbzv.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2ZWV5Z2lkbGtwc3ZheGlmYnp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MTg2NDIsImV4cCI6MjA2MDM5NDY0Mn0.DEtaX2xyPVJN2MJcuCY3z-KNaJz-L_FNX0q_VHa5Gjo
```

> **Nota**: La `SUPABASE_KEY` es la anon key (pública). Está diseñada para usarse en código cliente y es segura. El acceso real a los datos lo controla Row Level Security (RLS) en Supabase.

## 5. Iniciar el Servidor

```bash
bun run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

Deberías ver la página principal de VueNime con anime listado. Si ves errores de red, verifica que las credenciales de Supabase en `.env` sean correctas.

## Variables de Entorno Explicadas

| Variable               | Requerida | Default                       | Descripción                           |
| ---------------------- | --------- | ----------------------------- | ------------------------------------- |
| `SUPABASE_URL`         | Sí        | —                             | URL del proyecto Supabase             |
| `SUPABASE_KEY`         | Sí        | —                             | Anon key (pública, safe para cliente) |
| `NUXT_JIKAN_API_URL`   | No        | `https://api.jikan.moe/v4`    | URL de la API de Jikan                |
| `NUXT_PUBLIC_SITE_URL` | No        | `http://localhost:3000`       | URL pública del sitio                 |
| `LOG_LEVEL`            | No        | `debug` (dev) / `info` (prod) | Nivel de logging                      |

## Comandos Disponibles

| Comando             | Qué hace                                       |
| ------------------- | ---------------------------------------------- |
| `bun run dev`       | Servidor de desarrollo con hot reload          |
| `bun run dev:host`  | Dev server accesible en red local (para móvil) |
| `bun run build`     | Build de producción                            |
| `bun run preview`   | Preview del build de producción                |
| `bun run test`      | Todos los tests (Vitest + @nuxt/test-utils)    |
| `bun run test:e2e`  | Tests E2E con Playwright                       |
| `bun run lint`      | Verificar código con ESLint                    |
| `bun run lint:fix`  | Arreglar errores de lint automáticamente       |
| `bun run typecheck` | Verificar tipos con TypeScript                 |
| `bun run prepush`   | Verificación completa: lint + types + build    |

## Estructura del Proyecto

```
vuenime/
├── app/                    # Código de la aplicación
│   ├── components/         # Componentes Vue organizados por dominio
│   ├── composables/        # Funciones de composición (useXxx)
│   ├── pages/              # Rutas basadas en archivos
│   ├── stores/             # Stores de Pinia
│   ├── services/           # Lógica de API y Supabase
│   └── middleware/         # Guards de navegación
│
├── server/                 # Código del servidor Nitro
│   └── api/jikan/          # Proxy para la API de Jikan
│
├── shared/                 # Código compartido cliente/servidor
│   ├── types/              # Tipos TypeScript
│   ├── schemas/            # Schemas de Zod
│   └── constants/          # Constantes compartidas
│
├── i18n/                   # Archivos de traducción
├── docs/                   # Documentación (estás aquí)
└── test/                   # Tests
```

Para más detalles sobre la arquitectura, lee [architecture.md](./architecture.md).

## Troubleshooting

### "Cannot connect to Supabase"

- Verifica que `SUPABASE_URL` y `SUPABASE_KEY` estén correctos en `.env`
- Asegúrate de no tener espacios extra en el archivo
- El URL debe empezar con `https://` y terminar en `.supabase.co`

### "Rate limited by Jikan API"

- Es normal si haces muchas requests rápido
- El proxy tiene rate limiting integrado, espera unos segundos
- En desarrollo intensivo, considera usar la respuesta cacheada

### "Port 3000 already in use"

```bash
# Matar el proceso que usa el puerto
lsof -ti:3000 | xargs kill -9

# O usar otro puerto
bun run dev -- --port 3001
```

### Los tests fallan

```bash
# Asegúrate de tener las dependencias actualizadas
bun install

# Si hay tests de Playwright fallando, instala los browsers
bunx playwright install
```

## Siguiente Paso

Ahora que tienes el proyecto corriendo, te recomiendo leer:

- [Architecture](./architecture.md) — Entender cómo está organizado el código
- [Features](./features/) — Deep dives en las características más interesantes
