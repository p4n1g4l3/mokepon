// Variables Globales

let ataqueJugador
let ataqueEnemigo

let vidasJugador = 3
let vidasEnemigo = 3

function iniciarJuego(){

    let sectionSeleccionarAtaque= document.getElementById("seleccionar-ataque")
    sectionSeleccionarAtaque.style.display = "none"

    let sectionReiniciar= document.getElementById("reiniciar")
    sectionReiniciar.style.display = "none"

    let botonMascotaJugador = document.getElementById("boton-mascota")
    botonMascotaJugador.addEventListener("click", seleccionarMascotaJugador)

    let botonFuego = document.getElementById("boton-fuego")
    botonFuego.addEventListener("click",ataqueFuego)
    
    let botonAgua = document.getElementById("boton-agua")
    botonAgua.addEventListener("click",ataqueAgua)

    let botonTierra = document.getElementById("boton-tierra")
    botonTierra.addEventListener("click",ataqueTierra)

    let botonReiniciar = document.getElementById("boton-reiniciar")
    botonReiniciar.addEventListener("click",reiniciarJuego)
}

function seleccionarMascotaJugador() {
    // Lista completa de Mokepons (fácil de actualizar)
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

    // Buscar cuál está seleccionado
    const mokeponSeleccionado = mokepons.find(m => 
        document.getElementById(m.id).checked
    );

    if (!mokeponSeleccionado) {
        alert("¡Debes seleccionar una Mascota!");
        return; // Detiene la función si no hay selección
    }

    // Aplicar efectos visuales
    document.querySelector(`label[for="${mokeponSeleccionado.id}"]`)
        .classList.add('seleccionado');
    
    document.getElementById("mascota-jugador").innerHTML = 
        mokeponSeleccionado.nombre;

    // Mostrar sección de ataques
    document.getElementById("seleccionar-mascota").style.display = "none";
    document.getElementById("seleccionar-ataque").style.display = "flex";

    seleccionarMascotaEmemigo();
}

function seleccionarMascotaEmemigo(){
    let mascotaAleatorio = aleatorio(1,5)

    if(mascotaAleatorio == 1){
        spanMascotaEnemigo.innerHTML = "Hipodoge"
    }else if(mascotaAleatorio == 2){
        spanMascotaEnemigo.innerHTML = "Capipepo"
    }else if(mascotaAleatorio == 3){
        spanMascotaEnemigo.innerHTML = "Dravernix"
    }else if(mascotaAleatorio == 4){
        spanMascotaEnemigo.innerHTML = "Tenebrix"
    }else{
        spanMascotaEnemigo.innerHTML = "Ocelevian"
    }
}

function ataqueFuego(){
    ataqueJugador = "FUEGO"
    ataqueAleatorioEnemigo()
}

function ataqueAgua(){
    ataqueJugador = "AGUA"
    ataqueAleatorioEnemigo()
}

function ataqueTierra(){
    ataqueJugador = "TIERRA"
    ataqueAleatorioEnemigo()
}

function ataqueAleatorioEnemigo(){
    let ataqueAleatorio = aleatorio(1,3)

    if(ataqueAleatorio == 1){
        ataqueEnemigo = "FUEGO"
    }else if (ataqueAleatorio == 2){
        ataqueEnemigo = "AGUA"
    }else{
        ataqueEnemigo = "TIERRA"
    }
    combate()
}

function combate(){
    let spanVidasJugador = document.getElementById("vidas-jugador")
    let spanVidasEnemigo = document.getElementById("vidas-enemigo")

    if(ataqueEnemigo == ataqueJugador){
        crearMensaje("EMPATE")
    }else if(ataqueJugador == "FUEGO" && ataqueEnemigo == "TIERRA"){
        crearMensaje("GANASTE")
        vidasEnemigo --
        spanVidasEnemigo.innerHTML = vidasEnemigo
    }else if(ataqueJugador == "AGUA" && ataqueEnemigo == "FUEGO"){
        crearMensaje("GANASTE")
        vidasEnemigo --
        spanVidasEnemigo.innerHTML = vidasEnemigo
    }else if(ataqueJugador == "TIERRA" && ataqueEnemigo == "AGUA"){
        crearMensaje("GANASTE")
        vidasEnemigo --
        spanVidasEnemigo.innerHTML = vidasEnemigo
    }else{
        crearMensaje("PERDISTE")
        vidasJugador --
        spanVidasJugador.innerHTML = vidasJugador
    }

    revisarVidas()
}

function revisarVidas(){
    if(vidasEnemigo == 0){
        crearMensajeFinal("FELICITACIONES GANASTE")
    }else if(vidasJugador == 0){
        crearMensajeFinal("LO SIENTO PERDISTE")
    }
}

function crearMensaje(resultado){
    let sectionMensajes = document.getElementById("resultado")
    let ataquesDelJugador = document.getElementById("ataques-del-jugador")
    let ataquesDelEnemigo = document.getElementById("ataques-del-enemigo")

    sectionMensajes.innerHTML = resultado
    ataquesDelJugador.innerHTML += `${ataqueJugador} | `
    ataquesDelEnemigo.innerHTML += `${ataqueEnemigo} | `
}

function crearMensajeFinal(resultadoFinal){

    let sectionMensajes = document.getElementById("resultado")
    sectionMensajes.innerHTML= resultadoFinal

    let botonFuego = document.getElementById("boton-fuego")
    botonFuego.disabled = true
    
    let botonAgua = document.getElementById("boton-agua")
    botonAgua.disabled = true

    let botonTierra = document.getElementById("boton-tierra")
    botonTierra.disabled = true

    let sectionReiniciar= document.getElementById("reiniciar")
    sectionReiniciar.style.display = "block"
}

function reiniciarJuego(){
    location.reload()
}

function aleatorio(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

window.addEventListener("load", iniciarJuego)