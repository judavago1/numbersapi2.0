// Configuración de Firebase (rellena con tus datos)
const firebaseConfig = {
    apiKey: "AIzaSyCDjSXYqIOKxbU6kjfGdWuEzeU_QCdhvM0",
    authDomain: "numberapi-f6d7a.firebaseapp.com",
    projectId: "numberapi-f6d7a",
    storageBucket: "numberapi-f6d7a.firebasestorage.app",
    messagingSenderId: "103038463545",
    appId: "1:103038463545:web:37fec795783618e33167e8"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar Firestore
const db = firebase.firestore();

document.getElementById("contactoForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const mensaje = document.getElementById("mensaje").value;

    const nuevoMensaje = {
        nombre: nombre,
        correo: correo,
        mensaje: mensaje,
        fecha: new Date().toISOString()
    };

    // Guardar en colección "contacto"
    db.collection("contacto").add(nuevoMensaje)
        .then(() => {
            document.getElementById("mensajeExito").textContent = "¡Mensaje enviado con éxito!";
            document.getElementById("contactoForm").reset();
        })
        .catch((error) => {
            document.getElementById("mensajeExito").textContent = "Error al enviar: " + error.message;
            console.error("Error al guardar en Firestore:", error);
        });
});

// script.js

// Función para mostrar una sección específica
function mostrarSeccion(seccion) {
    // Primero, ocultar todas las secciones
    let secciones = document.querySelectorAll('section');
    secciones.forEach(function(seccion) {
        seccion.style.display = 'none';
    });

    // Luego, mostrar la sección seleccionada
    document.getElementById(seccion).style.display = 'block';
}

// Inicializar para mostrar la sección principal al cargar la página
window.onload = function() {
    mostrarSeccion('principal');
};

// Aquí puedes incluir las funciones para consultar números y otras acciones
function consultarNumero() {
    const numero = document.getElementById("numero").value;
    const resultado = document.getElementById("resultado");

    if (numero === "") {
        resultado.innerHTML = `<div class="curiosidad">Por favor ingresa un número.</div>`;
        return;
    }

    const url = `https://api.allorigins.win/get?url=${encodeURIComponent('http://numbersapi.com/' + numero + '?json')}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const parsed = JSON.parse(data.contents);
            resultado.innerHTML = `
                <div class="curiosidad">
                    ${parsed.text}
                    <br><br>
                    <button onclick="guardarFavorito('${parsed.text.replace(/'/g, "\\'")}')">Guardar en Favoritos</button>
                </div>
            `;
        })
        .catch(() => {
            resultado.innerHTML = `<div class="curiosidad">Error al consultar la curiosidad.</div>`;
        });
}

function buscarCuriosidad() {
    const numero = document.getElementById("numeroBuscado").value.trim();
    const resultado = document.getElementById("resultadoBusqueda");

    if (!numero) {
        resultado.innerHTML = "Por favor, ingresa un número para buscar curiosidades.";
        return;
    }

    const tipos = ["trivia", "math", "year", "date"];
    resultado.innerHTML = "Buscando curiosidades...";

    const esFecha = numero.includes("/") || numero.includes("-");

    const promesas = tipos.map(tipo => {
        if (tipo === "date" && !esFecha) return null;

        const url = tipo === "date"
            ? `http://numbersapi.com/${numero}/date?json`
            : `http://numbersapi.com/${numero}/${tipo}?json`;

        return fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
            .then(res => res.json())
            .then(data => traducirTexto(JSON.parse(data.contents).text))
            .catch(() => null);
    }).filter(Boolean);

    Promise.all(promesas).then(respuestas => {
        const lista = respuestas.filter(Boolean).map(texto => `<div class="curiosidad">${texto}</div>`).join("");
        resultado.innerHTML = lista || "No se encontraron curiosidades.";
    }).catch(() => {
        resultado.innerHTML = "Error al obtener curiosidades.";
    });
}

function calcularNumeroVida() {
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const resultado = document.getElementById("resultadoNumeroVida");

    if (!fechaNacimiento) {
        resultado.textContent = "Por favor ingresa tu fecha de nacimiento.";
        return;
    }

    // Extraer los dígitos de la fecha
    const numeros = fechaNacimiento.replaceAll("-", "").split("").map(Number);

    // Sumar los dígitos hasta obtener un solo dígito
    let suma = numeros.reduce((acc, val) => acc + val, 0);
    while (suma > 9 && suma !== 11 && suma !== 22 && suma !== 33) {
        suma = suma.toString().split("").reduce((acc, val) => acc + parseInt(val), 0);
    }

    // Frases para cada número de vida
    const mensajes = {
        1: "Eres un líder nato, independiente y con una gran determinación.",
        2: "Tu naturaleza es armoniosa y cooperativa, destacas en el trabajo en equipo.",
        3: "Creatividad, alegría y expresión son tus cualidades más brillantes.",
        4: "Eres práctico, disciplinado y trabajas duro para alcanzar tus metas.",
        5: "Amas la libertad y la aventura, siempre en busca de nuevas experiencias.",
        6: "Tu alma está ligada al cuidado, el amor familiar y la responsabilidad.",
        7: "Eres introspectivo, analítico y espiritual. Te encanta profundizar en los misterios.",
        8: "Estás orientado al éxito, con gran capacidad para los negocios y el poder.",
        9: "Compasivo, humanitario y generoso, tienes un corazón al servicio de los demás.",
        11: "Un número maestro: visionario, intuitivo y con una energía espiritual elevada.",
        22: "Número maestro constructor. Tienes el poder de materializar grandes sueños.",
        33: "El maestro sanador. Amor incondicional y compasión te definen."
    };

    resultado.innerHTML = `Tu número de vida es <strong>${suma}</strong>. <br>${mensajes[suma] || "Número especial, sin descripción."}`;
}

