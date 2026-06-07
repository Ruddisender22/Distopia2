const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

const updates = {
  "jaeden-nether": [
    "Mejora y agrega nuevo contenido a todos los aspectos del Nether.",
    "Expande la dimensión añadiendo biomas, criaturas y renovando conceptos existentes para crear una experiencia inmersiva."
  ],
  "eternal-starlight": [
    "Introduce un extenso mundo de rol, repleto de nuevos biomas, criaturas únicas, jefes formidables y materiales raros.",
    "Se accede a esta dimensión a través de un portal activado por el Orbe de la Profecía. El jugador debe explorar y combatir para obtener objetos esenciales para progresar."
  ],
  "alexs-caves": [
    "Añade nuevos biomas de cuevas subterráneas masivas y raras, repletas de mecánicas y criaturas únicas.",
    "Para encontrar estos biomas, es necesario localizar mapas en cabañas subterráneas que guían la expedición.",
    "Cada cueva presenta iluminación, niebla y atmósfera propias que transforman el entorno."
  ],
  "pale-garden": [
    "Introduce el lúgubre bioma del Jardín Pálido y la misteriosa criatura Creaking al juego.",
    "Incluye nueva vegetación como el Roble pálido, junto con bloques decorativos de musgo y alfombras pálidas."
  ],
  "nether-trials": [
    "Genera mazmorras de prueba únicas en la dimensión del Nether.",
    "Estas fortalezas incluyen características desafiantes como bóvedas de recompensas, generadores de combate, la criatura Brisa y trampas con cargas de viento."
  ],
  "underwater-villages": [
    "Añade docenas de nuevas estructuras oceánicas para enriquecer la exploración submarina, repletas de detalles y recompensas ocultas."
  ],
  "wither-wrath": [
    "Presenta una versión renovada y mucho más agresiva del Wither, diseñada para suponer un verdadero desafío.",
    "Introduce patrones de ataque destructivos y aumenta notablemente su salud máxima, forzando una batalla dinámica y letal."
  ],
  "piglin-proliferation": [
    "Diversifica a los Piglins al otorgar características únicas a sus variantes originales y añadiendo nuevos tipos de guerreros.",
    "Busca establecer la identidad de esta especie como una civilización diversa y multifacética dentro del Nether."
  ],
  "primal": [
    "Mejora el entorno salvaje del juego para hacer la supervivencia más inmersiva y emocionante.",
    "Añade animales prehistóricos y primitivos que encajan con la estética original, incorporando mecánicas únicas."
  ],
  "spawn": [
    "Añade una enorme variedad de animales al juego, acompañados de bloques, mecánicas y biomas inéditos.",
    "Introduce criaturas de todos los tamaños que interactúan dinámicamente con el entorno natural."
  ],
  "create": [
    "Robustez en la automatización que permite construir fábricas, trenes y maquinaria compleja utilizando energía cinética.",
    "Añade componentes mecánicos para líneas de producción eficientes, enfocadas siempre en lo visual y mecánico."
  ],
  "create-aeronautics": [
    "Expansión tecnológica para construir cualquier vehículo imaginable, desde dirigibles hasta aviones y coches funcionales.",
    "Amplía las mecánicas rotacionales para introducir físicas realistas y aerodinámicas al ensamblar artilugios."
  ],
  "mrcrayfish-furniture": [
    "Incorpora cientos de muebles y elementos decorativos completamente interactivos para ambientar todo tipo de bases.",
    "Destaca un sistema eléctrico funcional, envío de correo entre jugadores y dispositivos informáticos con aplicaciones útiles."
  ],
  "supplementaries": [
    "Agrega multitud de herramientas funcionales de estilo clásico: tarros, letreros detallados, veletas, macetas y automatización.",
    "Se enfoca en enriquecer la interactividad del mundo con bloques estéticos pero sumamente útiles."
  ],
  "amendments": [
    "Realiza numerosos ajustes a los bloques originales del juego para brindarles más funcionalidades e inmersión.",
    "Permite la mezcla de pociones en calderos, colocación de linternas en muros, apilado de calaveras y adición de detalles decorativos."
  ],
  "starcatcher": [
    "Renueva el sistema de pesca con más de 100 peces únicos, poseedores de diferentes tamaños, pesos y requisitos de clima.",
    "Añade cebos, cajas de aparejos, torneos, acuarios y divertidos minijuegos de captura para pescar."
  ],
  "lootr": [
    "Transforma la obtención de botín generando recompensas de forma individual en cada contenedor para cada jugador.",
    "Elimina la competencia desleal; todo explorador podrá abrir los cofres de las mazmorras y obtener su parte."
  ],
  "alternative-rain": [
    "Sustituye los sonidos ambientales de lluvia y truenos por efectos mucho más realistas y envolventes."
  ],
  "farcr-recrafted": [
    "Ofrece una reinterpretación de las texturas originales. Busca dar al entorno visual un aspecto más sobrio, pulido y cohesionado."
  ],
  "burnt-fire": [
    "Modifica el comportamiento del fuego para que se propague de forma veloz y realista.",
    "Los incendios dejarán tras de sí bloques carbonizados y cenizas en lugar de hacer desaparecer instantáneamente la madera."
  ],
  "apotheosis": [
    "Expande considerablemente la progresión mágica introduciendo amuletos y reestructurando profundamente el sistema de encantamientos."
  ],
  "enhanced-celestials": [
    "Mejora el ambiente nocturno añadiendo eventos lunares dinámicos que alteran el comportamiento del entorno, como Lunas de Sangre letales."
  ],
  "end-remastered": [
    "Cambia por completo la forma de acceder a la dimensión final. Requiere encontrar diversos ojos ender únicos que están ocultos en mundos y mazmorras."
  ],
  "cataclysm": [
    "Introduce imponentes mazmorras, arenas de combate y estructuras masivas.",
    "Cada guarida presenta enfrentamientos contra temibles jefes épicos que sueltan armas, armaduras y equipo destructivo."
  ],
  "minecraft-comes-alive": [
    "Sustituye a los aldeanos comunes por humanos interactivos con distintas personalidades, aspectos y oficios.",
    "Permite charlar, comerciar, formar vínculos familiares y tener descendencia de ayuda en las tareas mundanas."
  ],
  "chest-cavity-beyond": [
    "Implementa un sistema de anatomía avanzado que permite operar y extraer órganos.",
    "Posibilita robar órganos a criaturas exóticas para implantarlos en el cuerpo y absorber así sus atributos naturales."
  ],
  "origins-classes": [
    "Incorpora una selección de clases de especialización como Arquero, Herrero, Clérigo o Explorador que otorgan ligeros beneficios pasivos."
  ],
  "origins": [
    "Permite seleccionar una raza única al crear un mundo, otorgando habilidades especiales, ventajas determinantes y vulnerabilidades marcadas."
  ],
  "no-mans-land": [
    "Perfecciona la generación de terreno, optimizando biomas existentes y añadiendo bosques antiguos sumamente inmersivos."
  ],
  "ghast-update": [
    "Expande el contenido relacionado con el Nether, añadiendo nuevas mecánicas a los clásicos espectros flotantes del juego."
  ],
  "dynamic-caveman": [
    "Hace que herramientas básicas como palos y piedras puedan usarse como armamento rústico, habilitando incluso los lanzamientos de guijarros."
  ],
  "dragon-mounts": [
    "Posibilita eclosionar huevos de dragón e invocar criaturas voladoras amaestrables que sirven tanto en el combate terrestre como aéreo."
  ],
  "wings-of-fire": [
    "Introduce la posibilidad de incubar huevos de fénix sagrados mediante fuego hasta conseguir el nacimiento de la mítica ave majestuosa."
  ],
  "tempad": [
    "Ofrece un dispositivo dimensional que registra puntos de interés en el espacio para abrir portales de teletransporte instantáneos entre ellos."
  ],
  "artifacts": [
    "Añade equipo mágico y tesoros ocultos esparcidos por campamentos subterráneos y baúles secretos, otorgando a su portador habilidades singulares."
  ],
  "easy-anvils": [
    "Mejora enormemente la experiencia al usar yunques, guardando objetos en su interior al salir del menú y ajustando inteligentemente los costos de nivel."
  ],
  "spice-of-life": [
    "Recompensa la variedad culinaria llevando un registro de las comidas probadas y sumando salud máxima permanentemente por degustar nuevos platos."
  ],
  "farmers-delight": [
    "Añade un sinfín de herramientas de labranza y estaciones de cocina para fomentar las recetas complejas y mejorar la preparación de banquetes."
  ]
};

data.sections.forEach(section => {
  section.mods.forEach(mod => {
    if (updates[mod.id]) {
      mod.paragraphs = updates[mod.id];
    }
  });
});

fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
