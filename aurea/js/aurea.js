/* ==========================================================================
   ÁUREA · Oráculo Sistémico de 22 Arcanos
   Orden Creativo · Fernando Matías Acri
   Archivo principal: configuración, datos, autenticación y experiencias.
   ========================================================================== */

/* ========================= CONFIGURACIÓN =========================
   Pegá acá las credenciales de tu proyecto Supabase.
   Usá SOLO la URL y la anon key. Nunca una SERVICE_ROLE KEY.
   ================================================================= */
const SUPABASE_URL = "https://ybuvfshlppmtkkgynijb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlidXZmc2hscHBtdGtrZ3luaWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzOTAyNDAsImV4cCI6MjEwNjk2NjI0MH0.4ZkgUIcVQurDLf7R9PIIwt15Gc5H1BXAAncHrBRmiS4";

/* URL de compra del Kit Completo (se muestra después del lanzamiento) */
const BUY_URL = "PEGAR_AQUI_URL_DE_COMPRA";

/* Lanzamiento oficial: martes 13 de octubre de 2026, 13:00 hs Argentina (UTC-3) */
const LAUNCH_DATE = "2026-10-13T13:00:00-03:00";
const LAUNCH_PRICE = "$49.900 ARS";

/* Recursos de la Biblioteca Áurea (URLs configurables) */
const AUREA_RESOURCES = {
  guide: "PEGAR_AQUI_URL_GUIA",
  printable: "PEGAR_AQUI_URL_KIT_IMPRIMIBLE",
  spreads: "PEGAR_AQUI_URL_GUIA_DE_TIRADAS",
  bonus: "PEGAR_AQUI_URL_MATERIAL_COMPLEMENTARIO",
};

const RESOURCE_META = [
  { key: "guide", icon: "📖", title: "Guía Áurea", text: "El recorrido completo por los 22 arcanos: concepto, mirada sistémica y ejercicio de integración.", cta: "Abrir" },
  { key: "printable", icon: "🖨", title: "Kit imprimible", text: "Mazo imprimible en alta calidad para trabajar en casa, en talleres o en sesiones.", cta: "Descargar" },
  { key: "spreads", icon: "✦", title: "Guía de tiradas", text: "Tres cartas, una carta, diario de linaje: cómo abrir una consulta con orden.", cta: "Abrir" },
  { key: "bonus", icon: "◇", title: "Material complementario", text: "Fichas, ejercicios y lecturas para acompañar tu práctica con Áurea.", cta: "Abrir" },
];

