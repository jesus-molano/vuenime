# User Guide

Bienvenido a VueNime. Esta guía te explica cómo usar la aplicación, ya seas un usuario casual que quiere descubrir anime nuevo o alguien que quiere llevar un registro de todo lo que ha visto.

## ¿Qué es VueNime?

VueNime es una plataforma para descubrir y seguir anime. Los datos vienen de MyAnimeList (la base de datos de anime más grande del mundo) a través de la API de Jikan.

Lo que hace especial a VueNime:

- **Sin cuenta necesaria** para empezar—tus favoritos se guardan localmente
- **Sincronización automática** cuando decides crear una cuenta
- **Rápido y sin anuncios**—es código abierto, no hay modelo de negocio
- **Disponible en 3 idiomas**: Inglés, Español y Japonés

## Funcionalidades Principales

### Explorar Anime

La página principal muestra varias secciones:

- **Top Anime**: Los mejor valorados de todos los tiempos
- **This Season**: Lo que está emitiendo ahora
- **Upcoming**: Lo que viene próximamente
- **Popular**: Los más vistos

Puedes hacer click en cualquier card para ver los detalles completos.

### Buscar

Usa la barra de búsqueda para encontrar anime por nombre. La búsqueda funciona en cualquier idioma del título (japonés, inglés, romaji).

También puedes filtrar por:

- Género (acción, comedia, romance, etc.)
- Estado (emitiendo, terminado, próximo)
- Tipo (TV, película, OVA, etc.)
- Año

### Temporadas

VueNime organiza el anime por temporadas (Winter, Spring, Summer, Fall). Puedes explorar qué anime salió en cada temporada desde 2000 hasta el presente.

### Detalles de Anime

Cada anime tiene una página de detalles con:

- **Sinopsis** completa
- **Información técnica**: episodios, duración, estudio, rating
- **Personajes principales** con sus actores de voz
- **Reseñas** de usuarios de MyAnimeList
- **Dónde verlo** legalmente (Crunchyroll, Netflix, etc.)
- **Trailer** de YouTube (si está disponible)
- **Anime relacionados** (secuelas, precuelas, spin-offs)

## Favoritos

### Guardar favoritos sin cuenta

Puedes guardar anime como favoritos sin crear una cuenta. Solo haz click en el corazón de cualquier card o en el botón "Add to Favorites" en la página de detalles.

Tus favoritos se guardan en tu navegador (localStorage). Esto significa:

- Son privados—nadie más puede verlos
- Se pierden si limpias los datos del navegador

### Sincronizar con cuenta

Si quieres que tus favoritos estén disponibles en todos tus dispositivos:

1. Click en **Login** (arriba a la derecha)
2. Elige Google o GitHub
3. Autoriza la aplicación

Al iniciar sesión:

- Tus favoritos locales se **suben** a la nube
- Si ya tenías favoritos en otro dispositivo, se **combinan**
- A partir de ahora, los cambios se sincronizan automáticamente

### Gestionar favoritos

En tu página de favoritos (`/favorites`):

- Ver todos tus anime guardados
- Ordenar por: fecha añadido, puntuación, título
- Filtrar por género o estado
- Quitar favoritos que ya no quieras

## Cuenta de Usuario

### ¿Por qué crear una cuenta?

No es obligatorio, pero tiene ventajas:

- **Sincronización**: Accede a tus favoritos desde cualquier dispositivo
- **Backup**: Si limpias tu navegador, no pierdes nada
- **Continuidad**: Cambia de móvil o PC sin perder datos

### Métodos de login

VueNime usa OAuth, lo que significa que no guardamos contraseñas. Solo puedes entrar con:

- **Google**
- **GitHub**

Esto es más seguro que email/contraseña tradicional.

### Privacidad

Qué datos guardamos:

- Tu email (para identificarte)
- Tu lista de favoritos
- Tu lista de anime vistos

Qué **no** hacemos:

- Vender datos a terceros
- Enviar emails de marketing
- Tracking de comportamiento

### Cerrar sesión

Click en tu avatar → **Logout**

Al cerrar sesión, tus favoritos locales se vacían. Si vuelves a entrar, se recuperan de la nube.

## Idiomas

VueNime está disponible en:

- English
- Español
- 日本語

Puedes cambiar el idioma desde el selector en la barra de navegación. Tu preferencia se guarda automáticamente.

**Nota**: Los títulos de anime y sinopsis vienen de MyAnimeList, que principalmente tiene contenido en inglés y japonés. La traducción de la interfaz no afecta el contenido del anime.

## Tips y Trucos

### Prefetch en hover

Cuando pasas el cursor sobre una card de anime, VueNime empieza a cargar los detalles en segundo plano. Así cuando haces click, la página carga instantáneamente.

### Accesibilidad

- Las animaciones se desactivan si tienes activada la opción "Reducir movimiento" en tu sistema
- La navegación con teclado funciona completamente
- Los elementos interactivos tienen indicadores de foco visibles

## Preguntas Frecuentes

### ¿VueNime tiene todo el anime?

Tenemos acceso a la base de datos completa de MyAnimeList, que incluye prácticamente todo el anime japonés. No tenemos donghua (animación china) ni animación occidental.

### ¿Puedo ver anime en VueNime?

No. VueNime es para descubrir y trackear anime, no para verlo. Te mostramos enlaces a plataformas legales donde puedes verlo (Crunchyroll, Netflix, etc.).

### ¿Por qué algunos anime no tienen imagen?

MyAnimeList a veces no tiene imágenes para anime muy nuevos o muy oscuros. En esos casos mostramos un placeholder.

### ¿Por qué la puntuación es diferente a MyAnimeList?

No debería serlo—mostramos exactamente la puntuación de MAL. Si ves diferencias, probablemente es cache (se actualiza cada hora).

### ¿Puedo exportar mis favoritos?

Actualmente no hay función de exportar. Si necesitas hacerlo, los datos están en localStorage con la key `favorites`.

### ¿Por qué necesito Google o GitHub para entrar?

OAuth es más seguro que email/contraseña tradicional. No tenemos que guardar contraseñas (ni pueden robárnoslas), y tú no tienes que recordar otra contraseña más.

### La app va lenta, ¿qué hago?

1. Verifica tu conexión a internet
2. Recarga la página (Ctrl/Cmd + Shift + R para hard refresh)
3. Si persiste, podría ser la API de Jikan teniendo problemas—espera unos minutos

## Reportar Problemas

Si encuentras un bug o tienes una sugerencia, abre un issue en [GitHub](https://github.com/jesus-molano/vuenime/issues) describiendo:

- Qué esperabas que pasara
- Qué pasó realmente
- Pasos para reproducirlo
- Tu navegador y dispositivo
