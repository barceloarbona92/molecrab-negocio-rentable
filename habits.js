// Banco de 42 micro-acciones antidopamina
// Cada acción: {id, emoji, name, desc, cat, min (minutos), diff (1-5),
//                dop (score dopamina reset), foc (focus), ene (energy), triggers[]}
//
// Categorías: screen, body, mind, social, sleep, food, nature
// Triggers: scroll, phone, sugar, insomnia, anxiety, loneliness, boredom, procrast
//
// Usado por el solver en app.js
window.HABIT_POOL = [
  // ---------- SCREEN ----------
  { id: "sc1", emoji: "📵", name: "Modo gris 24h",             desc: "Activa escala de grises en el móvil durante todo un día.",                    cat: "screen",  min: 0,  diff: 2, dop: 9, foc: 8, ene: 6, triggers: ["phone","scroll"] },
  { id: "sc2", emoji: "🔕", name: "Notificaciones off",        desc: "Desactiva todas las notificaciones excepto llamadas.",                         cat: "screen",  min: 3,  diff: 1, dop: 8, foc: 9, ene: 5, triggers: ["phone","anxiety","procrast"] },
  { id: "sc3", emoji: "📱", name: "Cajón del móvil",           desc: "Deja el teléfono en un cajón 2h sin acceso visual.",                           cat: "screen",  min: 0,  diff: 3, dop: 8, foc: 9, ene: 4, triggers: ["scroll","phone","procrast"] },
  { id: "sc4", emoji: "⏰", name: "Sin pantalla 1h tras despertar", desc: "Los primeros 60 min del día sin móvil ni PC ni TV.",                   cat: "screen",  min: 0,  diff: 3, dop: 9, foc: 8, ene: 7, triggers: ["phone","scroll"] },
  { id: "sc5", emoji: "🚫", name: "App blockers",              desc: "Instala un blocker para redes 2h del día.",                                    cat: "screen",  min: 5,  diff: 1, dop: 7, foc: 8, ene: 5, triggers: ["scroll","procrast"] },
  { id: "sc6", emoji: "🌑", name: "Pantalla monocroma noche",  desc: "Filtro rojo/B&W 1h antes de dormir.",                                          cat: "screen",  min: 1,  diff: 1, dop: 6, foc: 5, ene: 7, triggers: ["insomnia","phone"] },

  // ---------- BODY ----------
  { id: "bd1", emoji: "🏃", name: "Caminar 20 min sin móvil",  desc: "Paseo en silencio, sin auriculares, sin audiolibro.",                          cat: "body",    min: 20, diff: 2, dop: 8, foc: 7, ene: 8, triggers: ["scroll","anxiety","boredom"] },
  { id: "bd2", emoji: "💪", name: "3 series de 10 flexiones",  desc: "Flexiones + sentadillas + abdominales. 5 min.",                                cat: "body",    min: 5,  diff: 2, dop: 7, foc: 6, ene: 9, triggers: ["procrast","anxiety"] },
  { id: "bd3", emoji: "🧊", name: "Ducha fría 60s",            desc: "Termina la ducha con 60 segundos de agua fría.",                               cat: "body",    min: 1,  diff: 3, dop: 9, foc: 9, ene: 9, triggers: ["procrast","anxiety"] },
  { id: "bd4", emoji: "☀️", name: "Sol directo 10 min AM",     desc: "Luz natural en los ojos 10 min tras despertar.",                               cat: "body",    min: 10, diff: 1, dop: 8, foc: 8, ene: 9, triggers: ["insomnia","anxiety"] },
  { id: "bd5", emoji: "🧘", name: "Respiración 4-7-8",         desc: "4 inhalo, 7 retengo, 8 exhalo. 4 ciclos.",                                      cat: "body",    min: 3,  diff: 1, dop: 6, foc: 7, ene: 5, triggers: ["anxiety","insomnia"] },
  { id: "bd6", emoji: "🧍", name: "Estiramiento 5 min",        desc: "Columna, cadera, cervicales. Cada 3h de silla.",                                cat: "body",    min: 5,  diff: 1, dop: 5, foc: 6, ene: 6, triggers: ["procrast","anxiety"] },

  // ---------- MIND ----------
  { id: "mn1", emoji: "📖", name: "Lectura en papel 15 min",   desc: "Un libro físico, no Kindle, no PDF. 15 min mínimo.",                           cat: "mind",    min: 15, diff: 2, dop: 8, foc: 9, ene: 5, triggers: ["scroll","boredom"] },
  { id: "mn2", emoji: "✍️", name: "Journaling libre 5 min",    desc: "Papel y boli. Lo que sea. No corregir ni releer.",                             cat: "mind",    min: 5,  diff: 1, dop: 7, foc: 8, ene: 5, triggers: ["anxiety","boredom"] },
  { id: "mn3", emoji: "🧠", name: "Aburrimiento activo 10 min",desc: "Sentado, sin móvil, sin música. Solo tú y tu mente.",                          cat: "mind",    min: 10, diff: 4, dop: 9, foc: 9, ene: 4, triggers: ["scroll","boredom","phone"] },
  { id: "mn4", emoji: "🎯", name: "Pomodoro 25/5",             desc: "Un bloque de trabajo profundo sin cambiar contexto.",                          cat: "mind",    min: 30, diff: 2, dop: 7, foc: 9, ene: 6, triggers: ["procrast","scroll"] },
  { id: "mn5", emoji: "📝", name: "Lista de gratitud x3",      desc: "3 cosas concretas que valoras hoy. No genéricas.",                             cat: "mind",    min: 3,  diff: 1, dop: 6, foc: 5, ene: 5, triggers: ["anxiety","loneliness"] },
  { id: "mn6", emoji: "🎵", name: "Música instrumental 20 min",desc: "Sin letra, sin redes al lado. Solo música.",                                    cat: "mind",    min: 20, diff: 1, dop: 6, foc: 7, ene: 5, triggers: ["scroll","boredom"] },

  // ---------- SOCIAL ----------
  { id: "so1", emoji: "📞", name: "Llamada a alguien 10 min",  desc: "Voz, no WhatsApp. A alguien que importa.",                                     cat: "social",  min: 10, diff: 2, dop: 7, foc: 5, ene: 7, triggers: ["loneliness","scroll"] },
  { id: "so2", emoji: "🤝", name: "Saludar a un vecino",       desc: "Contacto humano real. Sin agenda ni objetivo.",                                 cat: "social",  min: 2,  diff: 2, dop: 6, foc: 5, ene: 6, triggers: ["loneliness"] },
  { id: "so3", emoji: "✉️", name: "Escribir carta a mano",     desc: "Papel, sobre, sello. A alguien vivo.",                                          cat: "social",  min: 20, diff: 3, dop: 8, foc: 7, ene: 5, triggers: ["loneliness","scroll"] },
  { id: "so4", emoji: "🍽️", name: "Comida con alguien sin móvil", desc: "Móviles apilados en el centro. Pierde quien toca.",                        cat: "social",  min: 30, diff: 2, dop: 7, foc: 7, ene: 6, triggers: ["phone","loneliness"] },

  // ---------- SLEEP ----------
  { id: "sl1", emoji: "🌙", name: "Acostarse antes de las 23h",desc: "A las 23:00 luces apagadas. Sin excepciones.",                                 cat: "sleep",   min: 0,  diff: 3, dop: 9, foc: 8, ene: 9, triggers: ["insomnia","phone"] },
  { id: "sl2", emoji: "🛌", name: "Cuarto frío (<19°C)",       desc: "Termostato bajo. Mejor calidad de sueño.",                                      cat: "sleep",   min: 1,  diff: 1, dop: 7, foc: 7, ene: 8, triggers: ["insomnia"] },
  { id: "sl3", emoji: "🚫📱", name: "Móvil fuera del dormitorio", desc: "Cargador en otra habitación. Despertador clásico.",                          cat: "sleep",   min: 0,  diff: 3, dop: 9, foc: 8, ene: 9, triggers: ["phone","insomnia","scroll"] },
  { id: "sl4", emoji: "☕", name: "Sin cafeína después de 14h",desc: "Corte total. Incluye té, cola, chocolate.",                                     cat: "sleep",   min: 0,  diff: 3, dop: 7, foc: 8, ene: 9, triggers: ["insomnia","anxiety"] },
  { id: "sl5", emoji: "📓", name: "Brain dump nocturno",       desc: "5 min escribiendo todo lo pendiente antes de dormir.",                         cat: "sleep",   min: 5,  diff: 1, dop: 6, foc: 6, ene: 7, triggers: ["insomnia","anxiety"] },

  // ---------- FOOD ----------
  { id: "fd1", emoji: "🥗", name: "Desayuno sin azúcar",       desc: "Proteína + grasa. Nada de cereales ni bollería.",                              cat: "food",    min: 10, diff: 2, dop: 7, foc: 8, ene: 8, triggers: ["sugar","anxiety"] },
  { id: "fd2", emoji: "💧", name: "2L de agua al día",         desc: "Botella visible. Marca horarios.",                                              cat: "food",    min: 2,  diff: 1, dop: 5, foc: 7, ene: 8, triggers: ["anxiety"] },
  { id: "fd3", emoji: "🍫", name: "Sin dulces procesados 24h", desc: "Ni un caramelo. Ni un refresco. Ni un bollo.",                                  cat: "food",    min: 0,  diff: 3, dop: 9, foc: 7, ene: 7, triggers: ["sugar"] },
  { id: "fd4", emoji: "⏱️", name: "Ayuno de 14h",              desc: "Cena a las 20h, desayuno a las 10h. Sin picar.",                                cat: "food",    min: 0,  diff: 3, dop: 8, foc: 8, ene: 7, triggers: ["sugar"] },
  { id: "fd5", emoji: "🍵", name: "Té verde en vez de café",   desc: "Una comida al día cambia café por té verde.",                                   cat: "food",    min: 3,  diff: 1, dop: 5, foc: 6, ene: 6, triggers: ["anxiety"] },

  // ---------- NATURE ----------
  { id: "nt1", emoji: "🌳", name: "20 min en naturaleza",      desc: "Parque, monte, playa. Sin auriculares.",                                        cat: "nature",  min: 20, diff: 2, dop: 9, foc: 8, ene: 8, triggers: ["anxiety","scroll","loneliness"] },
  { id: "nt2", emoji: "🌱", name: "Cuidar una planta",         desc: "Riégala, háblale si quieres. Observa.",                                         cat: "nature",  min: 3,  diff: 1, dop: 5, foc: 5, ene: 5, triggers: ["loneliness","boredom"] },
  { id: "nt3", emoji: "👣", name: "Caminar descalzo 5 min",    desc: "Hierba, arena o suelo frío.",                                                   cat: "nature",  min: 5,  diff: 1, dop: 6, foc: 6, ene: 7, triggers: ["anxiety"] },

  // ---------- MISC ----------
  { id: "ms1", emoji: "🧹", name: "Ordenar 1 zona 10 min",     desc: "Escritorio, cajón, mesilla. Una zona, 10 min.",                                cat: "mind",    min: 10, diff: 1, dop: 6, foc: 7, ene: 6, triggers: ["procrast","anxiety"] },
  { id: "ms2", emoji: "🎨", name: "Dibujar/colorear 15 min",   desc: "No hace falta saber. Solo mano + papel.",                                      cat: "mind",    min: 15, diff: 1, dop: 7, foc: 7, ene: 5, triggers: ["scroll","boredom","anxiety"] },
  { id: "ms3", emoji: "🧩", name: "Puzzle físico 15 min",      desc: "Sudoku en papel, rompecabezas, crucigrama.",                                   cat: "mind",    min: 15, diff: 1, dop: 6, foc: 8, ene: 5, triggers: ["scroll","boredom"] },
  { id: "ms4", emoji: "🎤", name: "Cantar una canción entera", desc: "Sin música. Solo tu voz. En alto.",                                             cat: "mind",    min: 3,  diff: 2, dop: 7, foc: 5, ene: 7, triggers: ["boredom","anxiety"] },
  { id: "ms5", emoji: "🙅", name: "Di 'no' a un compromiso",   desc: "Cancela algo no esencial esta semana.",                                         cat: "mind",    min: 2,  diff: 3, dop: 7, foc: 7, ene: 6, triggers: ["anxiety","procrast"] },
];