// Arreglo para almacenar favoritos
let favoritos = [];

// Función para mostrar secciones
function mostrarSeccion(id) {
    const secciones = document.querySelectorAll("main section");
    secciones.forEach(sec => sec.style.display = "none");
    document.getElementById(id).style.display = "block";
}

// Función para consultar la curiosidad
function consultarNumero() {
    const numero = document.getElementById("numero").value;
    const resultado = document.getElementById("resultado");

    if (numero === "") {
        resultado.textContent = "Por favor ingresa un número.";
        return;
    }

    const url = `https://api.allorigins.win/get?url=${encodeURIComponent('http://numbersapi.com/' + numero + '?json')}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            resultado.innerHTML = `
                ${JSON.parse(data.contents).text}
                <br>
                <button onclick="guardarFavorito('${JSON.parse(data.contents).text.replace(/'/g, "\\'")}')">Guardar en Favoritos</button>
            `;
        })
        .catch(() => {
            resultado.textContent = "Error al consultar la curiosidad.";
        });
}

// Función para guardar curiosidad en favoritos
function guardarFavorito(texto) {
    if (!favoritos.includes(texto)) {
        favoritos.push(texto);
        actualizarListaFavoritos();
    } else {
        alert("Esta curiosidad ya está en tus favoritos.");
    }
}

// Función para actualizar el contenido del <ul> de favoritos
function actualizarListaFavoritos() {
    const lista = document.getElementById("listaFavoritos");
    lista.innerHTML = "";

    favoritos.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${item}
            <button onclick="eliminarFavorito(${index})" style="margin-left: 10px;">❌</button>
        `;
        lista.appendChild(li);
    });
}

function eliminarFavorito(index) {
    favoritos.splice(index, 1);
    actualizarListaFavoritos();
}

function traducirTexto(textoOriginal) {
    return fetch("https://libretranslate.de/translate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            q: textoOriginal,
            source: "en",
            target: "es",
            format: "text"
        })
    })
    .then(response => response.json())
    .then(data => data.translatedText)
    .catch(() => textoOriginal); // Si falla, muestra el texto original
}

// MOSTRAR LISTA
async function mostrarLista(id) {
    document.querySelectorAll("section").forEach(section => {
        section.style.display = "none";
    });

    document.getElementById(id).style.display = "block";

    const contenedor = document.getElementById("listaCuriosidades");
    contenedor.innerHTML = "<p>Cargando curiosidades...</p>";

    let html = "";

    const max = 30;

    for (let i = 0; i <= max; i++) {
        try {
            const triviaUrl = `http://numbersapi.com/${i}/trivia?json`;
            const trivia = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(triviaUrl)}`)
                .then(res => res.json()).then(data => JSON.parse(data.contents));
            html += `<div class="curiosidad"><strong>${i} - Trivia:</strong> ${trivia.text}</div>`;

            const mathUrl = `http://numbersapi.com/${i}/math?json`;
            const math = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(mathUrl)}`)
                .then(res => res.json()).then(data => JSON.parse(data.contents));
            html += `<div class="curiosidad"><strong>${i} - Matemática:</strong> ${math.text}</div>`;

            const yearUrl = `http://numbersapi.com/${i}/year?json`;
            const year = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(yearUrl)}`)
                .then(res => res.json()).then(data => JSON.parse(data.contents));
            html += `<div class="curiosidad"><strong>Año ${i}:</strong> ${year.text}</div>`;
        } catch (e) {
            console.warn(`Error cargando curiosidades para el número ${i}:`, e);
        }
    }

    const fechas = ["1/1", "2/14", "4/19", "12/25"];
    for (const fecha of fechas) {
        try {
            const dateUrl = `http://numbersapi.com/${fecha}/date?json`;
            const date = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(dateUrl)}`)
                .then(res => res.json()).then(data => JSON.parse(data.contents));
            html += `<div class="curiosidad"><strong>${fecha} - Fecha:</strong> ${date.text}</div>`;
        } catch (e) {
            console.warn(`Error con fecha ${fecha}:`, e);
        }
    }

    contenedor.innerHTML = html || "<p>No se pudieron cargar curiosidades.</p>";
}