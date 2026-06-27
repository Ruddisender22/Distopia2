window.RACES_DATA = [
  {
    "name": "Humano",
    "emoji": "🧑",
    "impact": "none",
    "description": "Ser humano estándar. Sin poderes ni debilidades, conserva las mecánicas y estadísticas base del juego.",
    "traits": []
  },
  {
    "name": "Abisal",
    "emoji": "🐙",
    "impact": "high",
    "description": "Criatura marina rápida y resistente en el agua, capaz de invocar guardianes. Es lenta en tierra y se asfixia si pasa demasiado tiempo fuera del agua. Aparece en océanos.",
    "traits": [
      {
        "name": "Respiración branquial",
        "desc": "Respira agua en lugar de aire y tiene visión submarina clara.",
        "type": "buff",
        "icon": "🤿",
        "key": null
      },
      {
        "name": "Corriente profunda / Nadador natural",
        "desc": "Movimiento mucho más rápido y eficiente bajo el agua.",
        "type": "buff",
        "icon": "🌊",
        "key": null
      },
      {
        "name": "Visión profunda",
        "desc": "Visión adaptada a la oscuridad absoluta.",
        "type": "buff",
        "icon": "👁️",
        "key": null
      },
      {
        "name": "Espinas de presión",
        "desc": "Devuelve el 30% del daño recibido a sus atacantes.",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Piel endurecida",
        "desc": "+2 corazones de vida máxima.",
        "type": "buff",
        "icon": "❤️",
        "key": null
      },
      {
        "name": "Adaptación acuática",
        "desc": "Mina a velocidad normal bajo el agua.",
        "type": "buff",
        "icon": "⛏️",
        "key": null
      },
      {
        "name": "Tridente abisal",
        "desc": "Apareces inicialmente con un tridente encantado (Reparación, Irrompibilidad III, Propulsión Acuática III).",
        "type": "buff",
        "icon": "🔱",
        "key": null
      },
      {
        "name": "Comando abisal [V]",
        "desc": "Invoca hasta 2 guardianes aliados para luchar. Cuesta 5 de Esencia. Recarga de 20 segundos. Si el guardián muere en combate, recibes 1 punto de daño.",
        "type": "ability",
        "icon": "⚡",
        "key": "V"
      },
      {
        "name": "Piscívoro",
        "desc": "Solo puede comer pescado.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Adaptación cruda",
        "desc": "El salmón y bacalao crudos alimentan lo mismo que sus versiones cocinadas.",
        "type": "buff",
        "icon": "🍣",
        "key": null
      },
      {
        "name": "Caminante terrestre",
        "desc": "Movimiento un 10% más lento en tierra firme.",
        "type": "debuff",
        "icon": "🐢",
        "key": null
      },
      {
        "name": "Desecación",
        "desc": "La barra de oxígeno se consume fuera del agua, provocando asfixia al vaciarse.",
        "type": "debuff",
        "icon": "☠️",
        "key": null
      },
      {
        "name": "Esencia",
        "desc": "Energía abisal utilizada para lanzar la habilidad de Comando.",
        "type": "resource",
        "icon": "🧪",
        "key": null
      }
    ]
  },
  {
    "name": "Mago de Aire (Air Mage)",
    "emoji": "💨",
    "impact": "high",
    "description": "Aeromante ágil que controla el viento para atacar y moverse. Es muy rápido y ligero, pero también muy frágil.",
    "traits": [
      {
        "name": "Carga de viento [V]",
        "desc": "Dispara una ráfaga que empuja a los objetivos al impactar.",
        "type": "ability",
        "icon": "⚡",
        "key": "V"
      },
      {
        "name": "Tornado [G]",
        "desc": "Lanza un proyectil que crea un tornado. Atrae, levanta y hace girar a las entidades cercanas durante 4 segundos. Cuesta 4 de maná.",
        "type": "ability",
        "icon": "🌀",
        "key": "G"
      },
      {
        "name": "Corriente ascendente [N]",
        "desc": "Te impulsa hacia arriba sobre una columna de aire.",
        "type": "ability",
        "icon": "💨",
        "key": "N"
      },
      {
        "name": "Aterrizaje amortiguado",
        "desc": "Inmunidad al daño por caída.",
        "type": "buff",
        "icon": "⚔️",
        "key": null
      },
      {
        "name": "Céfiro",
        "desc": "Movimiento un 20% más rápido a pie.",
        "type": "buff",
        "icon": "⚡",
        "key": null
      },
      {
        "name": "Caída lenta [B] (Alternable)",
        "desc": "Desciendes suavemente. Puedes desactivarlo con la misma tecla si necesitas caer rápido.",
        "type": "ability",
        "icon": "🪶",
        "key": "B"
      },
      {
        "name": "Cuerpo frágil",
        "desc": "-2 corazones de vida máxima.",
        "type": "buff",
        "icon": "⚡",
        "key": null
      },
      {
        "name": "Peso ligero",
        "desc": "Recibes un 50% más de empuje (knockback) de los ataques.",
        "type": "debuff",
        "icon": "🪶",
        "key": null
      },
      {
        "name": "Maná",
        "desc": "Energía mágica necesaria para lanzar las habilidades.",
        "type": "resource",
        "icon": "🔮",
        "key": null
      }
    ]
  },
  {
    "name": "Arácnido (Arachnid)",
    "emoji": "🕷️",
    "impact": "medium",
    "description": "Ágiles humanoides-araña capaces de escalar paredes, lanzar telarañas y atacar con colmillos venenosos.",
    "traits": [
      {
        "name": "Escalada de muros",
        "desc": "Trepa cualquier superficie vertical. Presiona contra una pared para agarrarte, salta para subir y agáchate para mantenerte en el sitio. Inmunidad al daño por caída mientras estás agarrado.",
        "type": "buff",
        "icon": "🧗",
        "key": null
      },
      {
        "name": "Caminante de telarañas",
        "desc": "Te mueves por las telarañas sin ralentizarte y las rompes casi al instante.",
        "type": "buff",
        "icon": "🕸️",
        "key": null
      },
      {
        "name": "Artrópodo",
        "desc": "Eres clasificado como artrópodo, por lo que recibes daño extra de armas con el encantamiento Perdición de los Artrópodos.",
        "type": "debuff",
        "icon": "🕷️",
        "key": null
      },
      {
        "name": "Colmillo de araña",
        "desc": "Tus ataques cuerpo a cuerpo inyectan veneno (Veneno I durante 3 segundos al objetivo).",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Disparo de telaraña [V]",
        "desc": "Lanza un proyectil que coloca una telaraña al impactar, atrapando lo que toque. Cuesta 2 de energía.",
        "type": "ability",
        "icon": "🕸️",
        "key": "V"
      },
      {
        "name": "Energía",
        "desc": "Recurso interno necesario para usar tus habilidades.",
        "type": "resource",
        "icon": "⚡",
        "key": null
      }
    ]
  },
  {
    "name": "Asura",
    "emoji": "👹",
    "impact": "high",
    "description": "Un berserker frágil que se vuelve más rápido y fuerte cuanto más cerca está de la muerte. Drena vida con sus ataques y desata una furia imparable en combate.",
    "traits": [
      {
        "name": "Cuerpo frágil",
        "desc": "Tu salud máxima se reduce en 3 corazones.",
        "type": "buff",
        "icon": "⚡",
        "key": null
      },
      {
        "name": "Furia de sangre I",
        "desc": "Por debajo de dos tercios de tu salud máxima, obtienes Fuerza I y Velocidad I.",
        "type": "buff",
        "icon": "🩸",
        "key": null
      },
      {
        "name": "Furia de sangre II",
        "desc": "Por debajo del 40% de salud, obtienes Fuerza II y Velocidad II.",
        "type": "buff",
        "icon": "🩸",
        "key": null
      },
      {
        "name": "Furia de sangre III",
        "desc": "Al llegar al 25% de salud, te conviertes en un Asura y obtienes Fuerza III y Velocidad III.",
        "type": "buff",
        "icon": "🩸",
        "key": null
      },
      {
        "name": "Ira inamovible",
        "desc": "Al 25% de salud, nada puede moverte (100% de resistencia al empuje).",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Golpe de Asura [V]",
        "desc": "Te lanzas hacia adelante y golpeas el suelo, lanzando por los aires a todos los enemigos cercanos.",
        "type": "ability",
        "icon": "⚡",
        "key": "V"
      },
      {
        "name": "Frenesí [G]",
        "desc": "Estallas en furia de batalla y obtienes Fuerza II, Velocidad II y Resistencia I durante 6 segundos.",
        "type": "ability",
        "icon": "🔥",
        "key": "G"
      }
    ]
  },
  {
    "name": "Autómata (Automaton)",
    "emoji": "🤖",
    "impact": "high",
    "description": "Un constructo mecánico que no necesita respirar ni comer. Sin embargo, las pociones de curación no le afectan, su recuperación natural es extremadamente lenta y sus movimientos son pesados.",
    "traits": [
      {
        "name": "Estructura de hierro",
        "desc": "Resistencia I permanente.",
        "type": "buff",
        "icon": "⚙️",
        "key": null
      },
      {
        "name": "Chasis sellado",
        "desc": "No necesita respirar y no puede ahogarse.",
        "type": "buff",
        "icon": "🫁",
        "key": null
      },
      {
        "name": "Motor perpetuo",
        "desc": "Nunca tiene hambre, ya que funciona con una fuente de energía interna.",
        "type": "buff",
        "icon": "🔋",
        "key": null
      },
      {
        "name": "Cuerpo mecánico",
        "desc": "Inmune a los efectos de Regeneración, Curación instantánea y Veneno. El resto de pociones le afectan normalmente.",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Óptica nocturna",
        "desc": "Sensores integrados que le permiten ver claramente en la oscuridad.",
        "type": "buff",
        "icon": "👁️",
        "key": null
      },
      {
        "name": "Chasis pesado",
        "desc": "Su velocidad de movimiento se reduce en un 15%.",
        "type": "debuff",
        "icon": "🐢",
        "key": null
      },
      {
        "name": "Articulaciones rígidas",
        "desc": "Su regeneración de salud natural funciona a un 25% de la velocidad normal.",
        "type": "debuff",
        "icon": "🩹",
        "key": null
      },
      {
        "name": "Estructura anclada",
        "desc": "40% de resistencia al empuje (knockback) gracias a su gran peso.",
        "type": "buff",
        "icon": "⚓",
        "key": null
      }
    ]
  },
  {
    "name": "Aviar (Avian)",
    "emoji": "🦅",
    "impact": "low",
    "description": "Un ser alado que desciende con gracia, no teme a las alturas y observa el mundo desde arriba.",
    "traits": [
      {
        "name": "Peso pluma",
        "desc": "Inmune al daño por caída.",
        "type": "buff",
        "icon": "🪶",
        "key": null
      },
      {
        "name": "Caída lenta [V] (Alternable)",
        "desc": "Te permite descender suavemente. Viene desactivada por defecto. Nota: mantén esta habilidad desactivada si quieres asestar golpes críticos en combate, ya que requieren una caída a velocidad normal.",
        "type": "ability",
        "icon": "🪶",
        "key": "V"
      },
      {
        "name": "Dieta de atleta",
        "desc": "Todas tus acciones consumen un 75% menos de energía (hambre).",
        "type": "buff",
        "icon": "🥗",
        "key": null
      },
      {
        "name": "Vista aguda",
        "desc": "Visión mejorada que te permite ver un poco mejor en la oscuridad.",
        "type": "buff",
        "icon": "👁️",
        "key": null
      },
      {
        "name": "Huesos huecos",
        "desc": "Tu salud máxima se reduce en 1 corazón.",
        "type": "debuff",
        "icon": "💔",
        "key": null
      },
      {
        "name": "Salto de pluma [G]",
        "desc": "Realizas un salto rápido hacia arriba impulsado por tus alas. No consume barra de hambre.",
        "type": "ability",
        "icon": "🪶",
        "key": "G"
      }
    ]
  },
  {
    "name": "Blazeling",
    "emoji": "🔥",
    "impact": "high",
    "description": "Criatura nacida de los fuegos del Nether. Posee escamas de azufre y prospera en este reino oscuro, pero el agua y la lluvia son letales para él. Aparece inicialmente en el Nether.",
    "traits": [
      {
        "name": "Corazón de brasas",
        "desc": "Inmunidad total al fuego, la lava, los bloques de magma y las quemaduras.",
        "type": "buff",
        "icon": "🔥",
        "key": null
      },
      {
        "name": "Escamas de Blaze",
        "desc": "+3 corazones de vida máxima.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Nacido en el Nether",
        "desc": "Velocidad de movimiento aumentada mientras estés en el Nether (no muestra icono de efecto).",
        "type": "buff",
        "icon": "🔥",
        "key": null
      },
      {
        "name": "Calor interno",
        "desc": "Tu barra de hambre se agota un 25% más rápido.",
        "type": "debuff",
        "icon": "🍖",
        "key": null
      },
      {
        "name": "Debilidad al agua",
        "desc": "El agua actúa como veneno. Recibes 1.5 puntos de daño por segundo si estás en el agua o bajo la lluvia.",
        "type": "debuff",
        "icon": "💧",
        "key": null
      },
      {
        "name": "Visión térmica",
        "desc": "Visión adaptada que te permite ver claramente en la oscuridad.",
        "type": "buff",
        "icon": "👁️",
        "key": null
      },
      {
        "name": "Proyectil de fuego [V]",
        "desc": "Lanza una pequeña bola de fuego en la dirección que estés mirando. Cuesta 2 de energía. Tiene un tiempo de recarga de 4 segundos.",
        "type": "ability",
        "icon": "⚡",
        "key": "V"
      },
      {
        "name": "Puños de azufre",
        "desc": "Puedes minar con las manos desnudas al mismo nivel que un pico de piedra (puedes romper piedra, minerales y netherrack sin necesidad de herramientas).",
        "type": "buff",
        "icon": "⛏️",
        "key": null
      },
      {
        "name": "Dieta fúngica",
        "desc": "Puedes alimentarte de hongos carmesí y distorsionados (clic derecho) para restaurar 5 puntos de hambre y 0.6 de saturación.",
        "type": "buff",
        "icon": "🍄",
        "key": null
      },
      {
        "name": "Energía",
        "desc": "Recurso interno necesario para utilizar tus habilidades.",
        "type": "resource",
        "icon": "⚡",
        "key": null
      }
    ]
  },
  {
    "name": "Breeze",
    "emoji": "🌀",
    "impact": "high",
    "description": "Criatura de viento nacida en las Cámaras de las Pruebas (Trial Chambers). Es veloz, ágil en el aire y ataca con ráfagas, pero es extremadamente frágil.",
    "traits": [
      {
        "name": "Carga de viento [V]",
        "desc": "Lanza un proyectil de viento que empuja a los enemigos. Tiempo de recarga de 5 segundos.",
        "type": "ability",
        "icon": "⚡",
        "key": "V"
      },
      {
        "name": "Impulso de viento [G]",
        "desc": "Te propulsa rápidamente hacia adelante sobre una ráfaga de viento. Tiempo de recarga de 4 segundos.",
        "type": "ability",
        "icon": "⚡",
        "key": "G"
      },
      {
        "name": "Cojín de aire [N] (Alternable)",
        "desc": "El viento amortigua tu caída. Viene activado por defecto (desactívalo con la tecla si necesitas realizar golpes críticos).",
        "type": "ability",
        "icon": "⚡",
        "key": "N"
      },
      {
        "name": "Corriente ascendente [B] (Alternable)",
        "desc": "Obtienes Impulso de Salto II. Viene activado por defecto (desactívalo si prefieres la altura de salto normal).",
        "type": "ability",
        "icon": "💨",
        "key": "B"
      },
      {
        "name": "Viento a favor",
        "desc": "Te mueves un 15% más rápido.",
        "type": "buff",
        "icon": "💨",
        "key": null
      },
      {
        "name": "Cuerpo de voluta",
        "desc": "Tu salud máxima se reduce en 4 corazones.",
        "type": "debuff",
        "icon": "💔",
        "key": null
      },
      {
        "name": "Estructura ligera",
        "desc": "Tu tamaño es un 90% del de un jugador normal.",
        "type": "buff",
        "icon": "✨",
        "key": null
      }
    ]
  },
  {
    "name": "Nacido en Cuevas (Caveborn)",
    "emoji": "⛏️",
    "impact": "medium",
    "description": "Criado en la oscuridad profunda, puede comer piedra y picar minerales con las manos desnudas, pero se debilita bajo la luz del sol.",
    "traits": [
      {
        "name": "Adaptación a la oscuridad",
        "desc": "Visión adaptada a la oscuridad profunda, no requiere antorchas.",
        "type": "buff",
        "icon": "👁️",
        "key": null
      },
      {
        "name": "Pisada de cueva",
        "desc": "Inmune al daño por caída.",
        "type": "buff",
        "icon": "⛰️",
        "key": null
      },
      {
        "name": "Manos de minero",
        "desc": "Rompe todos los bloques el doble de rápido.",
        "type": "buff",
        "icon": "⛏️",
        "key": null
      },
      {
        "name": "Puños de piedra",
        "desc": "Extrae minerales y piedra con las manos desnudas al mismo nivel que un pico de piedra.",
        "type": "buff",
        "icon": "⛏️",
        "key": null
      },
      {
        "name": "Fortuna minera",
        "desc": "Mientras el efecto de Suerte esté activo (obtenido al comer diamante), los minerales sueltan botín como si se picaran con el encantamiento Fortuna II.",
        "type": "buff",
        "icon": "🪙",
        "key": null
      },
      {
        "name": "Devorador de piedra",
        "desc": "Puede comer roca (cobblestone), piedra, granito, diorita, andesita, toba (tuff), pizarra profunda (deepslate), basalto y piedra negra (blackstone) para obtener una nutrición modesta.",
        "type": "buff",
        "icon": "🧱",
        "key": null
      },
      {
        "name": "Paladar de hierro",
        "desc": "Puede comer lingotes de hierro, hierro crudo y pepitas de hierro.",
        "type": "buff",
        "icon": "⚙️",
        "key": null
      },
      {
        "name": "Paladar dorado",
        "desc": "Puede comer lingotes de oro, oro crudo y pepitas de oro.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Paladar de diamante",
        "desc": "Puede comer diamantes (su saturación es comparable a la de una zanahoria dorada).",
        "type": "buff",
        "icon": "💎",
        "key": null
      },
      {
        "name": "Paladar de netherita",
        "desc": "Puede comer lingotes y fragmentos de netherita.",
        "type": "buff",
        "icon": "🔥",
        "key": null
      },
      {
        "name": "Frenesí de hierro",
        "desc": "Comer hierro otorga Prisa minera I durante 60 segundos.",
        "type": "ability",
        "icon": "🔥",
        "key": null
      },
      {
        "name": "Fiebre del oro",
        "desc": "Comer oro otorga Velocidad I durante 2 minutos.",
        "type": "buff",
        "icon": "🪙",
        "key": null
      },
      {
        "name": "Claridad de diamante",
        "desc": "Comer diamante otorga Suerte II durante 5 minutos, lo que a su vez activa la habilidad de \"Fortuna minera\".",
        "type": "buff",
        "icon": "💎",
        "key": null
      },
      {
        "name": "Núcleo de netherita",
        "desc": "Comer netherita otorga Fuerza I y Resistencia I durante 5 minutos.",
        "type": "buff",
        "icon": "🔥",
        "key": null
      },
      {
        "name": "Sensibilidad al sol",
        "desc": "Se prende fuego y recibe 1 punto de daño por segundo al exponerse a la luz solar directa.",
        "type": "debuff",
        "icon": "☀️",
        "key": null
      },
      {
        "name": "Complexión compacta",
        "desc": "Su tamaño es un 85% del de un jugador normal, lo que facilita el paso por túneles estrechos.",
        "type": "debuff",
        "icon": "👶",
        "key": null
      }
    ]
  },
  {
    "name": "Nacido de las Cenizas (Cinderborn)",
    "emoji": "🌋",
    "impact": "high",
    "description": "Un elemental de fuego volcánico. Es inmune a las llamas, aterroriza a las bestias y se cura con la lava, pero es devastado por el agua.",
    "traits": [
      {
        "name": "Núcleo fundido",
        "desc": "Inmunidad total al fuego, la lava, los bloques de magma y las quemaduras.",
        "type": "buff",
        "icon": "🌋",
        "key": null
      },
      {
        "name": "Erupción [V]",
        "desc": "Lanza una ráfaga de 4 pequeñas bolas de fuego en la dirección que estés mirando. Cuesta 3 de aguante (stamina). Tiempo de recarga de 5 segundos.",
        "type": "ability",
        "icon": "⚡",
        "key": "V"
      },
      {
        "name": "Piel de basalto",
        "desc": "Resistencia I permanente.",
        "type": "buff",
        "icon": "🧱",
        "key": null
      },
      {
        "name": "Baño de magma",
        "desc": "Recupera 1 punto de vida (HP) por segundo mientras esté sumergido en lava.",
        "type": "buff",
        "icon": "🌋",
        "key": null
      },
      {
        "name": "Fuerza volcánica",
        "desc": "Obtiene el efecto de Fuerza mientras se encuentre en el Nether.",
        "type": "buff",
        "icon": "🌋",
        "key": null
      },
      {
        "name": "Apagado",
        "desc": "El agua actúa como veneno. Recibes 1.5 puntos de daño por segundo si estás en el agua o bajo la lluvia.",
        "type": "debuff",
        "icon": "💧",
        "key": null
      },
      {
        "name": "Resplandor de ascuas",
        "desc": "Tu fuego interno emite luz, iluminando incluso las cuevas más oscuras.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Aura infernal",
        "desc": "La mayoría de las criaturas pasivas (ganado, aldeanos, fauna) huyen de tu presencia llameante.",
        "type": "debuff",
        "icon": "👹",
        "key": null
      },
      {
        "name": "Dieta fúngica",
        "desc": "Puedes alimentarte de hongos carmesí y distorsionados (clic derecho) para restaurar 5 puntos de hambre y 0.6 de saturación.",
        "type": "buff",
        "icon": "🍄",
        "key": null
      },
      {
        "name": "Aguante (Stamina)",
        "desc": "Reservas físicas que se consumen al utilizar habilidades activas.",
        "type": "resource",
        "icon": "🏃",
        "key": null
      }
    ]
  },
  {
    "name": "Dracónico (Draconic)",
    "emoji": "🐉",
    "impact": "high",
    "description": "De sangre de dragón y temible. Inmune al fuego y aterrador para las bestias, pero su llama dracónica consume su aguante (stamina) rápidamente.",
    "traits": [
      {
        "name": "Sangre de dragón",
        "desc": "Inmunidad total al fuego, la lava, los bloques de magma y las quemaduras.",
        "type": "buff",
        "icon": "🐉",
        "key": null
      },
      {
        "name": "Zancada fundida",
        "desc": "Nada en lava con la misma facilidad que otros nadan en agua.",
        "type": "buff",
        "icon": "🌋",
        "key": null
      },
      {
        "name": "Visión fundida",
        "desc": "Ve claramente a través de la lava, sin niebla ni distorsión por calor.",
        "type": "buff",
        "icon": "👁️",
        "key": null
      },
      {
        "name": "Amortiguación alar",
        "desc": "Alas vestigiales que evitan el daño por caída.",
        "type": "buff",
        "icon": "🪶",
        "key": null
      },
      {
        "name": "Alas de dragón [V] (Alternable)",
        "desc": "Planea libremente por el aire usando poderosas alas dracónicas.",
        "type": "ability",
        "icon": "🐉",
        "key": "V"
      },
      {
        "name": "Aliento de llamas [G]",
        "desc": "Lanza una ráfaga de 4 pequeñas bolas de fuego en la dirección que estés mirando. Cuesta 3 de aguante (stamina) y tiene un tiempo de recarga de 4 segundos.",
        "type": "ability",
        "icon": "⚡",
        "key": "G"
      },
      {
        "name": "Presencia alfa",
        "desc": "La mayoría de las criaturas pasivas (ganado, aldeanos, fauna) huyen de tu presencia dracónica.",
        "type": "resource",
        "icon": "🧪",
        "key": null
      },
      {
        "name": "Estatura imponente",
        "desc": "Tu tamaño es un 20% mayor que el de un jugador normal.",
        "type": "debuff",
        "icon": "🐉",
        "key": null
      },
      {
        "name": "Fuerza dracónica",
        "desc": "Infliges 2 puntos de daño extra por golpe.",
        "type": "buff",
        "icon": "🐉",
        "key": null
      },
      {
        "name": "Llama sofocada",
        "desc": "Recibes 1.5 puntos de daño por segundo si estás en el agua o bajo la lluvia.",
        "type": "debuff",
        "icon": "💧",
        "key": null
      },
      {
        "name": "Apetito dracónico",
        "desc": "Consumes tu aguante (stamina) un 50% más rápido.",
        "type": "debuff",
        "icon": "🍖",
        "key": null
      },
      {
        "name": "Aguante (Stamina)",
        "desc": "Reservas físicas que se consumen al utilizar habilidades activas.",
        "type": "resource",
        "icon": "🏃",
        "key": null
      }
    ]
  },
  {
    "name": "Enano (Dwarf)",
    "emoji": "🧔",
    "impact": "medium",
    "description": "Un robusto artesano subterráneo: compacto, resistente e incansable en la forja, pero de extremidades cortas y lento en sus movimientos.",
    "traits": [
      {
        "name": "Estructura compacta",
        "desc": "Tu tamaño es un 80% del de un jugador normal, lo que te permite pasar por espacios más estrechos.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Constitución robusta",
        "desc": "Resistencia I permanente.",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Visión en la oscuridad",
        "desc": "Puedes ver claramente en la oscuridad total.",
        "type": "buff",
        "icon": "👁️",
        "key": null
      },
      {
        "name": "Piernas robustas",
        "desc": "Tu velocidad de movimiento se reduce en un 15%.",
        "type": "debuff",
        "icon": "🐢",
        "key": null
      },
      {
        "name": "Conocimiento de la piedra",
        "desc": "Rompes bloques un 25% más rápido.",
        "type": "buff",
        "icon": "⛏️",
        "key": null
      },
      {
        "name": "Brazos cortos",
        "desc": "Tu alcance para interactuar con bloques se reduce en 0.5 bloques.",
        "type": "debuff",
        "icon": "📏",
        "key": null
      },
      {
        "name": "Metabolismo eficiente",
        "desc": "Todas tus actividades consumen un 25% menos de hambre.",
        "type": "buff",
        "icon": "🥗",
        "key": null
      },
      {
        "name": "Pico reliquia",
        "desc": "Apareces inicialmente con un pico de hierro enano (Irrompibilidad II, Eficiencia I) al elegir este origen.",
        "type": "buff",
        "icon": "⛏️",
        "key": null
      }
    ]
  },
  {
    "name": "Mago de Tierra (Earth Mage)",
    "emoji": "⛰️",
    "impact": "high",
    "description": "Un geomante inquebrantable que golpea el suelo para dañar a sus enemigos y levanta muros de piedra con un gesto. Es inamovible como una montaña, pero el agua y las alturas son sus grandes debilidades.",
    "traits": [
      {
        "name": "Golpe sísmico [V]",
        "desc": "Golpea la tierra, infligiendo 6 puntos de daño y empujando a todas las entidades cercanas. Cuesta 3 de maná y tiene un tiempo de recarga de 6 segundos.",
        "type": "ability",
        "icon": "⚡",
        "key": "V"
      },
      {
        "name": "Muro de piedra [G]",
        "desc": "Coloca un bloque de roca (cobblestone) en el lugar que estés mirando. Tiempo de recarga de 2 segundos.",
        "type": "ability",
        "icon": "🧱",
        "key": "G"
      },
      {
        "name": "Conocimiento de la piedra",
        "desc": "Minas piedra y minerales un 50% más rápido.",
        "type": "buff",
        "icon": "⛏️",
        "key": null
      },
      {
        "name": "Enraizado",
        "desc": "Recibes un 50% menos de empuje (knockback), manteniéndote firme como la roca madre.",
        "type": "buff",
        "icon": "⚓",
        "key": null
      },
      {
        "name": "Pesado",
        "desc": "No puedes nadar; te hundes rápidamente como una piedra.",
        "type": "debuff",
        "icon": "⚓",
        "key": null
      },
      {
        "name": "Ligado a la tierra",
        "desc": "Recibes un 50% más de daño por caída.",
        "type": "debuff",
        "icon": "🧗",
        "key": null
      },
      {
        "name": "Maná",
        "desc": "Energía mágica utilizada para lanzar tus habilidades.",
        "type": "resource",
        "icon": "🔮",
        "key": null
      }
    ]
  },
  {
    "name": "Elitariano (Elytrian)",
    "emoji": "🦋",
    "impact": "medium",
    "description": "Especialista en vuelo. Surca los cielos y es inmune a la energía cinética, pero tiene una constitución frágil y no puede usar armaduras pesadas.",
    "traits": [
      {
        "name": "Vuelo natural",
        "desc": "Planea como si llevaras unas élitras sin necesidad del objeto. Pulsa saltar mientras caes para desplegar tus alas.",
        "type": "buff",
        "icon": "🦋",
        "key": null
      },
      {
        "name": "Impulso de élitras [V]",
        "desc": "Obtienes un impulso de velocidad al lanzarte a volar usando élitras.",
        "type": "ability",
        "icon": "🦋",
        "key": "V"
      },
      {
        "name": "Velocidad celestial",
        "desc": "Tu velocidad de vuelo aumenta un 30%.",
        "type": "buff",
        "icon": "🦋",
        "key": null
      },
      {
        "name": "Caída de pluma",
        "desc": "Inmunidad al daño por caída.",
        "type": "buff",
        "icon": "🪶",
        "key": null
      },
      {
        "name": "Cojín de viento",
        "desc": "Inmune al daño por colisión al volar (puedes chocar contra paredes sin recibir daño).",
        "type": "buff",
        "icon": "💨",
        "key": null
      },
      {
        "name": "Constitución frágil",
        "desc": "Tu salud máxima se reduce en 2 corazones.",
        "type": "buff",
        "icon": "⚡",
        "key": null
      },
      {
        "name": "Incapaz de llevar armadura pesada",
        "desc": "Solo puedes equipar armadura de cuero o cota de mallas (no puedes usar hierro, oro, diamante ni netherita).",
        "type": "debuff",
        "icon": "🛡️",
        "key": null
      }
    ]
  },
  {
    "name": "Enderiano",
    "emoji": "🔮",
    "impact": "low",
    "description": "Nacido en el End. Puede teletransportarse, esquivar proyectiles y los endermen lo ignoran, pero el agua le quema como ácido. Aparece inicialmente en el End.",
    "traits": [
      {
        "name": "Ojos de Ender",
        "desc": "Los endermen ignoran tu mirada; puedes verlos a los ojos sin provocar que te ataquen.",
        "type": "buff",
        "icon": "👁️",
        "key": null
      },
      {
        "name": "Paso del vacío",
        "desc": "50% de probabilidad de teletransportarte y evitar el daño al ser golpeado por un proyectil.",
        "type": "ability",
        "icon": "🌌",
        "key": null
      },
      {
        "name": "Hidrofobia",
        "desc": "Recibes 2 puntos de daño por segundo al tocar el agua o estar bajo la lluvia.",
        "type": "debuff",
        "icon": "💧",
        "key": null
      },
      {
        "name": "Salto de Ender [V]",
        "desc": "Te teletransportas a donde estés mirando (hasta 50 bloques de distancia). Cuesta 2 de energía. Tiempo de recarga de 3 segundos.",
        "type": "ability",
        "icon": "⚡",
        "key": "V"
      },
      {
        "name": "Energía",
        "desc": "Recurso interno necesario para usar tus habilidades.",
        "type": "resource",
        "icon": "⚡",
        "key": null
      }
    ]
  },
  {
    "name": "Enderite",
    "emoji": "👾",
    "impact": "high",
    "description": "Un ser del End, maestro de la teletransportación y la intangibilidad. Cae con gracia, pero es vulnerable al agua y a la luz del día.",
    "traits": [
      {
        "name": "Paso de salto [V]",
        "desc": "Te teletransportas hasta 32 bloques en la dirección en la que miras. Cuesta 2 de energía. Tiempo de recarga de 3 segundos.",
        "type": "ability",
        "icon": "⚡",
        "key": "V"
      },
      {
        "name": "Fase del vacío [G]",
        "desc": "Te permite atravesar paredes sólidas. Cuesta 3 de energía. Tiempo de recarga de 10 segundos.",
        "type": "ability",
        "icon": "⚡",
        "key": "G"
      },
      {
        "name": "Deriva de Ender",
        "desc": "Caes lentamente y con gracia, como si la gravedad apenas te afectara.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Vista del End",
        "desc": "Visión perfecta y clara en la oscuridad total.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Autoridad del vacío",
        "desc": "Los endermites y los pececillos de plata (silverfish) huyen al verte.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Debilidad de Ender",
        "desc": "Recibes 2 puntos de daño por segundo al tocar el agua o bajo la lluvia.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Sensibilidad a la luz",
        "desc": "Recibes un 50% más de daño cuando estás expuesto a la luz solar.",
        "type": "debuff",
        "icon": "☀️",
        "key": null
      },
      {
        "name": "Garras del vacío",
        "desc": "Infliges 3 puntos de daño extra por cada golpe.",
        "type": "buff",
        "icon": "🔮",
        "key": null
      },
      {
        "name": "Energía",
        "desc": "Recurso interno para utilizar tus habilidades.",
        "type": "resource",
        "icon": "⚡",
        "key": null
      }
    ]
  },
  {
    "name": "Felino",
    "emoji": "🐱",
    "impact": "medium",
    "description": "Un humanoide felino ágil, con gran visión nocturna y un poderoso salto. Siempre cae de pie, pero odia el agua y consume energía rápidamente.",
    "traits": [
      {
        "name": "Nueve vidas",
        "desc": "Siempre caes a salvo. Inmunidad total al daño por caída.",
        "type": "debuff",
        "icon": "🥀",
        "key": null
      },
      {
        "name": "Ojos de gato",
        "desc": "Puedes ver de forma clara en la oscuridad.",
        "type": "buff",
        "icon": "👁️",
        "key": null
      },
      {
        "name": "Ágil",
        "desc": "Te mueves un 10% más rápido que un humano normal.",
        "type": "buff",
        "icon": "⚡",
        "key": null
      },
      {
        "name": "Calma del depredador",
        "desc": "Los creepers te temen y no se acercarán a ti.",
        "type": "buff",
        "icon": "😺",
        "key": null
      },
      {
        "name": "Abalanzarse [V]",
        "desc": "Das un poderoso salto impulsado en la dirección que estés mirando. Cuesta 2 de energía. Tiempo de recarga de 4 segundos.",
        "type": "ability",
        "icon": "⚡",
        "key": "V"
      },
      {
        "name": "Odia el agua",
        "desc": "Recibes 0.5 puntos de daño por segundo mientras estás en el agua o bajo la lluvia.",
        "type": "debuff",
        "icon": "💧",
        "key": null
      },
      {
        "name": "Metabolismo acelerado",
        "desc": "Tu barra de hambre se consume un 30% más rápido de lo normal.",
        "type": "debuff",
        "icon": "🍖",
        "key": null
      },
      {
        "name": "Energía",
        "desc": "Recurso interno necesario para usar tus habilidades.",
        "type": "resource",
        "icon": "⚡",
        "key": null
      }
    ]
  },
  {
    "name": "Mago de Fuego (Fire Mage)",
    "emoji": "🔥",
    "impact": "high",
    "description": "Un piromante volátil envuelto en llamas. Lanza bolas de fuego, crea ráfagas infernales y quema a quienes le atacan. Es inmune al fuego, pero el agua es su perdición.",
    "traits": [
      {
        "name": "Bola de fuego [V]",
        "desc": "Lanza una ráfaga de cuatro pequeñas bolas de fuego en la dirección que estés mirando. Cuesta 3 de maná. Tiempo de recarga de 4 segundos.",
        "type": "ability",
        "icon": "⚡",
        "key": "V"
      },
      {
        "name": "Ráfaga infernal [G]",
        "desc": "Libera una explosión de llamas que daña a todos los enemigos cercanos. Cuesta 3 de maná. Tiempo de recarga de 8 segundos.",
        "type": "ability",
        "icon": "⚡",
        "key": "G"
      },
      {
        "name": "Manto de llamas",
        "desc": "Los enemigos reciben un 30% del daño que te infligen a modo de contraataque de fuego.",
        "type": "buff",
        "icon": "🔥",
        "key": null
      },
      {
        "name": "Inmunidad al fuego",
        "desc": "Inmunidad total al daño por fuego, lava y bloques de magma.",
        "type": "buff",
        "icon": "🔥",
        "key": null
      },
      {
        "name": "Debilidad al agua",
        "desc": "Recibes 1 punto de daño por segundo al estar en el agua o bajo la lluvia.",
        "type": "debuff",
        "icon": "💧",
        "key": null
      },
      {
        "name": "Horno interno",
        "desc": "Debido al calor, tu barra de hambre se agota un 50% más rápido.",
        "type": "debuff",
        "icon": "🍖",
        "key": null
      },
      {
        "name": "Maná",
        "desc": "Energía mágica utilizada para lanzar tus habilidades.",
        "type": "resource",
        "icon": "🔮",
        "key": null
      }
    ]
  },
  {
    "name": "Nacido de la Escarcha (Frostborn)",
    "emoji": "❄️",
    "impact": "medium",
    "description": "Elemental de hielo y frío. Congela a sus enemigos y prospera en las taigas, pero el fuego y el Nether le resultan devastadores.",
    "traits": [
      {
        "name": "Nova de escarcha [V]",
        "desc": "Golpea a los enemigos cercanos aplicándoles lentitud extrema. Cuesta 2 de aguante. Tiempo de recarga de 10 segundos.",
        "type": "ability",
        "icon": "❄️",
        "key": "V"
      },
      {
        "name": "Sangre fría",
        "desc": "Obtienes fuerza mientras estés en biomas fríos de taiga.",
        "type": "debuff",
        "icon": "❄️",
        "key": null
      },
      {
        "name": "Derretimiento",
        "desc": "Recibes el doble de daño por fuego.",
        "type": "debuff",
        "icon": "🔥",
        "key": null
      },
      {
        "name": "Caminar sobre hielo [G]",
        "desc": "Coloca un bloque de hielo donde estés mirando. Tiempo de recarga de 1 segundo.",
        "type": "ability",
        "icon": "❄️",
        "key": "G"
      },
      {
        "name": "Caparazón de hielo",
        "desc": "Resistencia I permanente (el hielo cristalizado desvía los golpes).",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Enfermedad por calor",
        "desc": "Recibes 2 puntos de daño por segundo mientras estés en el Nether.",
        "type": "debuff",
        "icon": "🔥",
        "key": null
      },
      {
        "name": "Inmunidad al frío",
        "desc": "Eres completamente inmune al daño por congelación.",
        "type": "buff",
        "icon": "❄️",
        "key": null
      },
      {
        "name": "Aguante (Stamina)",
        "desc": "Reservas físicas utilizadas para lanzar habilidades activas.",
        "type": "resource",
        "icon": "🏃",
        "key": null
      }
    ]
  },
  {
    "name": "Cuerpo Dorado (Golden Body)",
    "emoji": "🧘",
    "impact": "medium",
    "description": "Maestro del qigong duro y las artes del Cuerpo de Hierro. Un muro acorazado e inamovible que castiga a quien lo golpea, a costa de su propia agilidad.",
    "traits": [
      {
        "name": "Camisa de hierro",
        "desc": "Tu carne endurecida actúa como armadura, otorgando +8 puntos de armadura de forma natural.",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Postura enraizada",
        "desc": "Te mantienes firme como una montaña, siendo muy difícil que te empujen (resistencia al knockback).",
        "type": "buff",
        "icon": "⚓",
        "key": null
      },
      {
        "name": "Qigong duro",
        "desc": "Los ataques físicos contra tu cuerpo rebotan y dañan al atacante.",
        "type": "resource",
        "icon": "☯️",
        "key": null
      },
      {
        "name": "Cuerpo dorado [V]",
        "desc": "Forjas tu cuerpo dorado interior obteniendo protección casi total (Resistencia V) durante 5 segundos.",
        "type": "ability",
        "icon": "🪙",
        "key": "V"
      },
      {
        "name": "Postura pesada",
        "desc": "Todo tu acondicionamiento físico te pesa, por lo que te mueves un poco más lento.",
        "type": "debuff",
        "icon": "🐢",
        "key": null
      }
    ]
  },
  {
    "name": "Golem",
    "emoji": "🪨",
    "impact": "high",
    "description": "Una fortaleza andante de hierro y voluntad. Casi inamovible, pero lento y altamente vulnerable al calor.",
    "traits": [
      {
        "name": "Piel de hierro",
        "desc": "Resistencia I permanente. Tu recubrimiento de hierro absorbe golpes incluso sin llevar armadura equipada.",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Inamovible",
        "desc": "Tienes un 80% de resistencia al empuje (knockback).",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Estructura imponente",
        "desc": "Eres un 30% más grande que un jugador normal.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Constitución de hierro",
        "desc": "Inmunidad total al veneno, al efecto Wither y al hambre.",
        "type": "buff",
        "icon": "⚙️",
        "key": null
      },
      {
        "name": "Pesado",
        "desc": "Te mueves un 25% más lento que un humano normal.",
        "type": "debuff",
        "icon": "⚓",
        "key": null
      },
      {
        "name": "Punto de fusión",
        "desc": "Recibes un 80% más de daño por fuego, lava y bloques de magma, ya que el hierro conduce el calor.",
        "type": "debuff",
        "icon": "🔥",
        "key": null
      },
      {
        "name": "Golpe sísmico [V]",
        "desc": "Golpeas la tierra con puños de hierro. Inflige 4 puntos de daño y Lentitud II durante 4 segundos a todos los enemigos en un radio de 5 bloques. Cuesta 3 de aguante. Recarga de 7 segundos.",
        "type": "ability",
        "icon": "⚡",
        "key": "V"
      },
      {
        "name": "Aguante (Stamina)",
        "desc": "Reservas físicas utilizadas para lanzar habilidades activas.",
        "type": "resource",
        "icon": "🏃",
        "key": null
      }
    ]
  },
  {
    "name": "Gorgona (Gorgon)",
    "emoji": "🐍",
    "impact": "high",
    "description": "Una monstruosidad con piel de piedra cuya mirada petrifica y cuyos puños destrozan, pero el peso de la piedra ralentiza todos sus pasos.",
    "traits": [
      {
        "name": "Mirada petrificante [V]",
        "desc": "Congela a todos los enemigos cercanos aplicándoles Lentitud V. Cuesta 3 de aguante. Tiempo de recarga de 15 segundos.",
        "type": "ability",
        "icon": "🧱",
        "key": "V"
      },
      {
        "name": "Puños de piedra",
        "desc": "Infliges 4 puntos de daño extra por cada golpe.",
        "type": "buff",
        "icon": "⛏️",
        "key": null
      },
      {
        "name": "Piel de granito",
        "desc": "Resistencia I permanente. Tu piel de piedra suaviza los impactos.",
        "type": "buff",
        "icon": "🧱",
        "key": null
      },
      {
        "name": "Inamovible",
        "desc": "Tienes un 50% de resistencia al empuje (knockback).",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Pesada",
        "desc": "Te mueves un 20% más lento de lo normal.",
        "type": "debuff",
        "icon": "🥀",
        "key": null
      },
      {
        "name": "Masa imponente",
        "desc": "Eres un 15% más grande que un jugador normal.",
        "type": "debuff",
        "icon": "🗿",
        "key": null
      },
      {
        "name": "Apetito de piedra",
        "desc": "Consumes tu aguante un 50% más rápido, ya que mantener tu forma de piedra agota la energía.",
        "type": "debuff",
        "icon": "🍖",
        "key": null
      },
      {
        "name": "Aguante (Stamina)",
        "desc": "Reservas físicas utilizadas para lanzar habilidades activas.",
        "type": "resource",
        "icon": "🏃",
        "key": null
      }
    ]
  },
  {
    "name": "Mago de Gravedad (Gravity Mage)",
    "emoji": "🌌",
    "impact": "high",
    "description": "Manipulador de campos gravitacionales capaz de curvar el espacio. Atrae a sus enemigos a una singularidad o los expulsa con fuerza, pero su propio cuerpo está poco ligado a la tierra.",
    "traits": [
      {
        "name": "Pozo gravitatorio [V]",
        "desc": "Lanza un orbe oscuro que se convierte en un agujero negro al impactar. Atrae a las entidades cercanas hacia el centro y les inflige daño durante 4 segundos. Cuesta 4 de maná. Recarga de 20 segundos.",
        "type": "ability",
        "icon": "⚡",
        "key": "V"
      },
      {
        "name": "Repulsión [G]",
        "desc": "Libera una onda de choque gravitacional que empuja lejos a todas las entidades cercanas. Cuesta 3 de maná. Recarga de 4 segundos.",
        "type": "ability",
        "icon": "⚡",
        "key": "G"
      },
      {
        "name": "Levitación [N] (Alternable)",
        "desc": "Desafía la gravedad y asciende a voluntad (Levitación I). Viene desactivado por defecto (actívalo con la tecla).",
        "type": "ability",
        "icon": "⚡",
        "key": "N"
      },
      {
        "name": "Cojín gravitatorio",
        "desc": "Inmunidad total al daño por caída.",
        "type": "buff",
        "icon": "🌌",
        "key": null
      },
      {
        "name": "Desligado",
        "desc": "Recibes un 75% más de empuje (knockback), tu gravedad debilitada hace que sea fácil lanzarte por los aires.",
        "type": "debuff",
        "icon": "🪶",
        "key": null
      },
      {
        "name": "Frágil",
        "desc": "Infliges un 25% menos de daño cuerpo a cuerpo. Tu poder reside en la gravedad, no en los golpes físicos.",
        "type": "buff",
        "icon": "⚡",
        "key": null
      },
      {
        "name": "Maná",
        "desc": "Energía mágica utilizada para lanzar tus habilidades.",
        "type": "resource",
        "icon": "🔮",
        "key": null
      }
    ]
  },
  {
    "name": "Colmenero (Hiveling)",
    "emoji": "🐝",
    "impact": "high",
    "description": "Un insectoide similar a una abeja que vuela libremente, pica a sus enemigos con veneno y hace crecer los cultivos. Sus alas frágiles y su hambre insaciable son el precio de su vuelo.",
    "traits": [
      {
        "name": "Alas zumbadoras",
        "desc": "Planea como si llevaras unas élitras. Pulsa saltar mientras caes para despegar.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Despegue",
        "desc": "Obtienes un +40% de fuerza de salto.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Aguijón venenoso [V]",
        "desc": "Dispara un proyectil venenoso a tu objetivo. Cuesta 1 de energía. Recarga de 6 segundos.",
        "type": "ability",
        "icon": "⚡",
        "key": "V"
      },
      {
        "name": "Polinizador",
        "desc": "Los cultivos cercanos crecen mucho más rápido en tu presencia.",
        "type": "buff",
        "icon": "🐝",
        "key": null
      },
      {
        "name": "Estructura pequeña",
        "desc": "Tu tamaño es un 60% del de un jugador normal.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Artrópodo",
        "desc": "Eres vulnerable a las armas con el encantamiento Perdición de los Artrópodos.",
        "type": "debuff",
        "icon": "🕷️",
        "key": null
      },
      {
        "name": "Alas frágiles",
        "desc": "Tu salud máxima se reduce en 3 corazones.",
        "type": "buff",
        "icon": "⚡",
        "key": null
      },
      {
        "name": "Metabolismo acelerado",
        "desc": "Consumes energía (hambre) un 50% más rápido, volar es agotador.",
        "type": "debuff",
        "icon": "🍖",
        "key": null
      },
      {
        "name": "Energía",
        "desc": "Recurso interno necesario para usar tus habilidades.",
        "type": "resource",
        "icon": "⚡",
        "key": null
      }
    ]
  },
  {
    "name": "Diminuto (Inchling)",
    "emoji": "🐜",
    "impact": "medium",
    "description": "Un humanoide del tamaño de una cuarta parte de lo normal que escala paredes con facilidad y se mueve a una velocidad sorprendente, aunque su cuerpo es sumamente frágil.",
    "traits": [
      {
        "name": "Diminuto",
        "desc": "Eres tan solo una cuarta parte del tamaño normal.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Trepa-muros",
        "desc": "Puedes agarrarte y escalar cualquier superficie.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Peso pluma",
        "desc": "Eres tan ligero que nunca recibes daño por caída.",
        "type": "buff",
        "icon": "🪶",
        "key": null
      },
      {
        "name": "Cuerpo frágil",
        "desc": "Tu salud máxima se reduce en 5 corazones.",
        "type": "buff",
        "icon": "⚡",
        "key": null
      },
      {
        "name": "Pies rápidos",
        "desc": "Te mueves un 15% más rápido de lo normal.",
        "type": "buff",
        "icon": "⚡",
        "key": null
      },
      {
        "name": "Apetito pequeño",
        "desc": "Tu barra de hambre se vacía a la mitad de velocidad que la de un jugador normal.",
        "type": "buff",
        "icon": "🥗",
        "key": null
      }
    ]
  },
  {
    "name": "Monje de Hierro (Iron Monk)",
    "emoji": "🥋",
    "impact": "medium",
    "description": "Un monje defensor que basa todas sus artes en una única reserva de aguante (stamina). Levanta su guardia para ignorar los golpes, pero tanto bloquear como atacar consumen la misma energía.",
    "traits": [
      {
        "name": "Aguante (Stamina)",
        "desc": "Alimenta tanto tu guardia como tus habilidades. Solo se recupera cuando bajas la guardia.",
        "type": "resource",
        "icon": "🏃",
        "key": null
      },
      {
        "name": "Guardia [V] (Alternable)",
        "desc": "Levanta tu guardia. Mientras la mantengas, no podrás moverte (Lentitud), pero absorberás casi todo el daño a costa de drenar tu aguante. Pulsa de nuevo para bajarla.",
        "type": "ability",
        "icon": "🛡️",
        "key": "V"
      },
      {
        "name": "Mantenimiento de guardia",
        "desc": "Mantener la guardia activa consume aguante constantemente.",
        "type": "debuff",
        "icon": "⏳",
        "key": null
      },
      {
        "name": "Baluarte",
        "desc": "Mientras bloquees y tengas aguante de sobra, el daño recibido se reduce en un 90%.",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Parada (Parry)",
        "desc": "Cada golpe que bloquees con éxito sonará como un escudo y consumirá una porción de tu aguante.",
        "type": "buff",
        "icon": "⚔️",
        "key": null
      },
      {
        "name": "Golpe de palma [G]",
        "desc": "Lanza una onda de choque a tu alrededor que daña y lanza por los aires a los enemigos cercanos. Cuesta 20 de aguante.",
        "type": "ability",
        "icon": "💥",
        "key": "G"
      },
      {
        "name": "Resolución de hierro",
        "desc": "Tienes resistencia natural a que te empujen o te saquen de tu postura.",
        "type": "buff",
        "icon": "⚓",
        "key": null
      }
    ]
  },
  {
    "name": "Kraken",
    "emoji": "🐙",
    "impact": "high",
    "description": "Un colosal depredador de las profundidades. Es devastador bajo el agua gracias a sus tentáculos, disparos de tinta y guardianes invocados, pero es lento y vulnerable en la superficie. Aparece en biomas de océano.",
    "traits": [
      {
        "name": "Latigazo de tentáculo [V]",
        "desc": "Dispara un proyectil de sombras que ciega y ralentiza a los enemigos en un radio de 6 bloques. Cuesta 2 de esencia. Recarga de 6 segundos.",
        "type": "ability",
        "icon": "🐙",
        "key": "V"
      },
      {
        "name": "Disparo de tinta [G]",
        "desc": "Dispara un chorro de tinta concentrada que ralentiza severamente a los enemigos en un radio de 5 bloques. Cuesta 2 de esencia. Recarga de 8 segundos.",
        "type": "ability",
        "icon": "🐙",
        "key": "G"
      },
      {
        "name": "Pulmones profundos",
        "desc": "Puedes respirar bajo el agua indefinidamente y tienes visión clara sin niebla submarina.",
        "type": "buff",
        "icon": "🫁",
        "key": null
      },
      {
        "name": "Embestida de marea",
        "desc": "Nadas mucho más rápido que los habitantes de la superficie.",
        "type": "buff",
        "icon": "🌊",
        "key": null
      },
      {
        "name": "Piscívoro",
        "desc": "Solo puedes comer pescado.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Adaptación cruda",
        "desc": "El bacalao y el salmón crudos te alimentan lo mismo que sus versiones cocinadas.",
        "type": "buff",
        "icon": "🍣",
        "key": null
      },
      {
        "name": "Placas de presión",
        "desc": "Resistencia I permanente, tu piel soporta la presión abisal.",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Llamada de las profundidades [N]",
        "desc": "Invoca un guardián marino para luchar a tu lado (máximo 2 a la vez). Cuesta 5 de esencia. Recarga de 20 segundos. Recibes 1 punto de daño si el guardián muere en combate.",
        "type": "ability",
        "icon": "🐙",
        "key": "N"
      },
      {
        "name": "Varado",
        "desc": "Te mueves un 30% más lento en tierra firme.",
        "type": "debuff",
        "icon": "🥀",
        "key": null
      },
      {
        "name": "Agonía superficial",
        "desc": "Recibes 1 punto de daño por segundo bajo la luz solar directa.",
        "type": "debuff",
        "icon": "☀️",
        "key": null
      },
      {
        "name": "Colosal",
        "desc": "Eres un 30% más grande que un jugador normal.",
        "type": "debuff",
        "icon": "🗿",
        "key": null
      },
      {
        "name": "Desecación",
        "desc": "Tu barra de oxígeno se agota fuera del agua; te asfixiarás si pasas demasiado tiempo en la superficie.",
        "type": "debuff",
        "icon": "☠️",
        "key": null
      },
      {
        "name": "Afinidad acuática",
        "desc": "Minas a máxima velocidad mientras estás sumergido.",
        "type": "buff",
        "icon": "⛏️",
        "key": null
      },
      {
        "name": "Nadador natural",
        "desc": "Te mueves un poco más rápido por el agua de forma pasiva.",
        "type": "buff",
        "icon": "⚡",
        "key": null
      },
      {
        "name": "Esencia",
        "desc": "Energía de las profundidades marinas usada para tus habilidades.",
        "type": "resource",
        "icon": "🧪",
        "key": null
      }
    ]
  },
  {
    "name": "Tritón (Merling)",
    "emoji": "🧜",
    "impact": "medium",
    "description": "Un habitante acuático nacido en el océano abierto. Respira bajo el agua y nada con facilidad, pero es lento y se seca en tierra firme. Aparece en biomas de océano.",
    "traits": [
      {
        "name": "Branquias",
        "desc": "Puedes respirar bajo el agua indefinidamente y tienes visión submarina clara.",
        "type": "buff",
        "icon": "🤿",
        "key": null
      },
      {
        "name": "Velocidad acuática",
        "desc": "Nadas mucho más rápido.",
        "type": "buff",
        "icon": "🌊",
        "key": null
      },
      {
        "name": "Piscívoro",
        "desc": "Solo puedes comer pescado.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Adaptación cruda",
        "desc": "El bacalao y el salmón crudos te alimentan lo mismo que sus versiones cocinadas.",
        "type": "buff",
        "icon": "🍣",
        "key": null
      },
      {
        "name": "Marinero de agua dulce",
        "desc": "Te mueves un 10% más lento en tierra firme.",
        "type": "debuff",
        "icon": "💧",
        "key": null
      },
      {
        "name": "Desecación",
        "desc": "Tu barra de oxígeno se consume fuera del agua, provocando asfixia si se agota.",
        "type": "debuff",
        "icon": "☠️",
        "key": null
      },
      {
        "name": "Afinidad acuática",
        "desc": "Minas a velocidad normal bajo el agua.",
        "type": "buff",
        "icon": "⛏️",
        "key": null
      },
      {
        "name": "Nadador natural",
        "desc": "Tu velocidad de movimiento en el agua está ligeramente aumentada.",
        "type": "buff",
        "icon": "✨",
        "key": null
      }
    ]
  },
  {
    "name": "Domador de Monstruos (Monster Tamer)",
    "emoji": "🤠",
    "impact": "high",
    "description": "Un intrépido controlador de bestias que doblega a las criaturas hostiles a su voluntad. Solo es frágil, pero con su leal manada a su lado es una fuerza a tener en cuenta.",
    "traits": [
      {
        "name": "Dominar [V]",
        "desc": "Mira a una criatura hostil y usa esta habilidad para doblegarla. Te seguirá y te defenderá (máximo 4 criaturas domadas). Cuesta 3 de esencia. Recarga de 10 segundos.",
        "type": "ability",
        "icon": "🤠",
        "key": "V"
      },
      {
        "name": "¡Ataca! [G]",
        "desc": "Mira a un objetivo y ordena a toda tu manada que lo ataque. Recarga de 2 segundos.",
        "type": "ability",
        "icon": "🤠",
        "key": "G"
      },
      {
        "name": "Vínculo de manada",
        "desc": "Tus criaturas domadas regeneran 1 HP cada 6 segundos mientras no estén en combate.",
        "type": "buff",
        "icon": "🤠",
        "key": null
      },
      {
        "name": "Debilidad en solitario",
        "desc": "Infliges un 25% menos de daño cuerpo a cuerpo (dependes de tu manada para luchar).",
        "type": "debuff",
        "icon": "💔",
        "key": null
      },
      {
        "name": "Alimentar a la manada",
        "desc": "Tu barra de hambre se agota un 50% más rápido debido al esfuerzo de mantener el vínculo.",
        "type": "debuff",
        "icon": "🍖",
        "key": null
      },
      {
        "name": "Esencia",
        "desc": "Energía de vínculo natural necesaria para domar criaturas.",
        "type": "resource",
        "icon": "🧪",
        "key": null
      }
    ]
  },
  {
    "name": "Nigromante (Necromancer)",
    "emoji": "💀",
    "impact": "high",
    "description": "Un maestro de la muerte que comanda súbditos no muertos. Esqueletos Wither y arqueros luchan a su lado, pero su propia fuerza vital está ligada a la de ellos.",
    "traits": [
      {
        "name": "Alzar Esqueleto Wither [V]",
        "desc": "Invoca un Esqueleto Wither para luchar por ti (máximo 2 a la vez). Cuesta 6 de esencia. Recarga de 30 segundos. Si muere en combate, recibes 1 punto de daño.",
        "type": "ability",
        "icon": "☠️",
        "key": "V"
      },
      {
        "name": "Alzar Arquero Esqueleto [G]",
        "desc": "Invoca un Esqueleto Arquero (máximo 3 a la vez). Cuesta 4 de esencia. Recarga de 20 segundos. Si muere en combate, recibes 1 punto de daño.",
        "type": "ability",
        "icon": "☠️",
        "key": "G"
      },
      {
        "name": "Naturaleza no muerta",
        "desc": "Eres clasificado como un no muerto. Las pociones de curación te dañan, las de daño te curan y eres inmune al veneno. Vulnerable al encantamiento Golpe (Smite).",
        "type": "debuff",
        "icon": "💀",
        "key": null
      },
      {
        "name": "Visión de la muerte",
        "desc": "Puedes ver claramente en la oscuridad total.",
        "type": "buff",
        "icon": "👁️",
        "key": null
      },
      {
        "name": "Decadencia solar",
        "desc": "Recibes 1.5 puntos de daño por segundo al estar expuesto a la luz solar directa.",
        "type": "debuff",
        "icon": "☀️",
        "key": null
      },
      {
        "name": "Cuerpo marchito",
        "desc": "Tu salud máxima se reduce en 3 corazones (la magia de muerte consume tu cuerpo).",
        "type": "debuff",
        "icon": "💀",
        "key": null
      },
      {
        "name": "Abrazo de la muerte",
        "desc": "Tu regeneración de salud natural se reduce al 40% de lo normal.",
        "type": "debuff",
        "icon": "💀",
        "key": null
      },
      {
        "name": "Esencia",
        "desc": "Energía de almas utilizada para invocar y controlar.",
        "type": "ability",
        "icon": "🧪",
        "key": null
      }
    ]
  },
  {
    "name": "Fantasma (Phantom)",
    "emoji": "👻",
    "impact": "high",
    "description": "Un ser espectral que planea en la noche con alas de élitras, extrae fuerza de sus asesinatos, pero se quema con el sol y es incapaz de dormir.",
    "traits": [
      {
        "name": "Ojos nocturnos",
        "desc": "Puedes ver claramente en la oscuridad total.",
        "type": "buff",
        "icon": "👁️",
        "key": null
      },
      {
        "name": "Alas espectrales",
        "desc": "Planeas como si llevaras unas élitras. Pulsa saltar mientras caes para desplegar tus alas.",
        "type": "buff",
        "icon": "👻",
        "key": null
      },
      {
        "name": "Batir de alas [V]",
        "desc": "Obtienes un gran impulso de velocidad al lanzarte a volar.",
        "type": "ability",
        "icon": "⚡",
        "key": "V"
      },
      {
        "name": "Placa lunar",
        "desc": "Obtienes Resistencia I bajo la luz de la luna (solo de noche). La luz del día anula esta protección.",
        "type": "buff",
        "icon": "🌙",
        "key": null
      },
      {
        "name": "Drenaje de alma",
        "desc": "Te curas 1 HP cada vez que asesinas a una entidad viva.",
        "type": "buff",
        "icon": "🩸",
        "key": null
      },
      {
        "name": "Ingrávido",
        "desc": "Eres inmune al daño por caída.",
        "type": "buff",
        "icon": "🪶",
        "key": null
      },
      {
        "name": "Quemadura solar",
        "desc": "Te prendes fuego y recibes 1.5 puntos de daño por segundo bajo la luz solar directa.",
        "type": "debuff",
        "icon": "☀️",
        "key": null
      },
      {
        "name": "Forma frágil",
        "desc": "Tu salud máxima se reduce en 2 corazones.",
        "type": "buff",
        "icon": "⚡",
        "key": null
      },
      {
        "name": "Terror insomne",
        "desc": "No puedes dormir en camas, la noche es tu elemento natural.",
        "type": "debuff",
        "icon": "🛌",
        "key": null
      }
    ]
  },
  {
    "name": "Piglin",
    "emoji": "🐷",
    "impact": "high",
    "description": "Un guerrero del Nether obsesionado con el oro. Es poderoso en su hogar y respetado por los suyos, pero se debilita fuera del Nether.",
    "traits": [
      {
        "name": "Furia del Nether",
        "desc": "Obtienes Fuerza II mientras estás en el Nether.",
        "type": "buff",
        "icon": "🔥",
        "key": null
      },
      {
        "name": "Parentesco de oro",
        "desc": "Los Piglins y los Piglin Brutos no te atacarán.",
        "type": "buff",
        "icon": "🐷",
        "key": null
      },
      {
        "name": "Golpes brutales",
        "desc": "Infliges 2 puntos de daño extra por cada impacto.",
        "type": "buff",
        "icon": "⚔️",
        "key": null
      },
      {
        "name": "Enfermedad de la superficie",
        "desc": "Sufres el efecto de Debilidad permanentemente mientras estás en el Overworld (mundo normal).",
        "type": "debuff",
        "icon": "🤢",
        "key": null
      },
      {
        "name": "Ojos del Nether",
        "desc": "Puedes ver de forma clara en la oscuridad.",
        "type": "buff",
        "icon": "👁️",
        "key": null
      },
      {
        "name": "Pavor de almas",
        "desc": "El fuego de almas te afecta más profundamente; recibes 0.5 puntos de daño por segundo mientras pisas el bioma Valle de Arena de Almas.",
        "type": "debuff",
        "icon": "💀",
        "key": null
      },
      {
        "name": "Dieta fúngica",
        "desc": "Puedes alimentarte de hongos carmesí y distorsionados (clic derecho) para restaurar 5 puntos de hambre y 0.6 de saturación.",
        "type": "buff",
        "icon": "🍄",
        "key": null
      }
    ]
  },
  {
    "name": "Cultivador de Qi (Qi Cultivator)",
    "emoji": "☯️",
    "impact": "medium",
    "description": "Un practicante de artes internas que canaliza el Qi en golpes de palma a distancia y endurece su cuerpo. Medita para rellenar tus reservas, ya que un cultivador sin energía es solo un monje.",
    "traits": [
      {
        "name": "Qi",
        "desc": "Tu energía interna. Se gasta en artes de palma y se repone lentamente, o de forma rápida mediante la meditación.",
        "type": "resource",
        "icon": "☯️",
        "key": null
      },
      {
        "name": "Meditación",
        "desc": "Agáchate y mantente quieto para reunir Qi mucho más rápido de lo que regresa por sí solo.",
        "type": "buff",
        "icon": "⚡",
        "key": null
      },
      {
        "name": "Calma interior",
        "desc": "Mientras meditas (agachado), tu Qi circulante cura tus heridas de forma pasiva.",
        "type": "buff",
        "icon": "🧘",
        "key": null
      },
      {
        "name": "Palma vibrante [V]",
        "desc": "Lanza un proyectil de Qi comprimido que golpea a distancia. Cuesta 25 de Qi.",
        "type": "ability",
        "icon": "☯️",
        "key": "V"
      },
      {
        "name": "Qi endurecido [G]",
        "desc": "Inunda tu cuerpo con Qi para fortalecerlo, obteniendo Resistencia II durante 6 segundos. Cuesta 30 de Qi.",
        "type": "ability",
        "icon": "☯️",
        "key": "G"
      }
    ]
  },
  {
    "name": "Renacido (Revenant)",
    "emoji": "🧟",
    "impact": "medium",
    "description": "Un errante no muerto que atraviesa la materia y lanza proyectiles de marchitamiento. No se ahoga y ve en la oscuridad, pero se cura lentamente y se quema con la luz del sol.",
    "traits": [
      {
        "name": "Naturaleza no muerta",
        "desc": "Eres clasificado como un no muerto. Las pociones de curación te dañan, las de daño te curan y eres inmune al veneno.",
        "type": "debuff",
        "icon": "💀",
        "key": null
      },
      {
        "name": "Sin aliento",
        "desc": "No necesitas respirar. Puedes sobrevivir indefinidamente bajo el agua.",
        "type": "buff",
        "icon": "🫁",
        "key": null
      },
      {
        "name": "Ojos de hombre muerto",
        "desc": "Puedes ver claramente en la oscuridad total.",
        "type": "buff",
        "icon": "👁️",
        "key": null
      },
      {
        "name": "Paso en fase [V]",
        "desc": "Atraviesa una pared sólida en la dirección a la que estés mirando. Tiempo de recarga de 3 segundos.",
        "type": "ability",
        "icon": "🌌",
        "key": "V"
      },
      {
        "name": "Proyectil del vacío [G]",
        "desc": "Dispara un rayo de energía marchita que explota creando un área de niebla dañina. Cuesta 1 de energía. Recarga de 4 segundos.",
        "type": "ability",
        "icon": "🔮",
        "key": "G"
      },
      {
        "name": "Maldición de la luz solar",
        "desc": "Te prendes fuego y recibes 2 puntos de daño por segundo al exponerte a la luz solar directa.",
        "type": "debuff",
        "icon": "☀️",
        "key": null
      },
      {
        "name": "Forma marchita",
        "desc": "Tu regeneración de salud natural se reduce al 40% de lo normal.",
        "type": "debuff",
        "icon": "🥀",
        "key": null
      },
      {
        "name": "Energía",
        "desc": "Energía interna utilizada para habilidades rápidas.",
        "type": "resource",
        "icon": "⚡",
        "key": null
      }
    ]
  },
  {
    "name": "Nacido del Sculk (Sculkborn)",
    "emoji": "👾",
    "impact": "high",
    "description": "Un ser de la oscuridad profunda. Está acorazado, es resistente y posee poder sónico, pero es lento, frágil bajo el sol y se debilita en la superficie.",
    "traits": [
      {
        "name": "Alarido sónico [V]",
        "desc": "Dispara un devastador proyectil sónico que golpea en un radio de 7 bloques. Cuesta 2 de aguante y tiene 6 segundos de recarga.",
        "type": "ability",
        "icon": "🔊",
        "key": "V"
      },
      {
        "name": "Pulso de Sculk [G]",
        "desc": "Dispara un pulso sónico que deja un campo persistente de Oscuridad a su paso. Cuesta 3 de aguante y tiene 15 segundos de recarga.",
        "type": "ability",
        "icon": "👾",
        "key": "G"
      },
      {
        "name": "Ecolocalización",
        "desc": "Percibes el mundo a través de vibraciones; la oscuridad no es un obstáculo para ti.",
        "type": "buff",
        "icon": "👁️‍🗨️",
        "key": null
      },
      {
        "name": "Caparazón de Sculk",
        "desc": "Resistencia I permanente (tus densas placas de sculk absorben el daño).",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Profundamente enraizado",
        "desc": "Tienes un 50% de resistencia al empuje (knockback).",
        "type": "buff",
        "icon": "⚓",
        "key": null
      },
      {
        "name": "Agonía superficial",
        "desc": "Recibes 2 puntos de daño por segundo al exponerte a la luz solar directa.",
        "type": "debuff",
        "icon": "☀️",
        "key": null
      },
      {
        "name": "Deflexión sónica",
        "desc": "Las flechas que te disparen son desviadas por tus campos de vibración.",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Sentido de vibración",
        "desc": "Sientes el movimiento a través del suelo; las entidades vivas cercanas brillarán para ti.",
        "type": "buff",
        "icon": "👁️‍🗨️",
        "key": null
      },
      {
        "name": "Pesado",
        "desc": "Te mueves un 15% más lento de lo normal.",
        "type": "debuff",
        "icon": "⚓",
        "key": null
      },
      {
        "name": "Forma hueca",
        "desc": "Tu salud máxima se reduce en 2 corazones. Un cuerpo hecho a medias de sculk es quebradizo.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Aguante",
        "desc": "Reservas físicas para utilizar tus habilidades.",
        "type": "resource",
        "icon": "🏃",
        "key": null
      }
    ]
  },
  {
    "name": "Shulk",
    "emoji": "🐚",
    "impact": "high",
    "description": "Acorazado como un shulker. Ignora los golpes, se refugia en su caparazón al verse acorralado y lanza a sus enemigos por los aires con levitación. Lento, pero inquebrantable.",
    "traits": [
      {
        "name": "Caparazón",
        "desc": "Resistencia I permanente. Tu caparazón absorbe golpes que romperían un cuerpo más blando.",
        "type": "buff",
        "icon": "🐚",
        "key": null
      },
      {
        "name": "Masa de Shulker",
        "desc": "Te mueves más lento de lo normal.",
        "type": "debuff",
        "icon": "🥀",
        "key": null
      },
      {
        "name": "Liberación de proyectiles [V]",
        "desc": "Libera una ráfaga de proyectiles que hacen levitar a los enemigos cercanos hacia arriba durante 3 segundos. Cuesta 2 de aguante. Recarga de 8 segundos.",
        "type": "ability",
        "icon": "🐚",
        "key": "V"
      },
      {
        "name": "Retirada al caparazón [G]",
        "desc": "Te desvaneces dentro de tu caparazón y reapareces hasta a 12 bloques de distancia. Cuesta 3 de aguante. Recarga de 10 segundos.",
        "type": "ability",
        "icon": "🐚",
        "key": "G"
      },
      {
        "name": "Aterrizado",
        "desc": "Eres inmune al efecto de levitación. Tu caparazón te mantiene anclado al suelo.",
        "type": "buff",
        "icon": "⚓",
        "key": null
      },
      {
        "name": "Aguante",
        "desc": "Reservas físicas requeridas para lanzar tus habilidades.",
        "type": "resource",
        "icon": "🏃",
        "key": null
      }
    ]
  },
  {
    "name": "Esqueleto (Skeleton)",
    "emoji": "💀",
    "impact": "high",
    "description": "Un saco de huesos reanimado. Rápido, ligero y letal con el arco. De constitución frágil, huye del sol y solo puede ingerir los bocados más repugnantes.",
    "traits": [
      {
        "name": "No muerto",
        "desc": "Eres un no muerto. Las pociones de curación te dañan, las de daño te curan y el encantamiento Golpe (Smite) te inflige daño extra.",
        "type": "buff",
        "icon": "⚔️",
        "key": null
      },
      {
        "name": "Puntería",
        "desc": "Infliges +2 de daño adicional al usar armas de proyectiles.",
        "type": "buff",
        "icon": "🏹",
        "key": null
      },
      {
        "name": "Huesos ligeros",
        "desc": "Al tener los huesos huecos, eres un 20% más rápido al caminar.",
        "type": "buff",
        "icon": "⚡",
        "key": null
      },
      {
        "name": "Peso pluma",
        "desc": "Saltas un 30% más alto de lo normal.",
        "type": "buff",
        "icon": "🪶",
        "key": null
      },
      {
        "name": "Estructura frágil",
        "desc": "Tus huesos son débiles, lo que reduce tu salud máxima a 7 corazones.",
        "type": "buff",
        "icon": "⚡",
        "key": null
      },
      {
        "name": "Quemado por el sol",
        "desc": "Te quemas bajo la luz solar directa a menos que lleves puesto un casco.",
        "type": "debuff",
        "icon": "☀️",
        "key": null
      },
      {
        "name": "Dieta sin huesos",
        "desc": "Solo puedes comer polvo de hueso, carne podrida y ojos de araña.",
        "type": "debuff",
        "icon": "🦴",
        "key": null
      },
      {
        "name": "Apetito óseo",
        "desc": "El polvo de hueso es totalmente comestible para ti.",
        "type": "buff",
        "icon": "🦴",
        "key": null
      }
    ]
  },
  {
    "name": "Slime",
    "emoji": "🟢",
    "impact": "high",
    "description": "Un ser gelatinoso que debe mantenerse hidratado para sobrevivir. Rebota sin hacerse daño al caer, se divide para evitar la muerte si está bien húmedo y se vuelve más resistente con la experiencia.",
    "traits": [
      {
        "name": "Humedad",
        "desc": "Tienes una barra de humedad que se agota con el tiempo (más rápido en desiertos o si te prendes fuego). Quédate en el agua o bajo la lluvia para rehidratarte. Por encima del 75%: Regeneración I. Por debajo del 10%: -4 de armadura. Al 0%: Comienzas a recibir daño.",
        "type": "resource",
        "icon": "💧",
        "key": null
      },
      {
        "name": "División",
        "desc": "Si vas a morir y tienes más del 75% de humedad, en lugar de morir te divides, teletransportándote a 50 bloques de distancia con 2 corazones. Tu salud máxima se regenerará a la normalidad al cabo de 2 minutos.",
        "type": "buff",
        "icon": "🟢",
        "key": null
      },
      {
        "name": "Crecimiento gelatinoso",
        "desc": "Obtienes +1 corazón de vida máxima por cada 10 niveles de experiencia. Esto se reinicia al morir.",
        "type": "buff",
        "icon": "🟢",
        "key": null
      },
      {
        "name": "Rebotar",
        "desc": "Eres inmune al daño por caída; en su lugar, rebotas.",
        "type": "buff",
        "icon": "🟢",
        "key": null
      }
    ]
  },
  {
    "name": "Engendro de Esporas (Sporeling)",
    "emoji": "🍄",
    "impact": "medium",
    "description": "Criatura fúngica que prospera en la oscuridad y los campos de champiñones. Ataca con esporas tóxicas, pero se marchita con la luz del sol.",
    "traits": [
      {
        "name": "Nube de esporas [V]",
        "desc": "Dispara un proyectil que entra en erupción creando una nube persistente de esporas venenosas. Cuesta 3 de vitalidad. Recarga de 12 segundos.",
        "type": "ability",
        "icon": "⚡",
        "key": "V"
      },
      {
        "name": "Resiliencia tóxica",
        "desc": "Eres completamente inmune a todos los efectos de veneno.",
        "type": "buff",
        "icon": "☣️",
        "key": null
      },
      {
        "name": "Vista de micelio",
        "desc": "Puedes ver claramente en la oscuridad total.",
        "type": "buff",
        "icon": "👁️",
        "key": null
      },
      {
        "name": "Simbiosis fúngica",
        "desc": "Tu salud se regenera de forma pasiva mientras te encuentres en biomas de champiñones.",
        "type": "buff",
        "icon": "🍄",
        "key": null
      },
      {
        "name": "Contacto fúngico",
        "desc": "Te curas 1 punto de vida por segundo al estar parado sobre o dentro de bloques de champiñón o micelio.",
        "type": "buff",
        "icon": "🍄",
        "key": null
      },
      {
        "name": "Caparazón fúngico",
        "desc": "Resistencia I permanente. Tu crecimiento fúngico endurecido suaviza los golpes.",
        "type": "buff",
        "icon": "🐚",
        "key": null
      },
      {
        "name": "Marchitamiento solar",
        "desc": "Recibes 1 punto de daño por segundo al exponerte a la luz solar directa.",
        "type": "debuff",
        "icon": "☀️",
        "key": null
      },
      {
        "name": "Paso enraizado",
        "desc": "Te mueves un 10% más lento de lo normal.",
        "type": "buff",
        "icon": "⚓",
        "key": null
      },
      {
        "name": "Vitalidad",
        "desc": "Fuerza vital extraída de la naturaleza.",
        "type": "resource",
        "icon": "🌱",
        "key": null
      }
    ]
  },
  {
    "name": "Guardia de Piedra (Stoneguard)",
    "emoji": "🧱",
    "impact": "medium",
    "description": "Nacido de la piedra viva. Un centinela inquebrantable que devuelve el daño a sus atacantes, mina roca con las manos desnudas y coloca luz en la oscuridad. Es lento, pero la tierra firme lo protege.",
    "traits": [
      {
        "name": "Piel de piedra",
        "desc": "Tu cuerpo de piedra te otorga +3 corazones de vida máxima.",
        "type": "buff",
        "icon": "🧱",
        "key": null
      },
      {
        "name": "Rebote rocoso",
        "desc": "Devuelves un 20% del daño que recibes a tus atacantes.",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Aterrizado",
        "desc": "Tienes un 50% de resistencia al empuje (knockback).",
        "type": "buff",
        "icon": "⚓",
        "key": null
      },
      {
        "name": "Luz de piedra [V]",
        "desc": "Coloca un bloque de piedra luminosa (glowstone) en la superficie que estés mirando. Recarga de 100 ticks (unos 5 segundos).",
        "type": "ability",
        "icon": "✨",
        "key": "V"
      },
      {
        "name": "Pies de piedra",
        "desc": "Te mueves un 10% más lento que un humano normal.",
        "type": "debuff",
        "icon": "🐢",
        "key": null
      },
      {
        "name": "Triturador de piedra",
        "desc": "Rompes bloques el doble de rápido.",
        "type": "buff",
        "icon": "⛏️",
        "key": null
      },
      {
        "name": "Presencia protectora [G] (Alternable)",
        "desc": "Los monstruos no podrán aparecer (spawnear) en un radio de 48 bloques a tu alrededor.",
        "type": "ability",
        "icon": "🧪",
        "key": "G"
      },
      {
        "name": "Aguante",
        "desc": "Reservas físicas para tus habilidades activas.",
        "type": "resource",
        "icon": "🏃",
        "key": null
      }
    ]
  },
  {
    "name": "Strider",
    "emoji": "🏃",
    "impact": "high",
    "description": "Una criatura nativa del Nether que camina sobre la lava y se cura con su calor, pero el mundo exterior frío y el agua son devastadores para ella.",
    "traits": [
      {
        "name": "Nacido en la lava",
        "desc": "Inmunidad total al fuego, la lava, los bloques de magma y las quemaduras.",
        "type": "buff",
        "icon": "🌋",
        "key": null
      },
      {
        "name": "Velocidad del Nether",
        "desc": "Obtienes un impulso de velocidad pasivo mientras estás en el Nether.",
        "type": "buff",
        "icon": "🔥",
        "key": null
      },
      {
        "name": "Hidrofobia",
        "desc": "Recibes 2 puntos de daño por segundo al tocar el agua o bajo la lluvia.",
        "type": "debuff",
        "icon": "💧",
        "key": null
      },
      {
        "name": "Recuperación de magma",
        "desc": "Te curas 2 puntos de vida por segundo mientras estás sumergido en lava.",
        "type": "buff",
        "icon": "🌋",
        "key": null
      },
      {
        "name": "Visión del Nether",
        "desc": "Puedes ver de forma clara en la oscuridad total.",
        "type": "buff",
        "icon": "👁️",
        "key": null
      },
      {
        "name": "Sangre fría",
        "desc": "Te mueves más lento cuando estás en el mundo exterior (Overworld) frío.",
        "type": "debuff",
        "icon": "❄️",
        "key": null
      },
      {
        "name": "Piel de obsidiana",
        "desc": "Resistencia I permanente. Tu piel endurecida por el magma absorbe los impactos.",
        "type": "buff",
        "icon": "🧱",
        "key": null
      },
      {
        "name": "Estampida [V]",
        "desc": "Cargas hacia adelante impulsado por tus gruesas piernas. Cuesta 2 de aguante. Recarga de 4 segundos.",
        "type": "ability",
        "icon": "⚡",
        "key": "V"
      },
      {
        "name": "Dieta fúngica",
        "desc": "Puedes alimentarte de hongos carmesí y distorsionados del Nether (clic derecho para obtener 5 de hambre y 0.6 de saturación).",
        "type": "buff",
        "icon": "🍄",
        "key": null
      },
      {
        "name": "Aguante",
        "desc": "Reservas físicas que se consumen al usar habilidades.",
        "type": "resource",
        "icon": "🏃",
        "key": null
      }
    ]
  },
  {
    "name": "Silvano (Sylvan)",
    "emoji": "🌳",
    "impact": "low",
    "description": "Un espíritu del bosque antiguo. Veloz entre los árboles, amado por la fauna y capaz de enredar a los enemigos con raíces. La lluvia lo cura, pero el Nether lo abrasa.",
    "traits": [
      {
        "name": "Uno con la naturaleza",
        "desc": "Los monstruos hostiles te dejan en paz; solo te atacarán si tú los golpeas primero.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Abrazo de la lluvia",
        "desc": "Te curas lentamente mientras estás en contacto con el agua.",
        "type": "buff",
        "icon": "🌧️",
        "key": null
      },
      {
        "name": "Nacido en el bosque",
        "desc": "Obtienes un impulso de velocidad pasivo mientras te encuentras en biomas de bosque.",
        "type": "buff",
        "icon": "🌳",
        "key": null
      },
      {
        "name": "Bendición de la naturaleza",
        "desc": "Los cultivos cercanos crecen más rápido en tu presencia, como si la tierra estuviera bendecida.",
        "type": "buff",
        "icon": "🌱",
        "key": null
      },
      {
        "name": "Enredadera [V]",
        "desc": "Enraíza a todas las criaturas cercanas en su lugar, aplicándoles una poderosa Lentitud VI durante 4 segundos. Cuesta 2 de vitalidad. Recarga de 200 ticks (10 segundos).",
        "type": "ability",
        "icon": "🌿",
        "key": "V"
      },
      {
        "name": "Maldición de corrupción",
        "desc": "Recibes 1 punto de daño por segundo mientras estás en biomas del Nether. Llevar botas con el encantamiento Paso Helado (Frost Walker) previene completamente este daño.",
        "type": "debuff",
        "icon": "💀",
        "key": null
      },
      {
        "name": "Vitalidad",
        "desc": "Fuerza vital extraída de la naturaleza para tus habilidades.",
        "type": "resource",
        "icon": "🌱",
        "key": null
      }
    ]
  },
  {
    "name": "Pequeño (Tiny)",
    "emoji": "👶",
    "impact": "medium",
    "description": "Pequeño en estatura pero rápido y ágil. Escala cualquier pared, atrae objetos caídos desde lejos, pero sus golpes son suaves como una pluma.",
    "traits": [
      {
        "name": "Diminuto",
        "desc": "Eres solo un 50% del tamaño de un jugador normal.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Agarre de superficie",
        "desc": "Puedes escalar cualquier pared con total facilidad.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Escurridizo",
        "desc": "Te mueves un 20% más rápido que un humano normal.",
        "type": "buff",
        "icon": "⚡",
        "key": null
      },
      {
        "name": "Ligero como una pluma",
        "desc": "Eres tan pequeño que apenas notas las caídas. Inmunidad total al daño por caída.",
        "type": "debuff",
        "icon": "🥀",
        "key": null
      },
      {
        "name": "Coleccionista [V] (Alternable)",
        "desc": "Los objetos tirados en el suelo son atraídos hacia ti desde una mayor distancia.",
        "type": "ability",
        "icon": "🧲",
        "key": "V"
      },
      {
        "name": "Brazos pequeños",
        "desc": "Tus golpes cuerpo a cuerpo infligen 2 puntos de daño menos.",
        "type": "debuff",
        "icon": "📏",
        "key": null
      },
      {
        "name": "Estómago pequeño",
        "desc": "Tu barra de hambre se vacía un 80% más rápido, los cuerpos pequeños queman energía velozmente.",
        "type": "debuff",
        "icon": "🍖",
        "key": null
      }
    ]
  },
  {
    "name": "Umbral",
    "emoji": "🌑",
    "impact": "medium",
    "description": "Un hijo de las sombras. Lanza orbes de energía oscura, se desplaza a gran velocidad y desvía las flechas. Es muy ágil en la oscuridad, pero se quema con la luz del sol.",
    "traits": [
      {
        "name": "Visión de sombras",
        "desc": "Ves perfectamente en la oscuridad total.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Orbe de sombras [V]",
        "desc": "Coloca un orbe invisible que sume un radio de 28 bloques en Oscuridad. Puedes tener hasta 4 orbes activos a la vez; al poner uno nuevo se elimina el más antiguo. Cuesta 2 de energía. Recarga de 3 segundos (60 ticks).",
        "type": "ability",
        "icon": "🌑",
        "key": "V"
      },
      {
        "name": "Impulso de sombras [G]",
        "desc": "Te lanzas a gran velocidad hacia adelante en la dirección en la que te mueves. Cuesta 2 de energía. Recarga de 3 segundos (60 ticks).",
        "type": "ability",
        "icon": "🌑",
        "key": "G"
      },
      {
        "name": "Aversión a la luz",
        "desc": "Recibes 1 punto de daño por segundo al exponerte a la luz solar directa.",
        "type": "debuff",
        "icon": "☀️",
        "key": null
      },
      {
        "name": "Paso de sombras",
        "desc": "Las flechas atraviesan tu forma sombría sin hacerte ningún daño.",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Carrera de sombras",
        "desc": "Correr (sprintar) no te consume hambre adicional.",
        "type": "buff",
        "icon": "🏃",
        "key": null
      },
      {
        "name": "Energía",
        "desc": "Energía interna utilizada para tus habilidades rápidas.",
        "type": "resource",
        "icon": "⚡",
        "key": null
      }
    ]
  },
  {
    "name": "Vampiro (Vampire)",
    "emoji": "🧛",
    "impact": "high",
    "description": "Un depredador no muerto de la noche. Veloz, fuerte y eternamente hambriento. La luz del sol le causa agonía, el agua corriente lo quema y solo puede sustentarse a base de carne cruda.",
    "traits": [
      {
        "name": "Naturaleza no muerta",
        "desc": "Eres clasificado como un no muerto. Las pociones de curación te dañan, las de daño te curan y eres inmune al veneno.",
        "type": "debuff",
        "icon": "💀",
        "key": null
      },
      {
        "name": "Ojos de depredador",
        "desc": "Puedes ver claramente en la oscuridad total.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Colmillos",
        "desc": "Infliges 2 puntos de daño extra en cada golpe.",
        "type": "buff",
        "icon": "🧛",
        "key": null
      },
      {
        "name": "Velocidad sobrenatural",
        "desc": "Te mueves un 15% más rápido, siendo un destello bajo la luz de la luna.",
        "type": "buff",
        "icon": "⚡",
        "key": null
      },
      {
        "name": "Quemadura solar",
        "desc": "Te prendes fuego y recibes 2 puntos de daño por segundo al exponerte a la luz solar directa.",
        "type": "debuff",
        "icon": "☀️",
        "key": null
      },
      {
        "name": "Vitalidad de cadáver",
        "desc": "Tu regeneración de salud natural se reduce al 40% de lo normal.",
        "type": "resource",
        "icon": "🌱",
        "key": null
      },
      {
        "name": "Dieta de sangre",
        "desc": "Solo puedes alimentarte de carne cruda, carne podrida y ojos de araña.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Agua corriente",
        "desc": "Recibes 1 punto de daño por segundo mientras estás en el agua o bajo la lluvia.",
        "type": "debuff",
        "icon": "💧",
        "key": null
      }
    ]
  },
  {
    "name": "Verdante (Verdant)",
    "emoji": "🌱",
    "impact": "low",
    "description": "La encarnación viva del mundo verde. Incansable y en paz con la naturaleza salvaje, pero es severamente destruido por la corrupción del Nether.",
    "traits": [
      {
        "name": "Parentesco salvaje",
        "desc": "Todas las criaturas del juego (incluso las hostiles) te ignoran por completo, a menos que tú las ataques primero.",
        "type": "buff",
        "icon": "🌱",
        "key": null
      },
      {
        "name": "Aterrizaje de raíces",
        "desc": "Las raíces amortiguan todas tus caídas, haciéndote inmune al daño por caída.",
        "type": "buff",
        "icon": "🪶",
        "key": null
      },
      {
        "name": "Incansable",
        "desc": "Correr (sprintar) no consume hambre extra.",
        "type": "buff",
        "icon": "🏃",
        "key": null
      },
      {
        "name": "Cosecha abundante",
        "desc": "Al romper cultivos maduros o troncos de madera obtienes un bloque o ítem adicional de botín.",
        "type": "buff",
        "icon": "🌾",
        "key": null
      },
      {
        "name": "Corazón del bosque",
        "desc": "Regeneras salud de forma lenta y pasiva mientras te encuentres en biomas de bosque.",
        "type": "buff",
        "icon": "🌳",
        "key": null
      },
      {
        "name": "Putrefacción por corrupción",
        "desc": "Recibes 2 puntos de daño por segundo mientras estás en el Nether. (Las botas con el encantamiento Paso Helado evitan este daño por completo).",
        "type": "debuff",
        "icon": "💀",
        "key": null
      }
    ]
  },
  {
    "name": "Caminante del Vacío (Voidwalker)",
    "emoji": "🌌",
    "impact": "medium",
    "description": "Un ser tocado por la energía del End. Puede atravesar bloques, teletransportarse cortas distancias y caminar sin ser detectado por los monstruos. Corre sin cansarse, pero el agua es una agonía para él.",
    "traits": [
      {
        "name": "Paseo en fase [V]",
        "desc": "Atraviesa una pared sólida en la dirección a la que estés mirando. Cuesta 3 de energía. Recarga de 4 segundos (80 ticks).",
        "type": "ability",
        "icon": "🌌",
        "key": "V"
      },
      {
        "name": "Paso del vacío [G]",
        "desc": "Te teletransportas a donde estás mirando (hasta un máximo de 24 bloques). Cuesta 2 de energía. Recarga de 4 segundos (80 ticks).",
        "type": "ability",
        "icon": "🌌",
        "key": "G"
      },
      {
        "name": "Visión del vacío",
        "desc": "Ves a la perfección en la oscuridad total.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Invisible",
        "desc": "Las criaturas hostiles no notan tu presencia a menos que tú las ataques.",
        "type": "buff",
        "icon": "🌫️",
        "key": null
      },
      {
        "name": "Quemado por el vacío",
        "desc": "Recibes 1 punto de daño por segundo al entrar en contacto con el agua o la lluvia.",
        "type": "debuff",
        "icon": "💧",
        "key": null
      },
      {
        "name": "Ingrávido",
        "desc": "Correr (sprintar) no te consume hambre extra.",
        "type": "buff",
        "icon": "🪶",
        "key": null
      },
      {
        "name": "Energía",
        "desc": "Energía interna para utilizar tus habilidades.",
        "type": "resource",
        "icon": "⚡",
        "key": null
      }
    ]
  },
  {
    "name": "Warden",
    "emoji": "👾",
    "impact": "high",
    "description": "Nacido de la Oscuridad Profunda (Deep Dark). Siente el mundo a través de vibraciones, lanza un estampido sónico a distancia y golpea como un ariete. Lento en sus movimientos y sufre con la luz solar.",
    "traits": [
      {
        "name": "Estampido sónico [V]",
        "desc": "Dispara una devastadora ráfaga sónica que inflige 8 de daño mágico y aplica Lentitud III en un área de 10 bloques. Cuesta 4 de aguante. Recarga de 20 segundos.",
        "type": "ability",
        "icon": "🔊",
        "key": "V"
      },
      {
        "name": "Ecolocalización [G] (Alternable)",
        "desc": "Las entidades vivas cercanas brillan, lo que te permite verlas incluso a través de las paredes.",
        "type": "ability",
        "icon": "👁️‍🗨️",
        "key": "G"
      },
      {
        "name": "Sentido de temblor [N] (Alternable)",
        "desc": "Percibes entidades lejanas: cada 2 segundos, cualquier cosa en un radio de 24 bloques brillará durante 3 segundos.",
        "type": "ability",
        "icon": "👾",
        "key": "N"
      },
      {
        "name": "Fuerza de la Oscuridad Profunda",
        "desc": "Infliges 4 puntos de daño extra por cada golpe.",
        "type": "buff",
        "icon": "👾",
        "key": null
      },
      {
        "name": "Piel ancestral",
        "desc": "Resistencia II permanente. Tu carne primordial y tus gruesas placas de sculk ignoran gran parte del daño.",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Vista de la Oscuridad Profunda [B] (Alternable)",
        "desc": "Percibes el mundo por sus vibraciones, por lo que la oscuridad total te resulta irrelevante.",
        "type": "ability",
        "icon": "👾",
        "key": "B"
      },
      {
        "name": "Estructura colosal",
        "desc": "Eres un 15% más grande que un jugador normal.",
        "type": "debuff",
        "icon": "🗿",
        "key": null
      },
      {
        "name": "Agonía diurna",
        "desc": "Recibes 1 punto de daño por segundo al estar expuesto a la luz solar directa.",
        "type": "debuff",
        "icon": "☀️",
        "key": null
      },
      {
        "name": "Torpe",
        "desc": "Te mueves un 30% más lento de lo normal. Eres una fuerza devastadora, pero pesada.",
        "type": "debuff",
        "icon": "🐢",
        "key": null
      },
      {
        "name": "Aguante",
        "desc": "Reservas físicas para usar tus habilidades activas.",
        "type": "resource",
        "icon": "🏃",
        "key": null
      }
    ]
  },
  {
    "name": "Mago de Agua (Water Mage)",
    "emoji": "💧",
    "impact": "high",
    "description": "Un hechicero que controla las mareas y las corrientes curativas. Se siente en casa bajo el océano, pero se debilita enormemente en los páramos áridos.",
    "traits": [
      {
        "name": "Maremoto [V]",
        "desc": "Lanza un cono de agua hacia adelante que inflige 4 puntos de daño y empuja a los enemigos lejos de ti. Recarga de 5 segundos.",
        "type": "ability",
        "icon": "🌊",
        "key": "V"
      },
      {
        "name": "Niebla curativa [G]",
        "desc": "Libera una onda de curación que restaura 6 puntos de vida a ti y a los jugadores cercanos. Cuesta 3 de maná. Recarga de 10 segundos.",
        "type": "ability",
        "icon": "💚",
        "key": "G"
      },
      {
        "name": "Acuático",
        "desc": "Puedes respirar bajo el agua indefinidamente.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Corriente veloz",
        "desc": "Nadas significativamente más rápido que un humano normal.",
        "type": "buff",
        "icon": "🌊",
        "key": null
      },
      {
        "name": "Regeneración por humedad",
        "desc": "Regeneras salud lentamente mientras estás sumergido en agua.",
        "type": "resource",
        "icon": "💧",
        "key": null
      },
      {
        "name": "Deshidratación",
        "desc": "Recibes daño constante si estás en desiertos o badlands (tierras baldías), el aire seco drena tus fuerzas.",
        "type": "debuff",
        "icon": "🏜️",
        "key": null
      },
      {
        "name": "Frágil",
        "desc": "Infliges un 25% menos de daño cuerpo a cuerpo. Tu poder fluye por el agua, no por el músculo.",
        "type": "buff",
        "icon": "⚡",
        "key": null
      },
      {
        "name": "Maná",
        "desc": "Energía mágica utilizada para lanzar tus hechizos.",
        "type": "resource",
        "icon": "🔮",
        "key": null
      }
    ]
  },
  {
    "name": "Caminante del Viento (Windwalker)",
    "emoji": "💨",
    "impact": "medium",
    "description": "Maestro del qinggong, el arte de la ingravidez. Camina por el aire, escala paredes escarpadas y corre con el viento sin temer jamás a las caídas, aunque no posee gran fuerza física en combate.",
    "traits": [
      {
        "name": "Caída de pluma",
        "desc": "Flotas como una hoja en el viento y eres completamente inmune al daño por caída.",
        "type": "buff",
        "icon": "🪶",
        "key": null
      },
      {
        "name": "Salto elevado",
        "desc": "El viento te eleva a cada paso: saltas mucho más alto que cualquier luchador atado a la tierra.",
        "type": "buff",
        "icon": "💨",
        "key": null
      },
      {
        "name": "Pasos de nube [V]",
        "desc": "Pulsa saltar en el aire para impulsarte nuevamente (puedes hacerlo hasta dos veces antes de tocar el suelo). Esto mantiene tu impulso y velocidad.",
        "type": "ability",
        "icon": "💨",
        "key": "V"
      },
      {
        "name": "Gracia en el muro",
        "desc": "Te adhieres y escalas superficies verticales como una golondrina en un acantilado.",
        "type": "buff",
        "icon": "🧗",
        "key": null
      },
      {
        "name": "Impulso de vendaval [G]",
        "desc": "Te impulsas hacia adelante sobre una ráfaga de viento. Apunta hacia arriba para salir lanzado por los aires.",
        "type": "ability",
        "icon": "💨",
        "key": "G"
      },
      {
        "name": "Corriente rápida",
        "desc": "Te mueves con la ligereza del viento, siempre un paso más rápido de lo normal.",
        "type": "buff",
        "icon": "💨",
        "key": null
      },
      {
        "name": "Tifón desgarrador [N]",
        "desc": "Golpeas la tierra e invocas un rugiente ciclón que atrae a los enemigos, los golpea violentamente y los lanza hacia el cielo.",
        "type": "ability",
        "icon": "⚡",
        "key": "N"
      }
    ]
  },
  {
    "name": "Espectro (Wraith)",
    "emoji": "👻",
    "impact": "high",
    "description": "Un espíritu atormentado que vaga a través de la materia sólida. Puede atravesar casi cualquier bloque, excepto la obsidiana. Mantener su forma física le drena el hambre y la luz solar abrasa su cuerpo espectral.",
    "traits": [
      {
        "name": "Forma espectral [V] (Alternable)",
        "desc": "Te permite atravesar bloques sólidos. Mientras estás dentro de un bloque, puedes volar libremente (saltar para subir, agacharte para bajar). La obsidiana, la obsidiana llorosa y la piedra base (bedrock) bloquean tu paso. Estar en fase dentro de los bloques drena tu barra de hambre.",
        "type": "ability",
        "icon": "👻",
        "key": "V"
      },
      {
        "name": "Sensibilidad solar",
        "desc": "Te quemas al estar expuesto bajo la luz solar directa.",
        "type": "debuff",
        "icon": "☀️",
        "key": null
      },
      {
        "name": "Forma inestable",
        "desc": "Mantener tu cuerpo espectral es agotador: tu barra de hambre se vacía un 75% más rápido de lo normal.",
        "type": "debuff",
        "icon": "🍖",
        "key": null
      }
    ]
  }
];
