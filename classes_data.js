const CLASSES_DATA = [
  {
    "name": "Nini",
    "emoji": "🛡️",
    "impact": "none",
    "description": "No destaca en nada en particular. A veces, el camino más simple es el correcto.",
    "traits": []
  },
  {
    "name": "Arquero (Archer)",
    "emoji": "🏹",
    "impact": "none",
    "description": "Un especialista a distancia con una puntería perfecta y un ágil juego de pies.",
    "traits": [
      {
        "name": "Tirador certero",
        "desc": "Todos los proyectiles vuelan con una precisión perfecta (sin dispersión aleatoria).",
        "type": "buff",
        "icon": "🎯",
        "key": null
      },
      {
        "name": "Pies ligeros",
        "desc": "Te mueves un 15% más rápido de lo normal.",
        "type": "buff",
        "icon": "⚡",
        "key": null
      },
      {
        "name": "Ojo de halcón",
        "desc": "Ves con mayor claridad en condiciones de poca luz.",
        "type": "buff",
        "icon": "👁️",
        "key": null
      },
      {
        "name": "Perdición de los artrópodos",
        "desc": "Tus golpes a arañas y otros artrópodos los ralentizan durante 2 segundos.",
        "type": "buff",
        "icon": "🕷️",
        "key": null
      },
      {
        "name": "Arco inicial",
        "desc": "Apareces inicialmente con un arco con el encantamiento Poder I.",
        "type": "buff",
        "icon": "🏹",
        "key": null
      },
      {
        "name": "Flechas iniciales",
        "desc": "Apareces inicialmente con un carcaj de 16 flechas.",
        "type": "buff",
        "icon": "🎒",
        "key": null
      }
    ]
  },
  {
    "name": "Señor de las Bestias (Beastmaster)",
    "emoji": "🦁",
    "impact": "none",
    "description": "Un domador de animales cuyas mascotas comparten sus efectos de pociones, las cuales duran más tiempo.",
    "traits": [
      {
        "name": "Vínculo empático",
        "desc": "Los efectos de poción que recibes se comparten con tus animales domados cercanos.",
        "type": "buff",
        "icon": "🦁",
        "key": null
      },
      {
        "name": "Toque de alquimista",
        "desc": "Todos los efectos de pociones duran un 50% más de lo normal.",
        "type": "buff",
        "icon": "🧪",
        "key": null
      }
    ]
  },
  {
    "name": "Berserker",
    "emoji": "😡",
    "impact": "none",
    "description": "Un luchador frenético que sacrifica su barra de hambre a cambio de un poder bruto devastador.",
    "traits": [
      {
        "name": "Frenesí",
        "desc": "Infliges +3 de daño de ataque extra con todas las armas.",
        "type": "buff",
        "icon": "🔥",
        "key": null
      },
      {
        "name": "Voraz",
        "desc": "Tu barra de hambre se agota un 50% más rápido (la ira quema energía).",
        "type": "debuff",
        "icon": "🍖",
        "key": null
      },
      {
        "name": "Ira interior",
        "desc": "Infliges +2 de daño de ataque extra cuando tu salud está a la mitad o menos.",
        "type": "buff",
        "icon": "🩸",
        "key": null
      },
      {
        "name": "Temerario",
        "desc": "Tienes -2 puntos de armadura natural (la furia te hace olvidar defenderte).",
        "type": "debuff",
        "icon": "💔",
        "key": null
      },
      {
        "name": "Piel dura",
        "desc": "+20% de resistencia al empuje (knockback).",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      }
    ]
  },
  {
    "name": "Herrero (Blacksmith)",
    "emoji": "⚒️",
    "impact": "none",
    "description": "Un maestro artesano cuyo equipamiento es de mayor calidad y cuyas reparaciones son más eficientes.",
    "traits": [
      {
        "name": "Artesanía de calidad",
        "desc": "El equipo que fabricas es superior (las herramientas minan más rápido, las armas pegan más duro, las armaduras son más resistentes y todo dura más).",
        "type": "buff",
        "icon": "⚒️",
        "key": null
      },
      {
        "name": "Reparaciones eficientes",
        "desc": "Las reparaciones en el yunque cuestan menos y restauran más durabilidad.",
        "type": "buff",
        "icon": "🔧",
        "key": null
      },
      {
        "name": "Manos de forja",
        "desc": "Puedes romper piedra con las manos desnudas al mismo nivel que un pico de piedra.",
        "type": "buff",
        "icon": "🔨",
        "key": null
      },
      {
        "name": "Templado en la forja",
        "desc": "Recibes la mitad de daño por fuego, lava, bloques de magma y quemaduras.",
        "type": "buff",
        "icon": "🔥",
        "key": null
      },
      {
        "name": "Hierro inicial",
        "desc": "Apareces inicialmente con 4 lingotes de hierro en tu inventario.",
        "type": "buff",
        "icon": "🪙",
        "key": null
      }
    ]
  },
  {
    "name": "Clérigo (Cleric)",
    "emoji": "🛐",
    "impact": "none",
    "description": "Un erudito sagrado con habilidades de encantamiento mejoradas y pociones de mayor duración.",
    "traits": [
      {
        "name": "Maestría en encantamientos",
        "desc": "Las mesas de encantamientos ofrecen mejores opciones cuando las usas tú.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Pociones extendidas",
        "desc": "Todos los efectos de poción duran el doble.",
        "type": "buff",
        "icon": "🧪",
        "key": null
      },
      {
        "name": "Ahuyentar muertos vivientes",
        "desc": "Tus golpes a criaturas no muertas les aplican el efecto de Debilidad durante 4 segundos.",
        "type": "buff",
        "icon": "☠️",
        "key": null
      },
      {
        "name": "Visión divina",
        "desc": "Ves con mayor claridad en condiciones de poca luz.",
        "type": "buff",
        "icon": "👁️",
        "key": null
      },
      {
        "name": "Libro inicial",
        "desc": "Apareces inicialmente con un libro y pluma.",
        "type": "buff",
        "icon": "📖",
        "key": null
      }
    ]
  },
  {
    "name": "Cocinero (Cook)",
    "emoji": "🍳",
    "impact": "none",
    "description": "Un experto culinario cuya comida preparada es más nutritiva y que es resistente a los problemas estomacales.",
    "traits": [
      {
        "name": "Buenas comidas",
        "desc": "La comida que crafteas proporciona puntos de hambre y saturación adicionales.",
        "type": "buff",
        "icon": "🍲",
        "key": null
      },
      {
        "name": "Experto en ahumado",
        "desc": "La comida cocinada en un ahumador o en un horno recibe nutrición extra.",
        "type": "buff",
        "icon": "🥩",
        "key": null
      },
      {
        "name": "Estómago de hierro",
        "desc": "Eres completamente inmune a los efectos de Hambre y Náuseas.",
        "type": "buff",
        "icon": "⚙️",
        "key": null
      },
      {
        "name": "Paladar curtido",
        "desc": "Los efectos de las pociones en ti duran un 25% más.",
        "type": "buff",
        "icon": "👅",
        "key": null
      }
    ]
  },
  {
    "name": "Pescador (Fisher)",
    "emoji": "🎣",
    "impact": "medium",
    "description": "Vida a la orilla del agua. Extrae suerte de las mareas, nada como una foca y comienza con una caña bendecida.",
    "traits": [
      {
        "name": "Suerte de agua",
        "desc": "+1 de Suerte mientras estás en el agua.",
        "type": "buff",
        "icon": "🍀",
        "key": null
      },
      {
        "name": "Gracia de foca",
        "desc": "+15% de velocidad de movimiento mientras estás en el agua.",
        "type": "buff",
        "icon": "🌊",
        "key": null
      },
      {
        "name": "Piernas de mar",
        "desc": "El daño por ahogamiento se reduce a la mitad.",
        "type": "buff",
        "icon": "🏊",
        "key": null
      },
      {
        "name": "Caña bendecida",
        "desc": "Apareces inicialmente con una caña de pescar encantada con Suerte Marina I y Atracción I.",
        "type": "buff",
        "icon": "🎣",
        "key": null
      },
      {
        "name": "Visión turbia",
        "desc": "Obtienes Visión Nocturna mientras estás bajo el agua.",
        "type": "buff",
        "icon": "👁️",
        "key": null
      }
    ]
  },
  {
    "name": "Herborista (Herbalist)",
    "emoji": "🌿",
    "impact": "none",
    "description": "Tiene buena mano con las plantas, acelera el crecimiento de los cultivos, cosecha mayores cantidades y resiste el veneno.",
    "traits": [
      {
        "name": "Mano verde",
        "desc": "Los cultivos cercanos crecen más rápido en tu presencia.",
        "type": "buff",
        "icon": "🌱",
        "key": null
      },
      {
        "name": "Remedio natural",
        "desc": "Inmunidad al veneno.",
        "type": "buff",
        "icon": "🧪",
        "key": null
      },
      {
        "name": "Cosecha abundante",
        "desc": "Los cultivos rinden un 50% más al ser recolectados.",
        "type": "buff",
        "icon": "🌾",
        "key": null
      },
      {
        "name": "Polvo de hueso bendecido",
        "desc": "El uso de polvo de hueso hace crecer los cultivos una etapa adicional.",
        "type": "buff",
        "icon": "🦴",
        "key": null
      },
      {
        "name": "Semillas iniciales",
        "desc": "Apareces inicialmente con semillas de trigo.",
        "type": "buff",
        "icon": "🌾",
        "key": null
      },
      {
        "name": "Polvo de hueso inicial",
        "desc": "Apareces inicialmente con una pizca de polvo de hueso.",
        "type": "buff",
        "icon": "🦴",
        "key": null
      }
    ]
  },
  {
    "name": "Leñador (Lumberjack)",
    "emoji": "🪓",
    "impact": "none",
    "description": "Un maestro leñador que tala árboles enteros con un solo golpe y fabrica tablones extra a partir de los troncos.",
    "traits": [
      {
        "name": "¡Timber!",
        "desc": "Romper un tronco con un hacha tala todo el árbol de una vez.",
        "type": "buff",
        "icon": "🪓",
        "key": null
      },
      {
        "name": "Cortes eficientes",
        "desc": "Craftear tablones a partir de troncos produce 2 tablones extra.",
        "type": "buff",
        "icon": "🪵",
        "key": null
      },
      {
        "name": "Manos de hacha",
        "desc": "Puedes talar madera con las manos desnudas igual que si usaras un hacha de hierro.",
        "type": "buff",
        "icon": "🪓",
        "key": null
      },
      {
        "name": "Hacha inicial",
        "desc": "Apareces inicialmente con un hacha de hierro con Irrompibilidad II.",
        "type": "buff",
        "icon": "🪓",
        "key": null
      }
    ]
  },
  {
    "name": "Albañil (Mason)",
    "emoji": "🧱",
    "impact": "medium",
    "description": "La piedra cede ante manos expertas. Rompe bloques más rápido, sus palmas callosas protegen su cuerpo y siempre tiene un pico a mano.",
    "traits": [
      {
        "name": "Manos de piedra",
        "desc": "Puedes romper piedra con las manos desnudas igual que si usaras un pico de piedra.",
        "type": "buff",
        "icon": "🧱",
        "key": null
      },
      {
        "name": "Agarre fuerte",
        "desc": "+1 de armadura natural debido a años de agarre calloso.",
        "type": "buff",
        "icon": "✊",
        "key": null
      },
      {
        "name": "Golpe practicado",
        "desc": "Rompes bloques un 25% más rápido.",
        "type": "buff",
        "icon": "⚡",
        "key": null
      },
      {
        "name": "Pico inicial",
        "desc": "Apareces inicialmente con un pico de piedra con Eficiencia I.",
        "type": "buff",
        "icon": "⛏️",
        "key": null
      },
      {
        "name": "Alcance de albañil",
        "desc": "+1 bloque de alcance al colocar bloques.",
        "type": "buff",
        "icon": "📏",
        "key": null
      }
    ]
  },
  {
    "name": "Mercader (Merchant)",
    "emoji": "🪙",
    "impact": "none",
    "description": "Un astuto comerciante cuyos intercambios con aldeanos nunca se agotan y que encuentra productos raros de comerciantes ambulantes.",
    "traits": [
      {
        "name": "Reabastecimiento",
        "desc": "Los intercambios con aldeanos nunca se agotan para ti.",
        "type": "buff",
        "icon": "🔄",
        "key": null
      },
      {
        "name": "Carisma",
        "desc": "Los comerciantes ambulantes te ofrecen intercambios de nivel maestro y tienen una probabilidad de vender tesoros raros.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Esmeraldas iniciales",
        "desc": "Apareces inicialmente con una esmeralda para iniciar tu primer intercambio.",
        "type": "buff",
        "icon": "💎",
        "key": null
      },
      {
        "name": "Lengua de plata",
        "desc": "Los efectos de pociones duran un 15% más en ti.",
        "type": "buff",
        "icon": "💬",
        "key": null
      },
      {
        "name": "Comerciante afortunado",
        "desc": "+1 de Suerte (la buena fortuna encuentra a un buen regateador).",
        "type": "buff",
        "icon": "🍀",
        "key": null
      }
    ]
  },
  {
    "name": "Minero (Miner)",
    "emoji": "⛏️",
    "impact": "none",
    "description": "Un excavador experto que rompe bloques más rápido y mina sin cansarse.",
    "traits": [
      {
        "name": "Experto en minería",
        "desc": "Rompes bloques un 50% más rápido.",
        "type": "buff",
        "icon": "⛏️",
        "key": null
      },
      {
        "name": "Excavador eficiente",
        "desc": "Consumes un 30% menos de hambre mientras minas y exploras.",
        "type": "buff",
        "icon": "🔋",
        "key": null
      },
      {
        "name": "Puños de piedra",
        "desc": "Puedes romper piedra con las manos desnudas igual que si usaras un pico de piedra.",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Sentido de las profundidades",
        "desc": "Ves con mayor claridad en la oscuridad.",
        "type": "buff",
        "icon": "👁️",
        "key": null
      },
      {
        "name": "Espalda resistente",
        "desc": "+1 corazón (+2 de salud máxima) gracias a la estructura endurecida del minero.",
        "type": "buff",
        "icon": "💪",
        "key": null
      }
    ]
  },
  {
    "name": "Paladín (Paladin)",
    "emoji": "🛡️",
    "impact": "medium",
    "description": "Un guerrero sagrado. Los no muertos flaquean al tocarlo, el efecto Wither no puede tomar control y la luz de un faro cura sus heridas.",
    "traits": [
      {
        "name": "Ahuyentar muertos vivientes",
        "desc": "Tus golpes a criaturas no muertas les aplican el efecto de Debilidad durante 4 segundos.",
        "type": "buff",
        "icon": "☠️",
        "key": null
      },
      {
        "name": "Armadura sagrada",
        "desc": "+2 de armadura natural (la luz te protege).",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Regeneración de faro",
        "desc": "Regeneras salud lentamente mientras estás a menos de 8 bloques de un faro (beacon).",
        "type": "buff",
        "icon": "✨",
        "key": null
      },
      {
        "name": "Espada consagrada",
        "desc": "Apareces inicialmente con una espada de hierro con el encantamiento Golpe I (Smite).",
        "type": "buff",
        "icon": "⚔️",
        "key": null
      },
      {
        "name": "Protección sagrada",
        "desc": "Inmunidad al efecto Wither.",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      }
    ]
  },
  {
    "name": "Pícaro (Rogue)",
    "emoji": "🗡️",
    "impact": "none",
    "description": "Un asesino sigiloso que se vuelve invisible al agacharse e inflige un daño devastador por la espalda.",
    "traits": [
      {
        "name": "Presencia oculta",
        "desc": "Tu placa de nombre nunca es visible a través de las paredes y a los monstruos les resulta mucho más difícil detectarte.",
        "type": "buff",
        "icon": "🌫️",
        "key": null
      },
      {
        "name": "Sigilo [H] (Alternable)",
        "desc": "Tras agacharte durante 10 segundos, te vuelves invisible. Atacar desde atrás inflige el doble de daño.",
        "type": "ability",
        "icon": "👤",
        "key": "H"
      },
      {
        "name": "Aterrizaje suave",
        "desc": "Recibes la mitad de daño por caída.",
        "type": "buff",
        "icon": "🪶",
        "key": null
      },
      {
        "name": "Parkour",
        "desc": "Subes bloques enteros automáticamente sin necesidad de saltar.",
        "type": "buff",
        "icon": "🏃",
        "key": null
      },
      {
        "name": "Puñalada",
        "desc": "+2 de daño de ataque mientras estás agachado.",
        "type": "buff",
        "icon": "🗡️",
        "key": null
      }
    ]
  },
  {
    "name": "Explorador (Scout)",
    "emoji": "👣",
    "impact": "none",
    "description": "Un buscador de caminos de ojos agudos con visión nocturna, movimiento veloz y paso firme.",
    "traits": [
      {
        "name": "Ojos agudos",
        "desc": "Ves con mayor claridad en la oscuridad.",
        "type": "buff",
        "icon": "👁️",
        "key": null
      },
      {
        "name": "Zancada veloz",
        "desc": "Te mueves un 20% más rápido que un humano normal.",
        "type": "buff",
        "icon": "⚡",
        "key": null
      },
      {
        "name": "Paso firme",
        "desc": "Eres inmune al daño por caída.",
        "type": "buff",
        "icon": "🪶",
        "key": null
      },
      {
        "name": "Paso de rastreador",
        "desc": "Subes bloques enteros automáticamente sin necesidad de saltar.",
        "type": "buff",
        "icon": "🏃",
        "key": null
      },
      {
        "name": "Raciones de camino",
        "desc": "Apareces inicialmente con un pan para el camino.",
        "type": "buff",
        "icon": "🍞",
        "key": null
      }
    ]
  },
  {
    "name": "Centinela (Sentinel)",
    "emoji": "💂",
    "impact": "none",
    "description": "Un especialista defensivo con armadura natural, espinas y paso inamovible.",
    "traits": [
      {
        "name": "Placa del guardián",
        "desc": "+4 puntos de armadura natural.",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Retribución",
        "desc": "Devuelves el 25% del daño recibido a los atacantes.",
        "type": "buff",
        "icon": "⚔️",
        "key": null
      },
      {
        "name": "Anclado",
        "desc": "40% de resistencia al empuje (los centinelas se mantienen firmes en su posición).",
        "type": "buff",
        "icon": "⚓",
        "key": null
      },
      {
        "name": "Voluntad de hierro",
        "desc": "Inmunidad a los efectos de Debilidad y Lentitud.",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Resistencia de guardia",
        "desc": "+1 corazón (+2 de salud máxima) obtenido tras guardias interminables.",
        "type": "buff",
        "icon": "❤️",
        "key": null
      },
      {
        "name": "Postura de guardia",
        "desc": "+35% de resistencia adicional al empuje mientras estás agachado (75% en total).",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Cuchillo de cocinero",
        "desc": "Apareces inicialmente con una espada de hierro.",
        "type": "buff",
        "icon": "⚔️",
        "key": null
      }
    ]
  },
  {
    "name": "Explorador (Explorer)",
    "emoji": "🗺️",
    "impact": "none",
    "description": "Un viajero experimentado que comienza equipado para la aventura y rara vez se cansa.",
    "traits": [
      {
        "name": "Brújula inicial",
        "desc": "Apareces inicialmente con una brújula en tu inventario.",
        "type": "buff",
        "icon": "🧭",
        "key": null
      },
      {
        "name": "Reloj inicial",
        "desc": "Apareces inicialmente con un reloj en tu inventario.",
        "type": "buff",
        "icon": "⏰",
        "key": null
      },
      {
        "name": "Mapas iniciales",
        "desc": "Apareces inicialmente con 9 mapas vacíos.",
        "type": "buff",
        "icon": "🗺️",
        "key": null
      },
      {
        "name": "Resistencia",
        "desc": "Todas tus actividades consumen un 40% menos de hambre.",
        "type": "buff",
        "icon": "🔋",
        "key": null
      },
      {
        "name": "Pies firmes",
        "desc": "Eres inmune al daño por caída.",
        "type": "buff",
        "icon": "🪶",
        "key": null
      },
      {
        "name": "Paso de escalador",
        "desc": "Subes bloques enteros automáticamente sin necesidad de saltar (efecto Auto-Jump/Step up).",
        "type": "buff",
        "icon": "🧗",
        "key": null
      },
      {
        "name": "Descanso en la fogata",
        "desc": "Regeneras salud lentamente al estar a menos de 5 bloques de una fogata (solo si llevas al menos 5 segundos fuera de combate).",
        "type": "buff",
        "icon": "🔥",
        "key": null
      }
    ]
  },
  {
    "name": "Titán (Titan)",
    "emoji": "🗿",
    "impact": "none",
    "description": "Un bruto imponente con salud adicional, mayor alcance y una estatura majestuosa.",
    "traits": [
      {
        "name": "Imponente",
        "desc": "Eres un 25% más grande que un jugador normal.",
        "type": "debuff",
        "icon": "🗿",
        "key": null
      },
      {
        "name": "Piel gruesa",
        "desc": "+2 corazones (+4 de salud máxima).",
        "type": "buff",
        "icon": "❤️",
        "key": null
      },
      {
        "name": "Brazos largos",
        "desc": "Puedes interactuar con entidades desde una mayor distancia.",
        "type": "buff",
        "icon": "📏",
        "key": null
      },
      {
        "name": "Agarre aplastante",
        "desc": "+1 de daño de ataque; tienes manos como de piedra.",
        "type": "buff",
        "icon": "✊",
        "key": null
      },
      {
        "name": "Inamovible",
        "desc": "+20% de resistencia al empuje (knockback); un titán no tropieza.",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Pasos pesados",
        "desc": "Te mueves un 10% más lento; tal volumen ralentiza tu zancada.",
        "type": "debuff",
        "icon": "🐢",
        "key": null
      }
    ]
  },
  {
    "name": "Guerrero (Warrior)",
    "emoji": "⚔️",
    "impact": "none",
    "description": "Un especialista en combate que golpea con más fuerza y se mantiene firme contra el empuje.",
    "traits": [
      {
        "name": "Maestría con armas",
        "desc": "+1 de daño de ataque con todas las armas.",
        "type": "buff",
        "icon": "⚔️",
        "key": null
      },
      {
        "name": "Postura de batalla",
        "desc": "30% de resistencia al empuje (knockback).",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Postura de batalla",
        "desc": "+2 de armadura natural; la compostura de un luchador desvía golpes menores.",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      },
      {
        "name": "Resistencia del guerrero",
        "desc": "+1 corazón (+2 de salud máxima) obtenido por las cicatrices de batalla ganadas con esfuerzo.",
        "type": "buff",
        "icon": "🔋",
        "key": null
      },
      {
        "name": "Voluntad de hierro",
        "desc": "Inmunidad al efecto de Debilidad; nadie puede drenar tu fuerza.",
        "type": "buff",
        "icon": "🛡️",
        "key": null
      }
    ]
  }
];