/* ========================= DATOS · 22 ARCANOS ========================= */
const CARDS = [
  {
    n: 0, roman: "0", name: "El Errante", keyword: "La Exclusión", symbol: "El que quedó fuera",
    tarot: "El Loco", stage: "I. La Raíz",
    description: "Representa a quien quedó fuera del sistema: el olvidado, el rechazado, el desaparecido, el secreto familiar o aquella persona cuya historia dejó de ser nombrada.\n\nPuede señalar una sensación de no pertenecer, de estar siempre «afuera» o de caminar sin encontrar un lugar propio. También puede invitarte a mirar aquello que tu familia dejó de nombrar: a veces no estamos repitiendo una historia conocida, estamos intentando dar lugar a una historia excluida.",
    question: "¿A quién o a qué historia estoy dejando afuera?",
    movement: "Colocá frente a vos un objeto que represente a esa persona, historia o parte de vos que sentís excluida. Miralo en silencio y decí: «Ahora te veo. Reconozco que pertenecés a nuestra historia. No necesito repetir tu destino para darte un lugar.» Después colocá el objeto dentro del espacio familiar simbólico.",
    healing: "Te doy un lugar en mi corazón y tomo mi propio lugar en la vida.",
  },
  {
    n: 1, roman: "I", name: "El Origen", keyword: "La Raíz", symbol: "La raíz que sostiene",
    tarot: "El Mago", stage: "I. La Raíz",
    description: "El comienzo del linaje. La raíz de la cual provenimos y todo aquello que recibimos antes de poder elegir.\n\nInvita a volver al origen. A recordar que antes de ser individuo fuimos parte de una historia. Puede aparecer cuando necesitás comprender de dónde vienen determinados valores, creencias o formas de vivir.",
    question: "¿Qué recibí de quienes estuvieron antes de mí?",
    movement: "Imaginá detrás tuyo a tus padres, detrás de ellos a tus abuelos y detrás a las generaciones anteriores. Respirá profundamente y decí: «De ustedes recibí la vida. Tomo aquello que puedo tomar. Lo demás lo dejo con ustedes.» Sentí tus pies apoyados en el suelo.",
    healing: "Tomo la vida que llegó hasta mí y la llevo hacia adelante.",
  },
  {
    n: 2, roman: "II", name: "La Guardiana", keyword: "El Secreto", symbol: "El umbral callado",
    tarot: "La Sacerdotisa", stage: "I. La Raíz",
    description: "Aquello que fue silenciado, protegido u ocultado: secretos, pérdidas, adopciones, historias no contadas y acontecimientos que quedaron fuera de la narrativa familiar.\n\nPuede señalar que existe algo que todavía no está listo para ser comprendido completamente. No siempre significa que debas descubrir un secreto: a veces significa reconocer simplemente que existe algo que no conocés.",
    question: "¿Qué necesita ser respetado aunque todavía no pueda ser revelado?",
    movement: "Colocá una mano sobre el corazón y otra sobre el abdomen. Imaginá una puerta frente a vos. Decí: «Respeto aquello que fue ocultado. No necesito saberlo todo para honrar mi historia. Tomo solamente aquello que hoy puedo comprender.»",
    healing: "Puedo vivir en paz incluso con aquello que todavía desconozco.",
  },
  {
    n: 3, roman: "III", name: "La Matriarca", keyword: "La Vida", symbol: "El seno que nutre",
    tarot: "La Emperatriz", stage: "I. La Raíz",
    description: "La fuerza femenina que transmite vida, cuidado, nutrición, memoria y continuidad.\n\nHabla de la relación con la madre y con las mujeres del linaje. Puede señalar la necesidad de recibir, cuidar, nutrir o permitirte vivir con mayor plenitud.",
    question: "¿Puedo recibir la vida sin tener que pagarla con sacrificio?",
    movement: "Sentate cómodamente. Imaginá a tu madre detrás de vos y a las mujeres de generaciones anteriores detrás de ella. Decí: «Mamá, recibo la vida de vos. Honro a las mujeres que estuvieron antes. Ahora me permito hacer algo propio con esta vida.»",
    healing: "Recibo la vida y me permito disfrutarla.",
  },
  {
    n: 4, roman: "IV", name: "El Patriarca", keyword: "La Autoridad", symbol: "La piedra angular",
    tarot: "El Emperador", stage: "I. La Raíz",
    description: "El masculino ancestral: estructura, protección, autoridad, límites, dirección y también las rigideces heredadas.\n\nInvita a revisar cómo te relacionás con autoridad, límites, responsabilidad y poder. Puede señalar una autoridad externa que todavía llevás dentro.",
    question: "¿Qué autoridad heredé y cuál quiero construir?",
    movement: "Parate firmemente con ambos pies apoyados. Imaginá detrás tuyo a los hombres de tu linaje. Decí: «Honro la fuerza que recibí. Tomo la protección y la estructura que me sirven. Ya no necesito continuar aquello que me limita.»",
    healing: "Puedo ser fuerte sin repetir la dureza de quienes vinieron antes.",
  },
  {
    n: 5, roman: "V", name: "El Ancestro", keyword: "El Legado", symbol: "El cofre heredado",
    tarot: "El Hierofante", stage: "I. La Raíz",
    description: "Lo recibido de quienes estuvieron antes: valores, historias, talentos, recursos, heridas, conocimientos y posibilidades.\n\nInvita a preguntarte qué heredaste además de las dificultades. El linaje no transmite solamente cargas: también transmite recursos.",
    question: "¿Qué tesoro de mi historia todavía no estoy reconociendo?",
    movement: "Tomá un objeto que represente algo valioso recibido de tu familia. Sostenelo entre tus manos y decí: «Reconozco lo valioso que llegó hasta mí. Lo recibo con gratitud. Lo transformaré en algo nuevo.»",
    healing: "Honro mi legado y lo convierto en creación.",
  },
  {
    n: 6, roman: "VI", name: "Los Amantes", keyword: "El Vínculo", symbol: "El nudo del vínculo",
    tarot: "Los Amantes", stage: "II. El Vínculo",
    description: "El vínculo de pareja y la capacidad de elegir desde el amor consciente sin repetir destinos familiares.\n\nHabla de vínculos, elección, deseo y lealtades invisibles. Puede aparecer para preguntar si estás eligiendo desde el presente o desde una historia antigua.",
    question: "¿Estoy eligiendo a esta persona o estoy intentando reparar una historia anterior?",
    movement: "Imaginá a tu pareja frente a vos y, detrás de cada uno, a sus respectivos sistemas familiares. Decí: «Tu historia es tuya. Mi historia es mía. Podemos encontrarnos sin cargar con aquello que pertenece a nuestros antepasados.»",
    healing: "Te elijo desde quien soy hoy, no desde lo que mi historia necesita reparar.",
  },
  {
    n: 7, roman: "VII", name: "El Heredero", keyword: "La Continuidad", symbol: "La rama que continúa",
    tarot: "El Carro", stage: "II. El Vínculo",
    description: "La generación que recibe algo del sistema y debe decidir qué continúa y qué transforma.\n\nEs una carta de movimiento y decisión. Te pregunta qué estás llevando hacia el futuro y qué necesitás dejar atrás.",
    question: "¿Qué quiero continuar y qué elijo transformar?",
    movement: "Imaginá una línea detrás tuyo que representa a tus generaciones anteriores y otra delante que representa a las generaciones futuras. Tomá simbólicamente una pequeña rama. Elegí conscientemente qué querés llevar hacia adelante.",
    healing: "Honro lo que recibí y elijo conscientemente qué continúa a través de mí.",
  },
  {
    n: 8, roman: "VIII", name: "El Orden", keyword: "La Justicia", symbol: "La balanza del linaje",
    tarot: "La Justicia", stage: "II. El Vínculo",
    description: "Cada persona ocupa un lugar. Representa equilibrio, jerarquía, reconocimiento y pertenencia.\n\nInvita a observar dónde existe desorden: alguien ocupando un lugar que no corresponde, alguien olvidado o responsabilidades asumidas por otra generación.",
    question: "¿Estoy ocupando mi lugar o estoy viviendo una vida que pertenece a alguien más?",
    movement: "Colocá tres objetos representando Ancestros — Padres — Yo. Ubicalos en ese orden. Observá la distancia entre ellos y decí: «Ustedes son los grandes. Yo soy el pequeño. Tomo mi lugar y dejo con ustedes aquello que les pertenece.»",
    healing: "Cuando cada uno ocupa su lugar, yo puedo ocupar el mío.",
  },
  {
    n: 9, roman: "IX", name: "El Buscador", keyword: "La Ausencia", symbol: "La ausencia iluminada",
    tarot: "El Ermitaño", stage: "II. El Vínculo",
    description: "La ausencia de alguien importante: un padre que no estuvo, un hijo perdido, un familiar desaparecido o un vacío dentro del árbol.\n\nPuede señalar un vacío que sigue teniendo presencia. La ausencia también pertenece al sistema.",
    question: "¿Qué ausencia sigue ocupando un lugar en mi vida?",
    movement: "Colocá una silla vacía frente a vos. Imaginá allí a quien estuvo ausente. Decí: «Reconozco tu ausencia. Sé que formás parte de mi historia. No necesito llenar tu lugar. Yo tomo el mío.»",
    healing: "Puedo honrar tu ausencia sin convertirla en mi destino.",
  },
  {
    n: 10, roman: "X", name: "La Repetición", keyword: "Los Patrones", symbol: "La rueda de los retratos",
    tarot: "La Rueda de la Fortuna", stage: "III. El Patrón",
    description: "Patrones que se repiten generación tras generación: vínculos, pérdidas, conflictos, comportamientos, nombres, destinos o formas de vivir.\n\nEs una invitación a detener el piloto automático. La repetición puede convertirse en conciencia cuando logramos verla.",
    question: "¿Qué historia parece repetirse a través de mí?",
    movement: "Escribí una situación que se haya repetido. Debajo escribí «Antes ocurrió…» y luego «Conmigo puede ser diferente porque…». Cerrá el ejercicio dando un paso físico hacia adelante.",
    healing: "Puedo reconocer la repetición sin tener que continuarla.",
  },
  {
    n: 11, roman: "XI", name: "La Fuerza", keyword: "La Resiliencia", symbol: "El león amansado",
    tarot: "La Fuerza", stage: "III. El Patrón",
    description: "La capacidad de sobrevivir, resistir y transformar aquello que fue recibido.\n\nRecuerda que tu historia contiene dificultades, pero también capacidad de respuesta. No se trata de romantizar el sufrimiento, sino de reconocer que sobrevivir no tiene por qué convertirse en la única forma de vivir.",
    question: "¿Qué fuerza desarrollé para sobrevivir y cómo puedo usarla ahora para vivir?",
    movement: "Apoyá ambas manos sobre el pecho. Respirá profundamente y decí: «Reconozco todo lo que tuve que atravesar. Agradezco la fuerza que desarrollé. Ahora puedo utilizarla para crear, no solamente para resistir.»",
    healing: "Ya no necesito sobrevivir aquello que hoy puedo transformar.",
  },
  {
    n: 12, roman: "XII", name: "El Sacrificio", keyword: "La Lealtad Invisible", symbol: "El nudo invisible",
    tarot: "El Colgado", stage: "III. El Patrón",
    description: "El sacrificio inconsciente, la identificación con alguien del sistema y la sensación de quedar suspendido en una historia que no comenzó con uno mismo.\n\nPuede mostrar una vida detenida por una lealtad invisible.",
    question: "¿Por quién estoy sacrificando mi propia vida?",
    movement: "Parate con los brazos relajados. Imaginá detrás tuyo a la persona con cuyo destino sentís una identificación. Decí: «Te veo. Honro lo que viviste. Pero tu destino no necesita continuar a través de mí.» Después soltá físicamente las manos.",
    healing: "Puedo amarte sin repetir tu sufrimiento.",
  },
  {
    n: 13, roman: "XIII", name: "El Cambio", keyword: "La Transformación", symbol: "La semilla que rompe",
    tarot: "La Muerte", stage: "IV. La Transformación",
    description: "El cierre de un ciclo y la posibilidad de dejar morir una forma antigua de pertenecer.\n\nNo habla de muerte literal. Habla de aquello que terminó y necesita dejar de ser sostenido para permitir el nacimiento de algo nuevo.",
    question: "¿Qué forma antigua de mí necesita terminar?",
    movement: "Escribí una frase que represente aquello que querés dejar atrás. Rompé el papel. Mientras lo hacés, decí: «Honro lo que fue. Agradezco lo aprendido. Permito que esta etapa termine.»",
    healing: "Dejo morir lo que ya cumplió su propósito y doy lugar a lo nuevo.",
  },
  {
    n: 14, roman: "XIV", name: "La Alquimia", keyword: "La Reconciliación", symbol: "Los opuestos que se encuentran",
    tarot: "La Templanza", stage: "IV. La Transformación",
    description: "La integración de opuestos: masculino y femenino, pasado y presente, dolor y amor, pertenencia y libertad.\n\nInvita a dejar de pelear internamente con partes de tu historia. No significa aprobar aquello que ocurrió; significa poder integrarlo sin quedar definido por ello.",
    question: "¿Qué partes de mi historia estoy intentando mantener separadas?",
    movement: "Colocá dos objetos frente a vos: uno representa aquello que querés integrar y el otro aquello que rechazás. Acercalos lentamente hasta colocarlos juntos. Decí: «Reconozco ambas partes. No necesito elegir una y negar la otra. Integro lo aprendido y continúo mi camino.»",
    healing: "Integro mi historia sin quedar atrapado en ella.",
  },
  {
    n: 15, roman: "XV", name: "La Sombra", keyword: "Lo Oculto", symbol: "El rostro no mirado",
    tarot: "El Diablo", stage: "IV. La Transformación",
    description: "Aquello que el sistema no quiso mirar: secretos, culpas, exclusiones, traumas y aspectos negados.\n\nLa sombra no es necesariamente algo malo. Es aquello que todavía no ha sido integrado a la conciencia.",
    question: "¿Qué parte de mí o de mi historia estoy intentando no mirar?",
    movement: "Parate frente a un espejo. Observá tu rostro durante unos segundos. Decí: «También esto forma parte de mí. No necesito juzgarlo para poder mirarlo. Puedo elegir qué hacer con aquello que encuentro.»",
    healing: "Lo que puedo mirar con conciencia deja de gobernarme desde la oscuridad.",
  },
  {
    n: 16, roman: "XVI", name: "La Torre", keyword: "La Ruptura", symbol: "El rayo que parte la torre",
    tarot: "La Torre", stage: "IV. La Transformación",
    description: "El acontecimiento que rompe el equilibrio del sistema: separación, migración, guerra, pérdida, exilio, crisis o verdad revelada.\n\nRepresenta esos momentos en los que la estructura conocida ya no puede sostenerse. A veces anuncia la caída de una estructura que ya estaba rota.",
    question: "¿Qué estructura de mi vida ya no puede continuar como antes?",
    movement: "Construí una pequeña torre con objetos. Quitá uno por uno los elementos que representan viejas estructuras. Cuando la torre caiga, observá qué queda y preguntate: «¿Qué permanece cuando lo conocido deja de sostenerme?»",
    healing: "Cuando una estructura cae, puedo construir desde un lugar más verdadero.",
  },
  {
    n: 17, roman: "XVII", name: "La Estrella", keyword: "La Esperanza", symbol: "La semilla bajo el cielo",
    tarot: "La Estrella", stage: "V. La Conciencia",
    description: "La posibilidad de que una nueva generación transforme el destino sin negar de dónde viene.\n\nEs la carta de la esperanza consciente. No propone olvidar el pasado. Propone permitir que el futuro sea diferente.",
    question: "¿Qué nueva posibilidad quiero ofrecerle a mi historia?",
    movement: "Plantá una semilla real. Mientras la cubrís con tierra, imaginá detrás tuyo a las generaciones anteriores y delante tuyo a las generaciones futuras. Decí: «Recibo la vida de quienes estuvieron antes. Yo agrego algo nuevo. Que lo que nazca desde mí pueda tener más libertad.»",
    healing: "Mi historia me precede, pero no determina todo lo que puedo crear.",
  },
  {
    n: 18, roman: "XVIII", name: "La Luna", keyword: "La Memoria Inconsciente", symbol: "El agua que refleja",
    tarot: "La Luna", stage: "V. La Conciencia",
    description: "Los contenidos emocionales heredados que viven debajo de la conciencia: miedos, sueños, recuerdos y patrones invisibles.\n\nInvita a mirar aquello que todavía no puede explicarse racionalmente. No todo lo que sentimos comenzó en el presente, pero sentir algo no demuestra por sí mismo su origen ancestral.",
    question: "¿Qué emoción aparece en mí y qué necesita ser escuchado?",
    movement: "Sentate frente a un recipiente con agua. Observá su superficie. Sin buscar explicaciones, preguntate: «¿Qué siento ahora?». Nombrá la emoción sin intentar justificarla.",
    healing: "Escucho lo profundo de mí sin convertir cada emoción en una sentencia.",
  },
  {
    n: 19, roman: "XIX", name: "El Sol", keyword: "La Vida Plena", symbol: "El mediodía de la vida",
    tarot: "El Sol", stage: "V. La Conciencia",
    description: "Vitalidad, alegría, presencia y permiso para vivir plenamente más allá de las cargas heredadas.\n\nEs una de las cartas más luminosas del mazo. Habla de recuperar el derecho a disfrutar, crear, amar, expresarte y ocupar espacio.",
    question: "¿Dónde necesito permitirme vivir más plenamente?",
    movement: "Parate frente a una ventana o bajo la luz del sol. Abrí los brazos. Imaginá que detrás tuyo están quienes te dieron la vida. Decí: «Gracias por la vida. La recibo. Y ahora me permito vivirla.»",
    healing: "Honro a quienes vinieron antes viviendo plenamente mi propia vida.",
  },
  {
    n: 20, roman: "XX", name: "El Llamado", keyword: "La Conciencia", symbol: "La trompeta del despertar",
    tarot: "El Juicio", stage: "VI. El Despertar",
    description: "El momento en que una persona comprende que está repitiendo algo del sistema y decide mirar su historia de otra manera.\n\nEs el despertar. Algo que antes parecía inevitable comienza a ser visto como una posibilidad de elección.",
    question: "¿Qué estoy viendo ahora que antes no podía ver?",
    movement: "Imaginá detrás tuyo a todo tu linaje. Luego mirá hacia adelante. Decí: «Ahora puedo verlo. Gracias por haber llegado hasta mí. A partir de este momento puedo elegir de otra manera.» Da un paso hacia adelante.",
    healing: "Cuando puedo ver mi historia, puedo comenzar a elegir mi respuesta.",
  },
  {
    n: 21, roman: "XXI", name: "El Mundo", keyword: "La Integración", symbol: "El círculo que se cierra",
    tarot: "El Mundo", stage: "VI. El Despertar",
    description: "El cierre del recorrido: reconocer el sistema, tomar la vida recibida y ocupar el propio lugar.\n\nRepresenta integración, pertenencia y culminación. No significa que todo esté resuelto. Significa que ya no necesitás negar ninguna parte de tu recorrido para seguir avanzar.",
    question: "¿Qué puedo integrar para sentirme completo y avanzar?",
    movement: "Parate en el centro de un círculo. Imaginá detrás tuyo a tus ancestros y delante de vos tu futuro. Abrí los brazos y decí: «Honro lo que fue. Recibo la vida. Reconozco mi lugar. Y ahora camino hacia mi propia vida.»",
    healing: "Tomo la vida que recibí, honro mi historia y avanzo hacia mi propio destino.",
  },
];

