// Variables Globales MEJORADAS
let nivel = 1;
let experiencia = 0;
let comboGanador = 0; // Para ataques consecutivos
const tipos = {
    FUEGO: { fuerteContra: ['TIERRA', 'PLANTA'], debilContra: ['AGUA'] },
    AGUA: { fuerteContra: ['FUEGO'], debilContra: ['PLANTA', 'ELECTRICO'] },
    TIERRA: { fuerteContra: ['ELECTRICO', 'VENENO'], debilContra: ['AGUA', 'PLANTA'] },
    PLANTA: { fuerteContra: ['AGUA', 'TIERRA'], debilContra: ['FUEGO'] },
    ELECTRICO: { fuerteContra: ['AGUA'], debilContra: ['TIERRA'] }
};

const mokepones = {
    Hipodoge: { tipo: 'TIERRA', especial: 'TERREMOTO 🌍' },
    Capipepo: { tipo: 'PLANTA', especial: 'HOJA AFILADA 🍃' },
    Dravernix: { tipo: 'FUEGO', especial: 'LLAMARADA 🔥' },
    Tenebrix: { tipo: 'ELECTRICO', especial: 'RAYO OSCURIDAD ⚡' },
    Ocelevian: { tipo: 'AGUA', especial: 'TSUNAMI 🌊' }
};

let ataqueJugador, ataqueEnemigo;
let vidasJugador = 3, vidasEnemigo = 3;
let mascotaJugador, mascotaEnemigo;


// FUNCIÓN PRINCIPAL INICIAR JUEGO
function iniciarJuego(){
    document.getElementById("pantalla-inicio").style.display = "flex";
    document.getElementById("seleccionar-mascota").style.display = "none";
    document.getElementById("seleccionar-ataque").style.display = "none";
    document.getElementById("reiniciar").style.display = "none";

    document.getElementById("comenzar-juego").addEventListener("click", () => {
        document.getElementById("pantalla-inicio").style.display = "none";
        document.getElementById("seleccionar-mascota").style.display = "flex";
    });

    // Configurar botones
    document.getElementById("boton-mascota").addEventListener("click", seleccionarMascotaJugador);
    document.getElementById("boton-fuego").addEventListener("click", () => ejecutarAtaque("FUEGO"));
    document.getElementById("boton-agua").addEventListener("click", () => ejecutarAtaque("AGUA"));
    document.getElementById("boton-tierra").addEventListener("click", () => ejecutarAtaque("TIERRA"));
    document.getElementById("boton-especial").addEventListener("click", ataqueEspecial);
    document.getElementById("boton-reiniciar").addEventListener("click", reiniciarJuego);
}


//  SELECCIÓN DE MASCOTAS
function seleccionarMascotaJugador() {
    const mokeponSeleccionado = [...document.querySelectorAll('input[name="mascota"]')].find(input => input.checked);
    
    if (!mokeponSeleccionado) {
        alert("¡Debes seleccionar una Mascota!");
        return;
    }

    mascotaJugador = mokeponSeleccionado.id;
    document.querySelector(`label[for="${mokeponSeleccionado.id}"]`).classList.add('seleccionado');
    document.getElementById("mascota-jugador").textContent = mascotaJugador;

    // Transición a ataques
    document.getElementById("seleccionar-mascota").style.display = "none";
    document.getElementById("seleccionar-ataque").style.display = "flex";

    seleccionarMascotaEnemigo();
    actualizarUI();
}

function seleccionarMascotaEnemigo() {
    const opciones = Object.keys(mokepones);
    mascotaEnemigo = opciones[aleatorio(0, opciones.length - 1)];
    document.getElementById("mascota-enemigo").textContent = mascotaEnemigo;
}


//  SISTEMA DE ATAQUES
function ejecutarAtaque(tipo) {
    ataqueJugador = tipo;
    animarAtaque(tipo);
    setTimeout(() => {
        ataqueAleatorioEnemigo();
    }, 1000);
}

function ataqueEspecial() {
    if (comboGanador < 2) return;
    
    ataqueJugador = "ESPECIAL";
    const tipoEspecial = mokepones[mascotaJugador].especial;
    document.getElementById("resultado").textContent = `¡${tipoEspecial}!`;
    
    animarAtaque('especial');
    setTimeout(() => {
        ataqueAleatorioEnemigo();
        comboGanador = 0;
        actualizarUI();
    }, 1500);
}

