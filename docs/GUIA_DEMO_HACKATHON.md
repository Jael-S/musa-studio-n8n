# Guía de Presentación Oficial (15:00) · Musa Studio
**Hackathon Nodo Cero Bolivia 2026**  
*Modalidad: Sin proyector (presentación en laptop del equipo frente al jurado)*  
*Tiempo Total: 3 minutos exactos*

---

## 👥 Roles y Minutero del Equipo

```
[0:00 - 0:40]  ──>  Integrante 1 (Supabase): Problema y Solución
[0:40 - 1:50]  ──>  Integrante 3 (Next.js): Demo Frontend (Login + Subida + Feedback)
[1:50 - 2:35]  ──>  Integrante 2 (Jael - n8n): Demo Backend (Canvas n8n + Gemini Vision + Memoria)
[2:35 - 3:00]  ──>  Integrante 1 (Supabase): Cierre, Recordatorios e Impacto
```

---

## 🎤 Guion Minuto a Minuto

### 1. [0:00 – 0:40] Integrante 1 · El Problema y la Solución
> *"Buenas tardes al jurado. Hoy en Bolivia, miles de jóvenes artistas y creadoras de 15 a 30 años practican dibujo o pintura en soledad. Sin feedback constante ni registro de sus avances, sienten que no mejoran y abandonan sus metas creativas.*
> *Para resolver esto creamos **Musa Studio**: una plataforma privada de mentoría artística con **memoria evolutiva**. A diferencia de un chat genérico, Musa recuerda los trabajos anteriores de la creadora, evalúa su progreso técnico en el tiempo, celebra sus victorias y le asigna retos para mantener su constancia."*

---

### 2. [0:40 – 1:50] Integrante 3 · Demo de Usuaria en Next.js
*(Muestra su pantalla con la app web Next.js)*
> *"Aquí vemos la experiencia de **Camila**, una joven artista:*
> *1. Inicia sesión de forma segura con **Clerk**.*
> *2. En su perfil vemos su disciplina ('Dibujo a grafito') y su meta ('Dominar simetría y volumen en rostros').*
> *3. Camila sube su nuevo avance al bucket privado de **Supabase Storage** con sus notas personales: 'Apliqué líneas guía para los ojos y cambié al lápiz 4B para el pómulo'.*
> *4. Al tocar 'Recibir Mentoría', la app dispara el backend en **n8n**... y en segundos recibe su panel con aciertos, consejo técnico, comparativa con la semana 1 y su nuevo reto."*

---

### 3. [1:50 – 2:35] Integrante 2 (Jael) · Demo Backend en n8n Cloud + Gemini
*(Muestras tu pantalla con el canvas de n8n con zoom 125% y nodos claros)*
> *"Detrás de escena, este es el motor en **n8n**:*
> *1. **Workflow 1 (Onboarding):** Cuando Camila se registró en Clerk, n8n recibió el webhook y creó su fila en la tabla `perfiles` de Supabase.*
> *2. **Workflow 2 (Analizar Obra - Núcleo):** Al recibir la petición de Next.js, n8n genera una **URL firmada temporal** en Supabase Storage para leer la imagen privada de forma segura.*
> *3. Consulta en Supabase las **últimas obras** de Camila para armar su **memoria evolutiva**.*
> *4. Enviamos a **Google Gemini 2.0 Flash** la imagen, las notas y el historial previo. Gemini razona sobre el trazo y devuelve un JSON estricto con aciertos, consejo técnico y comparativa.*
> *5. n8n guarda el análisis en `obras_progreso` y devuelve el JSON a Next.js en tiempo real."*

---

### 4. [2:35 – 3:00] Integrante 1 · Cierre, Recordatorios y Mención Especial
*(Vuelven a la portada o muestran el Workflow 3)*
> *"Para evitar el abandono, el **Workflow 3** revisa periódicamente los retos vencidos en Supabase y envía **recordatorios de constancia** para invitar a la artista a dibujar 15 minutos hoy sin frustración.*
> *Postulamos a la mención **Mejor uso de Google Cloud** por la integración multimodal y razonamiento de **Google Gemini**.*
> *¡Musa Studio transforma la práctica solitaria en un camino de crecimiento constante! Muchas gracias."*

---

## 🛡️ Plan B de Jael (Si falla el Wi-Fi)
1. En tu n8n, ten abierta la pestaña **Executions** con la ejecución previa en verde.
2. Si la red se corta, dices con seguridad:
   > *"Les muestro en vivo la ejecución que procesamos en n8n hace unos minutos con la entrada, la llamada a Gemini y la salida en Supabase."*
3. Muestras los datos fijados (**Pin Data**) en el nodo final `Devolver JSON a Next.js`.