const CARD_IMAGES = {
  0: "assets/cards/00-el-errante.webp",
  1: "assets/cards/01-el-origen.webp",
  2: "assets/cards/02-la-guardiana.webp",
  3: "assets/cards/03-la-matriarca.webp",
  4: "assets/cards/04-el-patriarca.webp",
  5: "assets/cards/05-el-ancestro.webp",
  6: "assets/cards/06-los-amantes.webp",
  7: "assets/cards/07-el-heredero.webp",
  8: "assets/cards/08-el-orden.webp",
  9: "assets/cards/09-el-buscador.webp",
  10: "assets/cards/10-la-repeticion.webp",
  11: "assets/cards/11-la-fuerza.webp",
  12: "assets/cards/12-el-sacrificio.webp",
  13: "assets/cards/13-el-cambio.webp",
  14: "assets/cards/14-la-alquimia.webp",
  15: "assets/cards/15-la-sombra.webp",
  16: "assets/cards/16-la-torre.webp",
  17: "assets/cards/17-la-estrella.webp",
  18: "assets/cards/18-la-luna.webp",
  19: "assets/cards/19-el-sol.webp",
  20: "assets/cards/20-el-llamado.webp",
  21: "assets/cards/21-el-mundo.webp",
};

const POSITIONS = [
  { key: "origen", label: "El origen / La raíz" },
  { key: "presente", label: "Lo presente / La tensión" },
  { key: "movimiento", label: "El movimiento / La integración" },
];

/* ========================= UTILIDADES ========================= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const pad2 = (n) => String(n).padStart(2, "0");

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cardByNumber(n) {
  return CARDS.find((c) => c.n === Number(n));
}

/** Devuelve la imagen real del arcano; null si todavía no existe. */
function getCardImage(number) {
  const path = CARD_IMAGES[Number(number)];
  return path || null;
}

