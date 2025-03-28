// Variables Globales
let nivel = 1;
let experiencia = 0;
let ataquesEspeciales = {
    Hipodoge: "Terremoto 🌍",
    Capipepo: "Hoja Afilada 🍃", 
    Dravernix: "Llamarada 🔥",
    Tenebrix: "Sombras 👻",
    Ocelevian: "Tsunami 🌊"
};

let ataqueJugador;
let ataqueEnemigo;
let vidasJugador = 3;
let vidasEnemigo = 3;

function iniciarJuego(){
    // Configuración inicial de pantallas
    document.getElementById("pantalla-inicio").style.display = "flex";
    document.getElementById("seleccionar-mascota").style.display = "none";
    document.getElementById("seleccionar-ataque").style.display = "none";
    document.getElementById("reiniciar").style.display = "none";

    // Evento para el botón de comenzar
    document.getElementById("comenzar-juego").addEventListener("click", () => {
        document.getElementById("pantalla-inicio").style.display = "none";
        document.getElementById("seleccionar-mascota").style.display = "flex";
    });

    // Inicializar UI de nivel
    actualizarNivel();

    // Configurar botones
    document.getElementById("boton-mascota").addEventListener("click", seleccionarMascotaJugador);
    document.getElementById("boton-fuego").addEventListener("click", ataqueFuego);
    document.getElementById("boton-agua").addEventListener("click", ataqueAgua);
    document.getElementById("boton-tierra").addEventListener("click", ataqueTierra);
    document.getElementById("boton-especial").addEventListener("click", function() {
        const mascota = document.getElementById("mascota-jugador").textContent;
        ataqueEspecial(mascota);
    });
    document.getElementById("boton-reiniciar").addEventListener("click", reiniciarJuego);
}

function seleccionarMascotaJugador() {
    const mokepons = [
        { id: "hipodoge", nombre: "Hipodoge" },
        { id: "capipepo", nombre: "Capipepo" },
        { id: "Dravernix", nombre: "Dravernix" },
        { id: "Tenebrix", nombre: "Tenebrix" },
        { id: "Ocelevian", nombre: "Ocelevian" }
    ];

    // Resetear selección visual
    document.querySelectorAll('.tarjeta-de-mokepon').forEach(tarjeta => {
        tarjeta.classList.remove('seleccionado');
    });

    const mokeponSeleccionado = mokepons.find(m => 
        document.getElementById(m.id).checked
    );

    if (!mokeponSeleccionado) {
        alert("¡Debes seleccionar una Mascota!");
        return;
    }

    document.querySelector(`label[for="${mokeponSeleccionado.id}"]`).classList.add('seleccionado');
    document.getElementById("mascota-jugador").innerHTML = mokeponSeleccionado.nombre;

    // Mostrar sección de ataques
    document.getElementById("seleccionar-mascota").style.display = "none";
    document.getElementById("seleccionar-ataque").style.display = "flex";

    seleccionarMascotaEmemigo();
}

function seleccionarMascotaEmemigo() {
    const spanMascotaEnemigo = document.getElementById("mascota-enemigo");
    const mascotaAleatorio = aleatorio(1,5);

    if(mascotaAleatorio == 1) spanMascotaEnemigo.innerHTML = "Hipodoge";
    else if(mascotaAleatorio == 2) spanMascotaEnemigo.innerHTML = "Capipepo";
    else if(mascotaAleatorio == 3) spanMascotaEnemigo.innerHTML = "Dravernix";
    else if(mascotaAleatorio == 4) spanMascotaEnemigo.innerHTML = "Tenebrix";
    else spanMascotaEnemigo.innerHTML = "Ocelevian";
}

function ataqueFuego() {
    ataqueJugador = "FUEGO";
    ataqueAleatorioEnemigo();
}

function ataqueAgua() {
    ataqueJugador = "AGUA";
    ataqueAleatorioEnemigo();
}

function ataqueTierra() {
    ataqueJugador = "TIERRA";
    ataqueAleatorioEnemigo();
}

