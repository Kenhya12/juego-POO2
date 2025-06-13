class Game {
  constructor() {
    this.container = document.getElementById("game-container");
    this.puntosElement = document.getElementById("puntos");
    this.hada = null;
    this.murcielago = [];
    this.puntuacion = 0;
    this.murcielagosTransformados = 0; // Contador de murciélagos transformados

    this.crearEscenario();
    this.agregarEventos();
  }

  crearEscenario() {
    this.hada = new Hada();
    this.container.appendChild(this.hada.element);

    for (let i = 0; i < 10; i++) {
      const murcielago = new Murcielago();
      this.murcielago.push(murcielago);
      this.container.appendChild(murcielago.element);
      murcielago.volar(); // Inicia el movimiento al crearlo
    }
  }

  agregarEventos() {
    window.addEventListener("keydown", (e) => this.hada.mover(e));
    this.checkColisiones();

    // Evento para el botón de recarga
    const reloadBtn = document.getElementById("reload");
    if (reloadBtn) {
      reloadBtn.addEventListener("click", () => {
        console.log("Evento de recarga registrado"); // Depuración adicional
        if (confirm("¿Quieres volver a jugar?")) {
          console.log("Botón de recarga presionado, recargando página"); // Depuración
          location.reload(); // Recarga la página
        }
      });
    } else {
      console.warn("No se encontró el botón con id='reload'");
    }
    this.checkColisiones();
  }

  checkColisiones() {
    setInterval(() => {
      this.murcielago.forEach((murcielago, index) => {
        if (this.hada.colisionaCon(murcielago) && !murcielago.transformado) {
          console.log("Colisión detectada con murciélago", index);
          const color = murcielago.transformar();
          this.actualizarPuntuacion(color.puntos);
        }
      });
    }, 100);
  }

  actualizarPuntuacion(puntos) {
    this.puntuacion += puntos;
    this.puntosElement.textContent = `Puntos: ${this.puntuacion}`;
  }
}

class Hada {
  constructor() {
    this.x = 50;
    this.y = 375; 
    this.width = 200;
    this.height = 200;
    this.velocidad = 10;
    this.saltando = false;

    this.element = document.createElement("img");
    this.element.src = "imagenes/hada.png";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.position = "absolute";
    this.element.classList.add("hada");

    this.actualizarPosicion(); 
  }

  mover(evento) {
    if (evento.key === "ArrowRight") {
      this.x += this.velocidad;
    } else if (evento.key === "ArrowLeft") {
      this.x -= this.velocidad;
    } else if (evento.key === "ArrowUp" && !this.saltando) {
      this.saltar();
    }

    this.actualizarPosicion();
  }

  saltar() {
    this.saltando = true;
    let alturaMaxima = this.y - 350;

    const salto = setInterval(() => {
      if (this.y > alturaMaxima) {
        this.y -= 20;
      } else {
        clearInterval(salto);
        this.caer();
      }
      this.actualizarPosicion();
    }, 20);
  }

  caer() {
    const gravedad = setInterval(() => {
      if (this.y < 370) {
        this.y += 10;
      } else {
        clearInterval(gravedad);
        this.saltando = false;
      }
      this.actualizarPosicion();
    }, 20);
  }

  actualizarPosicion() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  colisionaCon(objeto) {
    return (
      this.x < objeto.x + objeto.width &&
      this.x + this.width > objeto.x &&
      this.y < objeto.y + objeto.height &&
      this.y + this.height > objeto.y
    );
  }
}

class Murcielago {
  constructor() {
    this.x = Math.random() * 800 + 100; /* 500 */
    this.y = Math.random() * 180 + 100; /* 500 */
    this.width = 120;
    this.height = 120;
    this.transformado = false;
    this.tiempo = Math.random() * 4 * Math.PI; // Fase inicial aleatoria
    this.velocidadTiempo = 0.1 * (0.9 + Math.random() * 0.7); // Velocidad de oscilación variable

    // Añadir variación inicial
    this.x += Math.random() * 20 - 10; // Desplazamiento horizontal de ±10px
    this.y += Math.random() * 10 - 5;  // Desplazamiento vertical de ±5px (opcional)
    // Limitar las posiciones para que no se salgan
    this.x = Math.max(0, Math.min(1200 - this.width, this.x));
    this.y = Math.max(0, Math.min(240 - this.height, this.y));

    this.element = document.createElement("img");
    this.element.src = "imagenes/murcielago.png";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.position = "absolute";
    this.element.classList.add("murcielago");

    this.actualizarPosicion();
    this.color = this.seleccionarColor(); /* Inicializa el color */
  }

  volar() {
    const intervalo = 50 + Math.random() * 20; // Intervalo entre 50-70ms
    this.intervalo = setInterval(() => {
      this.tiempo += this.velocidadTiempo; // Incremento variable
      const desplazamientoX = 10 * Math.sin(this.tiempo); // Oscilación horizontal
      const desplazamientoY = 5 * Math.cos(this.tiempo); // Oscilación vertical
      // Limita el movimiento dentro del 40% superior y el ancho
      this.x = Math.max(0, Math.min(1000 - this.width, this.x + desplazamientoX));
      this.y = Math.max(0, Math.min(240 - this.height, this.y + desplazamientoY));
      this.actualizarPosicion();
      console.log("Murciélago x:", this.x.toFixed(2), "y:", this.y.toFixed(2), "tiempo:", this.tiempo.toFixed(2));
    }, intervalo); // Intervalo aleatorio por murciélago
  }

  seleccionarColor() {
    const colores = [
      { nombre: "roja", src: "imagenes/mariposa-roja.png", puntos: 5 },
      { nombre: "amarilla", src: "imagenes/mariposa-amarilla.png", puntos: 10 },
      { nombre: "azul", src: "imagenes/mariposa-azul.png", puntos: 15 },
      { nombre: "rosa", src: "imagenes/mariposa-rosa.png", puntos: 20 }
    ];
    return colores[Math.floor(Math.random() * colores.length)];
  }

  transformar() {
    if (!this.transformado) {
      this.transformado = true;
      this.element.src = this.color.src; // Cambia a la imagen de mariposa
      this.velocidadTiempo *= 0.8; // Reduce la velocidad para un vuelo más suave
      console.log(`Murciélago transformado en mariposa ${this.color.nombre} con ${this.color.puntos} puntos`);
    }
    return this.color; // Devuelve el objeto de color para los puntos
  }

  actualizarPosicion() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
}

const juego = new Game();