function setMsg(el, text, kind) {
  if (!el) return;
  el.textContent = text || "";
  el.classList.remove("is-ok", "is-error", "is-info");
  if (kind) el.classList.add("is-" + kind);
}

let toastTimer = null;
function toast(text) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = text;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 4200);
}

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    }).format(new Date(iso));
  } catch (e) {
    return new Date(iso).toLocaleString();
  }
}

function isConfiguredUrl(url) {
  return typeof url === "string" && url.trim() !== "" && !/PEGAR_AQUI/i.test(url);
}

const SUPABASE_READY =
  /^https:\/\/.+/i.test(SUPABASE_URL || "") &&
  typeof SUPABASE_ANON_KEY === "string" &&
  SUPABASE_ANON_KEY.length > 40 &&
  !/PEGAR_AQUI/i.test(SUPABASE_ANON_KEY);

/* ========================= SONIDO ARMÓNICO ========================= */
const Sound = {
  ctx: null,
  on: false,
  init() {
    try { this.on = localStorage.getItem("aurea:sonido") === "1"; } catch (e) { this.on = false; }
    const btn = $("#btn-sound");
    if (btn) {
      btn.classList.toggle("is-on", this.on);
      btn.setAttribute("aria-pressed", String(this.on));
      const glyph = $("#sound-glyph");
      if (glyph) glyph.textContent = this.on ? "♫" : "♪";
      btn.addEventListener("click", () => this.toggle());
    }
  },
  toggle() {
    this.on = !this.on;
    try { localStorage.setItem("aurea:sonido", this.on ? "1" : "0"); } catch (e) { /* preferencia visual */ }
    const btn = $("#btn-sound");
    if (btn) {
      btn.classList.toggle("is-on", this.on);
      btn.setAttribute("aria-pressed", String(this.on));
    }
    const glyph = $("#sound-glyph");
    if (glyph) glyph.textContent = this.on ? "♫" : "♪";
    if (this.on) { this.ensure(); this.play([196.0, 293.66, 440.0], 2.2, 0.05); }
  },
  ensure() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      this.ctx = new Ctx();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  },
  play(freqs, duration = 1.6, volume = 0.06) {
    if (!this.on) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = freq;
      const start = now + i * 0.06;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration + 0.1);
    });
  },
  flip() { this.play([392.0, 587.33], 1.4, 0.05); },
  reveal() { this.play([261.63, 392.0, 523.25], 2.4, 0.045); },
};

/* ========================= FONDO ESTRELLADO ========================= */
function initStarfield() {
  const canvas = $("#starfield");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let stars = [];
  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  const palette = ["255,247,230", "217,178,100", "186,170,255", "255,255,255"];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(220, Math.round((width * height) / 9000));
    stars = new Array(count).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random() * 0.6 + 0.2,
      tw: Math.random() * 0.02 + 0.004,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05,
      c: palette[Math.floor(Math.random() * palette.length)],
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const s of stars) {
      s.a += s.tw;
      const alpha = 0.28 + Math.abs(Math.sin(s.a)) * 0.6;
      if (!reduce) {
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0) s.x = width; if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height; if (s.y > height) s.y = 0;
      }
      ctx.beginPath();
      ctx.fillStyle = "rgba(" + s.c + "," + alpha.toFixed(3) + ")";
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!reduce) requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", () => { dpr = Math.min(window.devicePixelRatio || 1, 2); resize(); if (reduce) draw(); });
}