function ataqueEspecial(mascota) {
    switch(mascota) {
        case "Hipodoge": ataqueJugador = "TERREMOTO"; break;
        case "Capipepo": ataqueJugador = "HOJA_AFILADA"; break;
        case "Dravernix": ataqueJugador = "LLAMARADA"; break;
        case "Tenebrix": ataqueJugador = "SOMBRAS"; break;
        case "Ocelevian": ataqueJugador = "TSUNAMI"; break;
        default: ataqueJugador = "RAYO";
    }
    
    // Efecto visual
    const mascotaUI = document.getElementById("mascota-jugador");
    mascotaUI.classList.add("ataque-especial");
    
    setTimeout(() => {
        mascotaUI.classList.remove("ataque-especial");
        ataqueAleatorioEnemigo();
    }, 800);
}

function ataqueAleatorioEnemigo() {
    const ataqueAleatorio = aleatorio(1,3);
    ataqueEnemigo = (ataqueAleatorio == 1) ? "FUEGO" : 
                   (ataqueAleatorio == 2) ? "AGUA" : "TIERRA";
    combate();
}

function combate() {
    const spanVidasJugador = document.getElementById("vidas-jugador");
    const spanVidasEnemigo = document.getElementById("vidas-enemigo");
    let danio = 1;

    // Ataques especiales hacen más daño
    if (["TERREMOTO", "HOJA_AFILADA", "LLAMARADA", "SOMBRAS", "TSUNAMI"].includes(ataqueJugador)) {
        danio = 1.5;
    }

    if (ataqueEnemigo == ataqueJugador) {
        crearMensaje("EMPATE");
    } else if (
        (ataqueJugador == "FUEGO" && ataqueEnemigo == "TIERRA") ||
        (ataqueJugador == "AGUA" && ataqueEnemigo == "FUEGO") ||
        (ataqueJugador == "TIERRA" && ataqueEnemigo == "AGUA") ||
        (ataqueJugador.length > 5) // Ataques especiales
    ) {
        crearMensaje("GANASTE");
        vidasEnemigo -= danio;
        spanVidasEnemigo.innerHTML = Math.max(0, Math.floor(vidasEnemigo));
        
        if (vidasEnemigo <= 0) {
            ganarBatalla();
            crearMensajeFinal("FELICITACIONES GANASTE");
        }
    } else {
        crearMensaje("PERDISTE");
        vidasJugador -= 1;
        spanVidasJugador.innerHTML = vidasJugador;
    }

    revisarVidas();
}

function ganarBatalla() {
    if (vidasEnemigo <= 0) {
        experiencia += 50;
        actualizarNivel();
        
        if (experiencia >= 100) {
            nivel++;
            experiencia = 0;
            desbloquearAtaqueEspecial();
        }
    }
}

function actualizarNivel() {
    const nivelUI = document.getElementById("nivel-jugador") || document.createElement("p");
    nivelUI.id = "nivel-jugador";
    nivelUI.textContent = `Nivel ${nivel} (${experiencia}/100 XP)`;
    if (!document.getElementById("nivel-jugador")) {
        document.querySelector(".ataques").prepend(nivelUI);
    }
}

function desbloquearAtaqueEspecial() {
    const botonEspecial = document.getElementById("boton-especial");
    const mascota = document.getElementById("mascota-jugador").textContent;
    
    botonEspecial.textContent = ataquesEspeciales[mascota] || "Rayo ⚡";
    botonEspecial.style.display = "inline-block";
    botonEspecial.classList.add("efecto-desbloqueo");
    
    setTimeout(() => {
        botonEspecial.classList.remove("efecto-desbloqueo");
    }, 1000);
}

function revisarVidas() {
    if (vidasEnemigo <= 0) {
        crearMensajeFinal("FELICITACIONES GANASTE");
    } else if (vidasJugador <= 0) {
        crearMensajeFinal("LO SIENTO PERDISTE");
    }
}

function crearMensaje(resultado) {
    document.getElementById("resultado").innerHTML = resultado;
    document.getElementById("ataques-del-jugador").innerHTML += `${ataqueJugador} | `;
    document.getElementById("ataques-del-enemigo").innerHTML += `${ataqueEnemigo} | `;
}

function crearMensajeFinal(resultadoFinal) {
    document.getElementById("resultado").innerHTML = resultadoFinal;
    
    // Deshabilitar todos los botones
    document.querySelectorAll(".boton-ataque, #boton-especial").forEach(boton => {
        boton.disabled = true;
    });
    
    document.getElementById("reiniciar").style.display = "block";
}

function reiniciarJuego() {
    location.reload();
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

window.addEventListener("load", iniciarJuego);