function ataqueAleatorioEnemigo() {
    const opciones = Object.keys(tipos);
    ataqueEnemigo = opciones[aleatorio(0, opciones.length - 1)];
    combate();
}


// NÚCLEO DEL COMBATE
function combate() {
    const resultado = calcularResultado();
    const esVictoria = resultado.includes("GANASTE");
    
    // Efectos de daño
    if (esVictoria) {
        vidasEnemigo -= (ataqueJugador === "ESPECIAL") ? 2 : 1;
        comboGanador++;
    } else if (resultado.includes("PERDISTE")) {
        vidasJugador -= 1;
        comboGanador = 0;
    }

    // Actualizar UI
    actualizarUI();
    crearMensaje(resultado);
    revisarVidas();

    document.getElementById("resultado").classList.add(esVictoria ? "victoria" : "derrota");
    setTimeout(() => {
        document.getElementById("resultado").classList.remove("victoria", "derrota");
    }, 1000);
}

function calcularResultado() {
    if (ataqueJugador === ataqueEnemigo) return "EMPATE";
    if (ataqueJugador === "ESPECIAL") return "GANASTE CON ATAQUE ESPECIAL!";
    
    const tipoJugador = mokepones[mascotaJugador].tipo;
    const tipoEnemigo = mokepones[mascotaEnemigo].tipo;
    
    // Sistema de ventajas por tipo
    if (tipos[tipoJugador].fuerteContra.includes(tipoEnemigo)) {
        return "GANASTE (VENTAJA DE TIPO!)";
    } else if (tipos[tipoEnemigo].fuerteContra.includes(tipoJugador)) {
        return "PERDISTE (DESVENTAJA DE TIPO)";
    }
    
    // Sistema clásico como respaldo
    if (
        (ataqueJugador === "FUEGO" && ataqueEnemigo === "TIERRA") ||
        (ataqueJugador === "AGUA" && ataqueEnemigo === "FUEGO") ||
        (ataqueJugador === "TIERRA" && ataqueEnemigo === "AGUA")
    ) {
        return "GANASTE";
    }
    
    return "PERDISTE";
}

//  EFECTOS VISUALES
function animarAtaque(tipo) {
    const boton = document.getElementById(`boton-${tipo.toLowerCase()}`);
    const jugadorUI = document.getElementById("mascota-jugador");
    
    // Animación del botón
    boton.classList.add("animacion-ataque");
    setTimeout(() => boton.classList.remove("animacion-ataque"), 500);
    
    // Efecto en la mascota
    jugadorUI.classList.add("efecto-ataque");
    setTimeout(() => jugadorUI.classList.remove("efecto-ataque"), 800);
}


//  SISTEMA DE PROGRESIÓN
function actualizarUI() {
    document.getElementById("vidas-jugador").textContent = vidasJugador;
    document.getElementById("vidas-enemigo").textContent = vidasEnemigo;
    
    // Barra de progreso especial
    const barraEspecial = document.getElementById("barra-especial");
    barraEspecial.style.width = `${(comboGanador/2)*100}%`;
    barraEspecial.textContent = comboGanador >= 2 ? "¡LISTO!" : `${comboGanador}/2`;
    
    // Mostrar/Ocultar botón especial
    const botonEspecial = document.getElementById("boton-especial");
    botonEspecial.style.display = comboGanador >= 2 ? "block" : "none";
    if (comboGanador >= 2) {
        botonEspecial.textContent = mokepones[mascotaJugador].especial;
        botonEspecial.classList.add("brillo-especial");
    } else {
        botonEspecial.classList.remove("brillo-especial");
    }
}


//  FUNCIONES AUXILIARES
function crearMensaje(resultado) {
    document.getElementById("resultado").textContent = resultado;
    document.getElementById("ataques-del-jugador").textContent += `${ataqueJugador} | `;
    document.getElementById("ataques-del-enemigo").textContent += `${ataqueEnemigo} | `;
}

function revisarVidas() {
    if (vidasEnemigo <= 0) {
        experiencia += 30;
        crearMensajeFinal("¡VICTORIA! +30 XP");
    } else if (vidasJugador <= 0) {
        crearMensajeFinal("GAME OVER");
    }
}

function crearMensajeFinal(mensaje) {
    document.getElementById("resultado").textContent = mensaje;
    document.querySelectorAll(".boton-ataque").forEach(b => b.disabled = true);
    document.getElementById("reiniciar").style.display = "block";
}


function reiniciarJuego() {
    location.reload();
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

window.addEventListener("load", iniciarJuego);