/* ========================= APARICIÓN PROGRESIVA ========================= */
function initReveal() {
  const items = $$(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
  items.forEach((el) => io.observe(el));
}

/* ========================= ESTADO ========================= */
const state = {
  user: null,
  profile: null,
  daily: null,
  spread: null,
  pendingReset: false,
};

let sbClient = null;

function initSupabase() {
  if (!SUPABASE_READY) {
    const banner = $("#config-banner");
    if (banner) banner.hidden = false;
    return;
  }
  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    const banner = $("#config-banner");
    if (banner) {
      banner.hidden = false;
      banner.innerHTML = "<strong>CONFIGURACIÓN:</strong> No se pudo cargar la librería de Supabase. Verificá tu conexión a internet y recargá la página.";
    }
    return;
  }
  sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

function requireConfig(target) {
  if (SUPABASE_READY && sbClient) return true;
  toast("Supabase todavía no está configurado.");
  if (target) setMsg(target, "Supabase todavía no está configurado.", "error");
  return false;
}

/* ========================= MODAL ========================= */
let lastFocused = null;

function openModal(html) {
  const modal = $("#modal");
  if (!modal) return;
  lastFocused = document.activeElement;
  $("#modal-body").innerHTML = html;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  bindCardImages($("#modal-body"));
  const closeBtn = $(".modal-close", modal);
  if (closeBtn) closeBtn.focus();
}

function closeModal() {
  const modal = $("#modal");
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  $("#modal-body").innerHTML = "";
  document.body.style.overflow = "";
  if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
}

function bindCardImages(root = document) {
  $$("img.card-art", root).forEach((img) => {
    if (img.dataset.bound === "1") return;
    img.dataset.bound = "1";
    img.addEventListener("error", () => {
      const holder = img.closest(".face-front-inner, .card-media, .modal-card") || img.parentElement;
      const card = cardByNumber(img.dataset.card);
      if (!holder || !card) { img.style.visibility = "hidden"; return; }
      holder.innerHTML =
        '<div class="card-fallback">' +
        '<span class="fb-num">' + escapeHtml(card.roman) + "</span>" +
        '<span class="fb-name">' + escapeHtml(card.name) + "</span>" +
        '<span class="fb-symbol">' + escapeHtml(card.symbol) + "</span>" +
        "</div>";
    });
  });
}

function arcanoModalHTML(card) {
  return (
    '<div class="modal-hero">' +
      '<div class="modal-card">' +
        (getCardImage(card.n)
          ? '<img class="card-art" data-card="' + card.n + '" src="' + getCardImage(card.n) + '" alt="' + escapeHtml(card.name) + '">'
          : '<div class="card-fallback"><span class="fb-num">' + escapeHtml(card.roman) + '</span><span class="fb-name">' + escapeHtml(card.name) + "</span></div>") +
      "</div>" +
      "<div>" +
        '<p class="modal-label" id="modal-title">Arcano ' + escapeHtml(card.roman) + "</p>" +
        '<h3 class="modal-title">' + escapeHtml(card.name) + "</h3>" +
        '<p class="modal-keyword">' + escapeHtml(card.keyword) + "</p>" +
        '<div class="modal-block"><h4>Símbolo</h4><p>' + escapeHtml(card.symbol) + "</p></div>" +
        '<div class="modal-block"><h4>Descripción</h4><p>' + escapeHtml(card.description) + "</p></div>" +
        '<div class="modal-block"><h4>Movimiento sistémico</h4><p>' + escapeHtml(card.movement) + "</p></div>" +
        '<div class="modal-block"><h4>Pregunta de integración</h4><p>' + escapeHtml(card.question) + "</p></div>" +
        '<p class="modal-quote">' + escapeHtml(card.healing) + "</p>" +
        '<div class="modal-tags">' +
          '<span class="modal-tag">Arcano de referencia: ' + escapeHtml(card.tarot) + "</span>" +
          '<span class="modal-tag">' + escapeHtml(card.stage) + "</span>" +
          '<span class="modal-tag">Mirar · Mover · Elegir</span>' +
        "</div>" +
      "</div>" +
    "</div>"
  );
}

function openArcano(n) {
  const card = cardByNumber(n);
  if (!card) return;
  Sound.flip();
  openModal(arcanoModalHTML(card));
}

/* ========================= RUTAS ========================= */
const AUTH_ROUTES = {
  "#/registro": "registro",
  "#/ingreso": "ingreso",
  "#/recuperar": "recuperar",
  "#/activar": "activar",
};

const PANELS = ["carta", "tirada", "arcanos", "biblioteca", "lecturas", "sobre"];

function showView(name) {
  $$(".view").forEach((v) => { v.hidden = v.dataset.view !== name; });
  const isLanding = name === "landing";
  const publicNav = $("#public-nav");
  if (publicNav) publicNav.style.display = isLanding ? "" : "none";
  const loginBtn = $("#btn-login");
  const logoutBtn = $("#btn-logout");
  if (loginBtn) loginBtn.hidden = !!state.user || !isLanding;
  if (logoutBtn) logoutBtn.hidden = !state.user;
}

function showAuthForm(key) {
  $$(".auth-tab").forEach((t) => t.classList.toggle("is-active", t.dataset.auth === key));
  $$("[data-auth-form]").forEach((f) => { f.hidden = f.dataset.authForm !== key; });
  if (key === "recuperar" && state.pendingReset) $("#reset-block").hidden = false;
}

function showPanel(key) {
  const panel = PANELS.includes(key) ? key : "carta";
  $$(".menu-chip").forEach((c) => c.classList.toggle("is-active", c.dataset.panel === panel));
  $$("[data-panel-view]").forEach((p) => { p.hidden = p.dataset.panelView !== panel; });
  if (panel === "lecturas") loadReadings();
  if (panel === "biblioteca") renderLibrary();
  if (panel === "arcanos") renderArcans();
}

function go(hash) {
  if (location.hash === hash) renderRoute();
  else location.hash = hash;
}

function canEnterApp() {
  return !!(sbClient && state.user && state.profile && state.profile.has_access);
}

function renderRoute() {
  const raw = location.hash || "";

  if (raw && raw.startsWith("#/") === false) {
    showView("landing");
    const el = document.getElementById(raw.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const path = raw || "#/";

  if (path.startsWith("#/app")) {
    if (!sbClient) { go("#/ingreso"); return; }
    if (!state.user) { go("#/ingreso"); return; }
    if (!state.profile || !state.profile.has_access) { go("#/activar"); return; }
    const panel = path.split("/")[2] || "carta";
    showView("app");
    showPanel(panel);
    window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }

  if (AUTH_ROUTES[path]) {
    showView("auth");
    showAuthForm(AUTH_ROUTES[path]);
    window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }

  showView("landing");
  if (path === "#/") window.scrollTo({ top: 0, behavior: "auto" });
}

/* ========================= AUTENTICACIÓN ========================= */
function mapAuthError(error) {
  const msg = (error && error.message) || "";
  const low = msg.toLowerCase();
  if (low.includes("invalid login")) return "Email o contraseña incorrectos.";
  if (low.includes("already registered")) return "Ya existe una cuenta con ese email.";
  if (low.includes("at least 6")) return "La contraseña debe tener al menos 8 caracteres.";
  if (low.includes("email not confirmed")) return "Revisá tu correo para confirmar tu cuenta.";
  if (low.includes("invalid format") || low.includes("invalid email")) return "El email no es válido.";
  if (low.includes("password")) return "La contraseña no cumple los requisitos.";
  if (low.includes("rate limit") || low.includes("too many")) return "Demasiados intentos. Esperá unos minutos y volvé a intentar.";
  if (low.includes("failed to fetch") || low.includes("network")) return "No se pudo conectar con el servidor. Verificá tu conexión.";
  return msg || "No se pudo completar la operación.";
}

async function loadProfile() {
  if (!sbClient || !state.user) { state.profile = null; return null; }
  const { data, error } = await sbClient
    .from("profiles")
    .select("id, full_name, email, phone, has_access, created_at")
    .eq("id", state.user.id)
    .maybeSingle();
  if (error) { state.profile = null; return null; }
  state.profile = data;
  updateGreeting();
  return data;
}

function updateGreeting() {
  const el = $("#app-greeting");
  if (!el) return;
  const name =
    (state.profile && state.profile.full_name) ||
    (state.user && state.user.user_metadata && state.user.user_metadata.full_name) ||
    (state.user && state.user.email) ||
    "";
  const first = String(name).trim().split(/\s+/)[0] || "";
  el.textContent = first ? "Bienvenido/a, " + first : "Bienvenido/a";
}

async function redeemCode(code, msgEl) {
  const { data, error } = await sbClient.rpc("redeem_activation_code", { p_code: code });
  if (error) {
    setMsg(msgEl, "No se pudo validar el código. Intentá nuevamente.", "error");
    return false;
  }
  const result = Array.isArray(data) ? data[0] : data;
  if (!result || !result.success) {
    setMsg(msgEl, (result && result.message) || "El código de activación no es válido.", "error");
    return false;
  }
  await loadProfile();
  setMsg(msgEl, result.message || "Acceso activado.", "ok");
  return true;
}

async function handleRegister(event) {
  event.preventDefault();
  const msgEl = $("#reg-msg");
  if (!requireConfig(msgEl)) return;

  const name = $("#reg-name").value.trim();
  const email = $("#reg-email").value.trim();
  const pass = $("#reg-pass").value;
  const pass2 = $("#reg-pass2").value;
  const code = $("#reg-code").value.trim();

  if (!name) return setMsg(msgEl, "Ingresá tu nombre completo.", "error");
  if (!email) return setMsg(msgEl, "Ingresá tu email.", "error");
  if (pass.length < 8) return setMsg(msgEl, "La contraseña debe tener al menos 8 caracteres.", "error");
  if (pass !== pass2) return setMsg(msgEl, "Las contraseñas no coinciden.", "error");
  if (!code) return setMsg(msgEl, "Ingresá tu código de activación.", "error");

  setMsg(msgEl, "Creando tu cuenta…", "info");
  const { data, error } = await sbClient.auth.signUp({
    email,
    password: pass,
    options: { data: { full_name: name } },
  });

  if (error) return setMsg(msgEl, mapAuthError(error), "error");

  if (!data.session) {
    setMsg(msgEl, "Cuenta creada. Revisá tu correo para confirmar tu cuenta.", "ok");
    $("#login-email").value = email;
    setTimeout(() => go("#/ingreso"), 1400);
    return;
  }

  state.user = data.user;
  await loadProfile();

  const ok = await redeemCode(code, msgEl);
  if (ok) {
    toast("Tu acceso a Áurea está activo.");
    go("#/app/carta");
  } else {
    setMsg(msgEl, (($("#reg-msg").textContent || "") + " Tu cuenta fue creada: usá el código desde «Activar acceso»."), "info");
    setTimeout(() => go("#/activar"), 2200);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const msgEl = $("#login-msg");
  if (!requireConfig(msgEl)) return;

  const email = $("#login-email").value.trim();
  const pass = $("#login-pass").value;
  if (!email || !pass) return setMsg(msgEl, "Ingresá email y contraseña.", "error");

  setMsg(msgEl, "Ingresando…", "info");
  const { data, error } = await sbClient.auth.signInWithPassword({ email, password: pass });
  if (error) return setMsg(msgEl, mapAuthError(error), "error");

  state.user = data.user;
  await loadProfile();

  if (state.profile && state.profile.has_access) {
    setMsg(msgEl, "", null);
    go("#/app/carta");
  } else {
    setMsg(msgEl, "Tu cuenta existe pero todavía no tiene acceso activado.", "info");
    go("#/activar");
  }
}

async function handleForgot(event) {
  event.preventDefault();
  const msgEl = $("#forgot-msg");
  if (!requireConfig(msgEl)) return;
  const email = $("#forgot-email").value.trim();
  if (!email) return setMsg(msgEl, "Ingresá tu email.", "error");

  const { error } = await sbClient.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + window.location.pathname + "#/recuperar",
  });
  if (error) return setMsg(msgEl, mapAuthError(error), "error");
  setMsg(msgEl, "Si el email existe, te enviamos un enlace para recuperar tu contraseña.", "ok");
}

async function handleReset() {
  const msgEl = $("#reset-msg");
  if (!requireConfig(msgEl)) return;
  const pass = $("#reset-pass").value;
  const pass2 = $("#reset-pass2").value;
  if (pass.length < 8) return setMsg(msgEl, "La contraseña debe tener al menos 8 caracteres.", "error");
  if (pass !== pass2) return setMsg(msgEl, "Las contraseñas no coinciden.", "error");

  const { error } = await sbClient.auth.updateUser({ password: pass });
  if (error) return setMsg(msgEl, mapAuthError(error), "error");
  setMsg(msgEl, "Contraseña actualizada.", "ok");
  state.pendingReset = false;
  await loadProfile();
  setTimeout(() => {
    if (state.profile && state.profile.has_access) go("#/app/carta");
    else go("#/ingreso");
  }, 1200);
}

async function handleActivate(event) {
  event.preventDefault();
  const msgEl = $("#act-msg");
  if (!requireConfig(msgEl)) return;
  if (!state.user) { go("#/ingreso"); return; }

  const code = $("#act-code").value.trim();
  if (!code) return setMsg(msgEl, "Ingresá tu código de activación.", "error");

  setMsg(msgEl, "Verificando tu código…", "info");
  const ok = await redeemCode(code, msgEl);
  if (ok) {
    toast("Acceso activado. Bienvenido/a a Áurea.");
    go("#/app/carta");
  }
}

async function handleLogout() {
  if (sbClient) {
    try { await sbClient.auth.signOut(); } catch (e) { /* sesión local limpiada igual */ }
  }
  state.user = null;
  state.profile = null;
  state.spread = null;
  toast("Sesión cerrada.");
  go("#/");
}

async function initAuth() {
  if (!sbClient) return;

  sbClient.auth.onAuthStateChange(async (event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      state.pendingReset = true;
      go("#/recuperar");
      const block = $("#reset-block");
      if (block) block.hidden = false;
      return;
    }
    if (event === "SIGNED_OUT") {
      state.user = null;
      state.profile = null;
      showView("landing");
      return;
    }
    state.user = session ? session.user : null;
    if (state.user) {
      await loadProfile();
      updateGreeting();
    }
    renderRoute();
  });

  try {
    const { data } = await sbClient.auth.getSession();
    state.user = data && data.session ? data.session.user : null;
    if (state.user) await loadProfile();
  } catch (e) { /* sin sesión */ }

  const hash = window.location.hash;
  if (hash === "#/recuperar") {
    const { data } = await sbClient.auth.getSession();
    if (data && data.session) {
      state.pendingReset = true;
      const block = $("#reset-block");
      if (block) block.hidden = false;
    }
  }
}

/* ========================= LANZAMIENTO / WAITLIST ========================= */
function initCountdown() {
  const target = new Date(LAUNCH_DATE).getTime();
  const pre = $("#launch-pre");
  const post = $("#launch-post");
  const buy = $("#btn-buy");

  if (buy) {
    if (isConfiguredUrl(BUY_URL)) {
      buy.href = BUY_URL;
    } else {
      buy.href = "#";
      buy.addEventListener("click", (e) => {
        e.preventDefault();
        toast("Falta configurar la URL de compra en js/aurea.js (BUY_URL).");
      });
    }
  }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      if (pre) pre.hidden = true;
      if (post) post.hidden = false;
      const price = $(".launch-price");
      if (price) price.innerHTML = escapeHtml(LAUNCH_PRICE).replace("ARS", "<span>ARS</span>");
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    const set = (id, v) => { const el = $(id); if (el) el.textContent = pad2(v); };
    set("#cd-days", days);
    set("#cd-hours", hours);
    set("#cd-mins", mins);
    set("#cd-secs", secs);
    setTimeout(tick, 1000);
  }
  tick();
}

