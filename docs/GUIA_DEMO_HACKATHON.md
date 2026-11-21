# Guía de Presentación y Demo (15:00) · Musa Studio

Esta guía está diseñada según las pautas oficiales de **Nodo Cero**:
* **Sin proyector:** Presentarán desde su laptop frente al jurado.
* **Tiempo estimado:** 2 a 3 minutos en total.

---

## 1. Preparación de Pantallas y Pestañas (Antes de las 14:45)

Abran su navegador con zoom en **125% o 150%** (`Ctrl` + `+`) para que el jurado pueda leer con facilidad desde arriba o desde el fondo. Tengan preparadas las siguientes pestañas **en este orden exacto**:

1. **Pestaña 1:** Portada en la web de Nodo Cero (`nodo-cero-bo.github.io`) en **Modo Presentación** con el nombre del equipo y proyecto en pantalla completa.
2. **Pestaña 2:** Formulario de entrega de Musa Studio (`/form/musa-entrega`) en n8n.
3. **Pestaña 3:** Canvas del Workflow `01 · Mentoría Creativa Evolutiva` en n8n (limpio y con las notas adhesivas visibles).
4. **Pestaña 4:** Base de datos en **Supabase** mostrando la tabla `obras` (donde ya figura el boceto de la Semana 1 de Camila).

---

## 2. Guion de la Presentación (Paso a Paso)

### Minuto 0:00 a 0:30 · El Problema
> *"Buenas tardes al jurado. Hoy en Bolivia, miles de jóvenes de 15 a 30 años comienzan a dibujar o pintar con gran ilusión, pero practican en soledad. Sin una guía constructiva ni un registro organizado de su evolución, sienten que no mejoran y terminan abandonando su pasión artística."*

### Minuto 0:30 a 1:00 · La Solución
> *"Para resolver esto creamos **Musa Studio**: una plataforma de mentoría creativa con inteligencia artificial y **memoria evolutiva** orquestada con **n8n**. A diferencia de un chat genérico, Musa recuerda los trabajos anteriores de la creadora, evalúa su progreso técnico en el tiempo, celebra sus victorias y le asigna retos periódicos para mantener su constancia."*

### Minuto 1:00 a 2:15 · La Demo en Vivo
1. **Mostrar la Entrada (Pestaña 2):**
   * *"Aquí tenemos a Camila, una joven artista de 19 años. La semana pasada subió un boceto con problemas de asimetría en los ojos y sombreado plano (Semana 1). Hoy sube su nuevo avance de Semana 2 aplicando líneas guía y lápiz 4B."*
   * Tocan el botón de enviar o ejecutan en n8n.
2. **Mostrar el Flujo en n8n (Pestaña 3):**
   * *"En el canvas de n8n vemos cómo fluyen los datos:*
     * *1. Se capturan las notas reflexivas y la obra.*
     * *2. Se conecta con **Supabase** para extraer el contexto de su última entrega.*
     * *3. **Google Gemini** realiza una comparativa evolutiva evaluando mejoras de técnica y proporción.*
     * *4. Se calcula la ganancia de progreso y se almacena el nuevo reto."*
3. **Mostrar el Resultado (Pestaña 4 / Página Final):**
   * *"¡Y aquí está el feedback de Musa! Destaca un salto del **+22%** en precisión anatómica, felicita a Camila por alinear los ojos en perspectiva 3/4, le sugiere cómo suavizar sombras y le activa su reto de la semana."*

### Minuto 2:15 a 2:45 · Qué Sigue y Mención
> *"El sistema también cuenta con un workflow de **constancia** que monitorea retos pendientes y envía recordatorios amigables para evitar el bloqueo creativo.*
> *Postulamos a la mención **Mejor uso de Google Cloud** gracias a la integración de **Google Gemini** para análisis multimodal y evaluación técnica.*
> *El siguiente paso es integrar login con Clerk y galerías comunitarias. ¡Muchas gracias!"*

---

## 3. Plan B por si Falla el Wi-Fi o una Conexión

Si la red local del Centro de Educación Ambiental se satura durante la presentación:
1. **No se disculpen.** Pasen inmediatamente al Plan B con naturalidad:
   > *"Les mostramos la ejecución completa que procesamos hace unos minutos."*
2. Abran la pestaña **Executions** en n8n: allí verán la ejecución exitosa en verde, mostrando exactamente qué entró y qué salió de cada nodo.
3. El workflow incluye **Pin Data** en el nodo final (`Estructurar Reporte Evolutivo`), por lo que los datos del reporte de Camila están guardados en el lienzo y se pueden visualizar en cualquier momento.
