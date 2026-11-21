# Cómo Importar los Workflows a n8n Cloud (Para Jael)

Tus 3 workflows están listos para ser importados a **n8n Cloud** en menos de 2 minutos:

---

## Workflows a Importar

| Archivo | Nombre en n8n | Propósito |
| :--- | :--- | :--- |
| [`workflows/01-onboarding-perfil.json`](../workflows/01-onboarding-perfil.json) | **01 Onboarding Perfil** | Recibe webhook de Clerk y crea el perfil en Supabase. |
| [`workflows/02-analizar-obra.json`](../workflows/02-analizar-obra.json) | **02 Analizar Obra (Núcleo)** | Genera URL firmada, consulta memoria, evalúa con Gemini Vision y responde a Next.js. |
| [`workflows/03-recordatorios-practica.json`](../workflows/03-recordatorios-practica.json) | **03 Recordatorios de Práctica** | Schedule Trigger que busca retos vencidos en Supabase y actualiza la próxima fecha. |

---

## Paso a Paso Rápido (Método Copiar y Pegar ⚡)

1. Abre tu espacio en **n8n Cloud**.
2. Haz clic en **Add workflow** (`+`).
3. Abre el archivo [`workflows/02-analizar-obra.json`](../workflows/02-analizar-obra.json), selecciona todo (`Ctrl + A`) y copia (`Ctrl + C`).
4. Haz clic en el lienzo vacío de n8n y presiona **`Ctrl + V`**.
5. Conecta tu credencial de **Google Gemini API** (Google AI Studio gratuita o Vertex AI) en el nodo **Modelo Google Gemini**.
6. Haz clic en **Save** y luego en **Active / Publish**.

*(Repite lo mismo para `01-onboarding-perfil.json` y `03-recordatorios-practica.json`)*.

---

## URLs de Webhooks para compartir con Integrante 3 (Next.js)

Una vez que actives tus workflows en n8n Cloud, copia las URLs de producción y pásaselas al compañero de Next.js:

* **Endpoint Analizar Obra (POST):**
  `https://TU-N8N.app.n8n.cloud/webhook/analizar-obra`
  * Recibe: `{ "clerk_user_id": "...", "imagen_path": "...", "notas_usuaria": "..." }`
  * Devuelve: `{ "aciertos": [...], "consejo_tecnico": "...", "comparacion": "...", "siguiente_reto": "...", "mensaje": "..." }`

* **Endpoint Onboarding Clerk (POST):**
  `https://TU-N8N.app.n8n.cloud/webhook/clerk-onboarding`