async function handleWaitlist(event) {
  event.preventDefault();
  const msgEl = $("#wl-msg");
  const name = $("#wl-name").value.trim();
  const email = $("#wl-email").value.trim();
  const phone = $("#wl-phone").value.trim();

  if (!name) return setMsg(msgEl, "Ingresá tu nombre completo.", "error");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setMsg(msgEl, "Ingresá un email válido.", "error");

  if (!SUPABASE_READY || !sbClient) {
    return setMsg(msgEl, "Supabase todavía no está configurado: tu dato no se pudo guardar todavía.", "error");
  }

  const { error } = await sbClient
    .from("waitlist")
    .insert({ full_name: name, email: email, phone: phone || null, source: "landing-aurea" });

  if (error) return setMsg(msgEl, "No se pudo guardar tu datos. Verificá tu conexión e intentá de nuevo.", "error");

  setMsg(msgEl, "Ya estás en la lista de espera. Te avisaremos el día del lanzamiento.", "ok");
  $("#wl-form").reset();
  Sound.reveal();
}

/* ========================= CARTA DEL DÍA ========================= */
function dailyIndexFor(date) {
  const key =
    date.getFullYear() + "-" + pad2(date.getMonth() + 1) + "-" + pad2(date.getDate());
  let hash = 2166136261;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % CARDS.length;
}

function cardFaceHTML(card, altPrefix) {
  const img = getCardImage(card.n);
  if (!img) {
    return (
      '<div class="card-fallback">' +
      '<span class="fb-num">' + escapeHtml(card.roman) + "</span>" +
      '<span class="fb-name">' + escapeHtml(card.name) + "</span>" +
      '<span class="fb-symbol">' + escapeHtml(card.symbol) + "</span>" +
      "</div>"
    );
  }
  return (
    '<img class="card-art" data-card="' + card.n + '" src="' + img + '" alt="' +
    escapeHtml((altPrefix || "") + " " + card.name) + '">'
  );
}

function initDailyCard() {
  const now = new Date();
  const card = CARDS[dailyIndexFor(now)];
  state.daily = card;

  const dateEl = $("#daily-date");
  if (dateEl) {
    try {
      dateEl.textContent = new Intl.DateTimeFormat("es-AR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      }).format(now);
    } catch (e) { dateEl.textContent = now.toLocaleDateString(); }
  }

  const front = $("#daily-front");
  if (front) front.innerHTML = cardFaceHTML(card, "Arcano del día:");

  const flip = $("#daily-flip");
  const inner = $("#daily-inner");
  if (inner && flip && !inner.dataset.bound) {
    inner.dataset.bound = "1";
    inner.addEventListener("click", () => {
      const revealed = flip.classList.toggle("is-flipped");
      const info = $("#daily-info");
      if (revealed) {
        fillDailyInfo(card);
        if (info) info.hidden = false;
        Sound.reveal();
        bindCardImages($("#daily-front"));
      }
    });
  }

  const deep = $("#btn-daily-deep");
  if (deep && !deep.dataset.bound) {
    deep.dataset.bound = "1";
    deep.addEventListener("click", () => openArcano(card.n));
  }
}

function fillDailyInfo(card) {
  const set = (id, text) => { const el = $(id); if (el) el.textContent = text; };
  set("#daily-label", "Arcano " + card.roman + " · " + card.stage);
  set("#daily-name", card.name);
  set("#daily-keyword", card.keyword);
  set("#daily-symbol", card.symbol);
  set("#daily-description", card.description);
  set("#daily-movement", card.movement);
  set("#daily-question", card.question);
}

/* ========================= TIRADA DE 3 CARTAS ========================= */
function pickThree() {
  const pool = CARDS.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 3);
}

function buildSynthesis(question, picked) {
  const [a, b, c] = picked;
  const lines = [];
  lines.push(
    "En el origen, " + a.name + " (" + a.keyword + ") sostiene la raíz de esta mirada: " + a.healing
  );
  lines.push(
    "En lo presente, " + b.name + " nombra lo que se está pidiendo atención: " + b.question
  );
  lines.push(
    "El movimiento llega con " + c.name + " —" + c.keyword + "— y propone un paso concreto: " + c.healing
  );
  const close = question
    ? "Sobre «" + question + "», Áurea no predice: ordena la mirada. Llevate la pregunta y observá qué se mueve en los próximos días."
    : "Áurea no predice: ordena la mirada. Llevate la pregunta y observá qué se mueve en los próximos días.";
  lines.push(close);
  return lines.join("\n\n");
}

