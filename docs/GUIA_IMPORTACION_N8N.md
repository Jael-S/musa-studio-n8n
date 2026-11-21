# Cómo Importar los Workflows a n8n en 3 Minutos

Puedes importar estos flujos a tu cuenta de **n8n Cloud** o tu instancia local en segundos:

---

## Método 1: Copiar y Pegar en el Canvas (El más rápido ⚡)

1. Abre tu espacio de trabajo en **n8n**.
2. Haz clic en **Add workflow** (o `+`).
3. Abre el archivo [`workflows/01_musa_mentoria_evolutiva.json`](../workflows/01_musa_mentoria_evolutiva.json) en tu editor, selecciona todo el contenido (`Ctrl + A`) y cópialo (`Ctrl + C`).
4. Haz clic sobre el lienzo en blanco de n8n y presiona **`Ctrl + V`** (en Mac: `Cmd + V`).
5. ¡Listo! Todo el flujo con sus nodos, notas adhesivas y conexiones aparecerá en pantalla.

Repite el mismo paso para:
* [`workflows/02_musa_recordatorios_retos.json`](../workflows/02_musa_recordatorios_retos.json)
* [`workflows/03_musa_api_portafolio.json`](../workflows/03_musa_api_portafolio.json)

---

## Método 2: Importar desde Archivo

1. En el editor de n8n, haz clic en el menú de **tres puntos (...)** en la esquina superior derecha.
2. Selecciona **Import from File**.
3. Selecciona el archivo `.json` de la carpeta `workflows/`.

---

## Conectar tus Credenciales

1. **Google Gemini (Google Cloud / AI Studio):**
   * Abre el nodo **Modelo Google Gemini**.
   * En el campo de credencial, selecciona **Create New Credential**.
   * Pega tu clave de API gratuita de [Google AI Studio](https://aistudio.google.com/).
   * Guarda la credencial.

2. **Supabase (Opcional si usas los datos mockeados):**
   * En el SQL Editor de tu proyecto en Supabase, copia y pega el script [`supabase/schema.sql`](../supabase/schema.sql) y ejecuta **Run**.
   * Si deseas cargar datos de prueba, ejecuta [`supabase/seed_demo.sql`](../supabase/seed_demo.sql).

---

## Probar la Demo Rápida

1. En el workflow `01_musa_mentoria_evolutiva`, haz clic en el botón de ejecución manual del nodo **Al tocar Execute (Demo rápida)** o en **Test step**.
2. Verás cómo todo el flujo se procesa en verde y genera el reporte evolutivo de Camila en el nodo final.