function renderSpread(picked) {
  const stage = $("#spread-stage");
  if (!stage) return;
  stage.hidden = false;

  $$(".spread-slot", stage).forEach((slot, i) => {
    const card = picked[i];
    const position = POSITIONS[i];
    const flip = $(".flip", slot);
    const face = $("[data-slot-face]", slot);
    const info = $("[data-slot-info]", slot);

    flip.classList.remove("is-flipped");
    face.innerHTML =
      '<div class="face face-back"><img class="card-art" src="assets/cards/dorso.webp" alt="Reverso de la carta"><span class="face-hint">' +
      escapeHtml(position.label) +
      "</span></div>" +
      '<div class="face face-front">' + cardFaceHTML(card, position.label + ":") + "</div>";

    info.hidden = true;
    info.innerHTML =
      "<h4>" + escapeHtml(card.name) + "</h4>" +
      '<p class="si-keyword">' + escapeHtml(card.keyword) + " · " + escapeHtml(card.symbol) + "</p>" +
      "<dl>" +
        "<div><dt>Número</dt><dd>Arcano " + escapeHtml(card.roman) + "</dd></div>" +
        "<div><dt>Movimiento sistémico</dt><dd>" + escapeHtml(card.movement) + "</dd></div>" +
        "<div><dt>Pregunta de integración</dt><dd>" + escapeHtml(card.question) + "</dd></div>" +
      "</dl>";

    setTimeout(() => {
      flip.classList.add("is-flipped");
      Sound.flip();
      setTimeout(() => { info.hidden = false; }, 500);
    }, 300 + i * 750);
  });

  setTimeout(() => { bindCardImages(stage); }, 1800);
}

async function handleDraw(event) {
  event.preventDefault();
  const questionInput = $("#spread-question");
  const question = questionInput ? questionInput.value.trim() : "";
  const picked = pickThree();

  state.spread = { question: question, cards: picked };
  Sound.reveal();
  renderSpread(picked);

  const synthesis = $("#synthesis");
  const text = $("#synthesis-text");
  const status = $("#spread-status");
  if (status) setMsg(status, "", null);

  setTimeout(() => {
    if (synthesis) synthesis.hidden = false;
    if (text) text.textContent = buildSynthesis(question, picked);
    saveCurrentReading(status);
  }, 2400);
}

async function saveCurrentReading(statusEl) {
  const spread = state.spread;
  if (!spread) return;

  if (!SUPABASE_READY || !sbClient || !state.user) {
    setMsg(statusEl, "Conectá tu cuenta para guardar esta lectura en tu historial.", "info");
    return;
  }

  const payload = {
    user_id: state.user.id,
    question: spread.question || "—",
    cards: spread.cards.map((c, i) => ({
      position: POSITIONS[i].label,
      number: c.n,
      name: c.name,
      keyword: c.keyword,
      question: c.question,
    })),
  };

  const { error } = await sbClient.from("readings").insert(payload);
  if (error) setMsg(statusEl, "No se pudo guardar la lectura. Intentá nuevamente.", "error");
  else setMsg(statusEl, "Lectura guardada en tu historial.", "ok");
}

function resetSpread() {
  state.spread = null;
  const stage = $("#spread-stage");
  if (stage) { stage.hidden = true; stage.innerHTML = stageHTML; }
  const synthesis = $("#synthesis");
  if (synthesis) synthesis.hidden = true;
  const input = $("#spread-question");
  if (input) input.value = "";
  const status = $("#spread-status");
  if (status) setMsg(status, "", null);
}

const stageHTML = `
  <article class="spread-slot" data-position="0">
    <p class="slot-label"><span>1</span> El origen / La raíz</p>
    <div class="flip slot-flip"><div class="flip-inner" data-slot-face></div></div>
    <div class="slot-info" data-slot-info hidden></div>
  </article>
  <article class="spread-slot" data-position="1">
    <p class="slot-label"><span>2</span> Lo presente / La tensión</p>
    <div class="flip slot-flip"><div class="flip-inner" data-slot-face></div></div>
    <div class="slot-info" data-slot-info hidden></div>
  </article>
  <article class="spread-slot" data-position="2">
    <p class="slot-label"><span>3</span> El movimiento / La integración</p>
    <div class="flip slot-flip"><div class="flip-inner" data-slot-face></div></div>
    <div class="slot-info" data-slot-info hidden></div>
  </article>`;

/* ========================= MIS LECTURAS ========================= */
async function loadReadings() {
  const list = $("#readings-list");
  const empty = $("#readings-empty");
  if (!list) return;

  if (!SUPABASE_READY || !sbClient || !state.user) {
    list.innerHTML = "";
    if (empty) {
      empty.hidden = false;
      empty.textContent = "Supabase todavía no está configurado: tu historial no está disponible.";
    }
    return;
  }

  const { data, error } = await sbClient
    .from("readings")
    .select("id, question, cards, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    list.innerHTML = "";
    if (empty) { empty.hidden = false; empty.textContent = "No se pudo cargar tu historial."; }
    return;
  }

  const rows = data || [];
  if (!rows.length) {
    list.innerHTML = "";
    if (empty) {
      empty.hidden = false;
      empty.textContent = "Todavía no guardaste ninguna lectura. Hacé una tirada de tres cartas y va a aparecer acá.";
    }
    return;
  }
  if (empty) empty.hidden = true;

  list.innerHTML = rows
    .map((row) => {
      const cards = Array.isArray(row.cards) ? row.cards : [];
      const names = cards.map((c) => c.name).join(" · ");
      return (
        '<article class="reading-item" data-reading="' + escapeHtml(row.id) + '">' +
          '<div class="reading-main">' +
            '<p class="reading-date">' + escapeHtml(formatDate(row.created_at)) + "</p>" +
            '<p class="reading-question">' + escapeHtml(row.question || "Sin pregunta") + "</p>" +
            '<p class="reading-cards">' + escapeHtml(names) + "</p>" +
          "</div>" +
          '<div class="reading-actions">' +
            '<button class="btn btn-ghost" type="button" data-view-reading="' + escapeHtml(row.id) + '">Ver lectura</button>' +
            '<button class="btn btn-ghost btn-danger" type="button" data-delete-reading="' + escapeHtml(row.id) + '">Eliminar</button>' +
          "</div>" +
        "</article>"
      );
    })
    .join("");

  list.querySelectorAll("[data-view-reading]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = rows.find((r) => String(r.id) === btn.dataset.viewReading);
      if (row) openReadingModal(row);
    });
  });

  list.querySelectorAll("[data-delete-reading]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.deleteReading;
      const { error } = await sbClient.from("readings").delete().eq("id", id);
      if (error) { toast("No se pudo eliminar la lectura."); return; }
      toast("Lectura eliminada.");
      loadReadings();
    });
  });
}

function openReadingModal(row) {
  const cards = Array.isArray(row.cards) ? row.cards : [];
  const html =
    '<div class="modal-reading-head">' +
      '<p class="modal-label" id="modal-title">Lectura guardada</p>' +
      '<h3 class="modal-title">' + escapeHtml(row.question || "Sin pregunta") + "</h3>" +
      '<p class="modal-keyword">' + escapeHtml(formatDate(row.created_at)) + "</p>" +
    "</div>" +
    '<div class="modal-reading-cards">' +
      cards
        .map((c) => {
          const full = cardByNumber(c.number);
          return (
            '<article class="modal-reading-card">' +
              '<p class="mrc-position">' + escapeHtml(c.position || "") + "</p>" +
              "<h4>" + escapeHtml(c.name || "") + "</h4>" +
              '<p class="mrc-kw">' + escapeHtml(c.keyword || "") + "</p>" +
              "<p>" + escapeHtml(full ? full.question : c.question || "") + "</p>" +
            "</article>"
          );
        })
        .join("") +
    "</div>";
  openModal(html);
}

/* ========================= ARCANOS Y BIBLIOTECA ========================= */
function renderArcans() {
  const grid = $("#arcans-grid");
  if (!grid || grid.dataset.bound === "1") return;
  grid.dataset.bound = "1";

  grid.innerHTML = CARDS.map((card) => {
    const img = getCardImage(card.n);
    const media = img
      ? '<img class="card-art" data-card="' + card.n + '" src="' + img + '" alt="' + escapeHtml(card.name) + '" loading="lazy">'
      : '<div class="card-fallback"><span class="fb-num">' + escapeHtml(card.roman) + '</span><span class="fb-name">' + escapeHtml(card.name) + "</span></div>";
    return (
      '<button class="arcano-card" type="button" data-arcano="' + card.n + '">' +
        '<span class="card-media">' + media + "</span>" +
        '<span class="card-caption">' +
          '<span class="cc-num">Arcano ' + escapeHtml(card.roman) + "</span>" +
          '<span class="cc-name">' + escapeHtml(card.name) + "</span>" +
          '<span class="cc-keyword">' + escapeHtml(card.keyword) + "</span>" +
        "</span>" +
      "</button>"
    );
  }).join("");

  grid.querySelectorAll("[data-arcano]").forEach((btn) => {
    btn.addEventListener("click", () => openArcano(btn.dataset.arcano));
  });
  bindCardImages(grid);
}

function renderLibrary() {
  const grid = $("#library-grid");
  if (!grid) return;

  grid.innerHTML = RESOURCE_META.map((r) => {
    const url = AUREA_RESOURCES[r.key];
    const ready = isConfiguredUrl(url);
    return (
      '<article class="resource-card">' +
        '<span class="resource-icon" aria-hidden="true">' + r.icon + "</span>" +
        "<h3>" + escapeHtml(r.title) + "</h3>" +
        "<p>" + escapeHtml(r.text) + "</p>" +
        (ready
          ? '<a class="btn btn-ghost btn-sm" href="' + escapeHtml(url) + '" target="_blank" rel="noopener">' + escapeHtml(r.cta) + "</a>"
          : '<button class="btn btn-ghost btn-sm" type="button" data-unconfigured="' + r.key + '">' + escapeHtml(r.cta) + "</button>") +
      "</article>"
    );
  }).join("");

  grid.querySelectorAll("[data-unconfigured]").forEach((btn) => {
    btn.addEventListener("click", () => {
      toast("Este recurso todavía no está configurado: pegá la URL en AUREA_RESOURCES (js/aurea.js).");
    });
  });
}

/* ========================= CONSULTA GRATUITA (LANDING) ========================= */
const FREE_DRAW_KEY = "aurea:free_draw";

function readFreeDraw() {
  try {
    const raw = localStorage.getItem(FREE_DRAW_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && typeof data.n === "number" && cardByNumber(data.n)) return data;
  } catch (e) { /* dato corrupto: se descarta */ }
  return null;
}

function writeFreeDraw(data) {
  try { localStorage.setItem(FREE_DRAW_KEY, JSON.stringify(data)); } catch (e) { /* modo privado */ }
}

function fillFreeInfo(card) {
  const set = (id, text) => { const el = $(id); if (el) el.textContent = text; };
  set("#free-label", "Arcano " + card.roman + " · " + card.stage);
  set("#free-name", card.name);
  set("#free-keyword", card.keyword);
  set("#free-symbol", card.symbol);
  set("#free-description", card.description);
  set("#free-movement", card.movement);
  set("#free-question-meaning", card.question);
  set("#free-healing", card.healing);
}

function renderFreeResult(data, opts) {
  const card = cardByNumber(data.n);
  if (!card) return;
  const options = opts || {};

  const formWrap = $("#free-form-wrap");
  const result = $("#free-result");
  const qLabel = $("#free-q-label");
  const front = $("#free-front");
  const flip = $("#free-flip");
  const inner = $("#free-inner");
  const info = $("#free-info");
  const cta = $("#free-cta");

  if (formWrap) formWrap.hidden = true;
  if (result) result.hidden = false;
  if (qLabel) qLabel.textContent = data.q || "";
  if (front) front.innerHTML = cardFaceHTML(card, "Carta para:");
  fillFreeInfo(card);

  if (inner && flip && !inner.dataset.bound) {
    inner.dataset.bound = "1";
    inner.addEventListener("click", () => {
      const revealed = flip.classList.toggle("is-flipped");
      if (info) info.hidden = !revealed;
      if (revealed) {
        Sound.reveal();
        bindCardImages($("#free-front"));
      }
    });
  }

  if (options.autoFlip) {
    if (flip) flip.classList.add("is-flipped");
    if (info) info.hidden = false;
    bindCardImages($("#free-front"));
  } else {
    if (flip) flip.classList.remove("is-flipped");
    if (info) info.hidden = true;
    if (options.animate) {
      setTimeout(() => {
        if (flip) flip.classList.add("is-flipped");
        if (info) info.hidden = false;
        Sound.reveal();
        bindCardImages($("#free-front"));
      }, 700);
    }
  }

  if (cta) cta.hidden = false;
}

function handleFreeDraw(event) {
  event.preventDefault();
  const msgEl = $("#free-msg");
  const input = $("#free-question");
  const question = input ? input.value.trim() : "";

  if (question.length < 4) {
    return setMsg(msgEl, "Escribí tu pregunta para consultar a ÁureA.", "error");
  }

  const existing = readFreeDraw();
  if (existing) {
    renderFreeResult(existing, { autoFlip: true });
    return;
  }

  const data = {
    q: question,
    n: Math.floor(Math.random() * CARDS.length),
    at: Date.now(),
  };
  writeFreeDraw(data);
  setMsg(msgEl, "", null);
  renderFreeResult(data, { animate: true });
}

function initFreeDraw() {
  const form = $("#free-form");
  if (form) form.addEventListener("submit", handleFreeDraw);

  const existing = readFreeDraw();
  if (existing) renderFreeResult(existing, { autoFlip: true });
}

/* ========================= EVENTOS GLOBALES ========================= */
function bindGlobalEvents() {
  window.addEventListener("hashchange", renderRoute);

  document.addEventListener("click", (event) => {
    const closer = event.target.closest("[data-modal-close]");
    if (closer) { closeModal(); return; }

    const authTrigger = event.target.closest("[data-auth]");
    if (authTrigger) {
      const key = authTrigger.dataset.auth;
      go("#/" + (key === "registro" ? "registro" : key === "ingreso" ? "ingreso" : key === "recuperar" ? "recuperar" : "activar"));
      return;
    }

    const panelTrigger = event.target.closest("[data-panel]");
    if (panelTrigger && panelTrigger.classList.contains("menu-chip")) {
      showPanel(panelTrigger.dataset.panel);
      history.replaceState(null, "", "#/app/" + panelTrigger.dataset.panel);
      return;
    }

    const home = event.target.closest("[data-nav-home]");
    if (home) { event.preventDefault(); go("#/"); }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });

  const menuBtn = $("#btn-menu");
  const nav = $("#public-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  const logoutBtn = $("#btn-logout");
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

  const register = $("#form-register");
  if (register) register.addEventListener("submit", handleRegister);
  const login = $("#form-login");
  if (login) login.addEventListener("submit", handleLogin);
  const forgot = $("#form-forgot");
  if (forgot) forgot.addEventListener("submit", handleForgot);
  const resetSave = $("#btn-reset-save");
  if (resetSave) resetSave.addEventListener("click", handleReset);
  const activate = $("#form-activate");
  if (activate) activate.addEventListener("submit", handleActivate);
  const waitlist = $("#wl-form");
  if (waitlist) waitlist.addEventListener("submit", handleWaitlist);

  const spreadForm = $("#spread-form");
  if (spreadForm) spreadForm.addEventListener("submit", handleDraw);
  const newSpread = $("#btn-new-spread");
  if (newSpread) newSpread.addEventListener("click", resetSpread);

  const loginLink = $("#btn-login");
  if (loginLink) loginLink.addEventListener("click", (e) => { e.preventDefault(); go("#/ingreso"); });

  initFreeDraw();
}

/* ========================= INICIO ========================= */
document.addEventListener("DOMContentLoaded", () => {
  initSupabase();
  Sound.init();
  initStarfield();
  initReveal();
  initDailyCard();
  initCountdown();
  bindGlobalEvents();
  initAuth().then(() => {
    updateGreeting();
    renderRoute();
  });
});
