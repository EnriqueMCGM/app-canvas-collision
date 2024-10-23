const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#90EE90";

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.originalColor = color; // Guardamos el color original
    this.text = text;
    this.speed = speed;
    this.dx = (Math.random() > 0.5 ? 1 : -1) * this.speed; // Dirección aleatoria en X
    this.dy = (Math.random() > 0.5 ? 1 : -1) * this.speed; // Dirección aleatoria en Y
    this.isFlashing = false; // Bandera para el flash azul
    this.flashTimer = 0; // Temporizador para controlar el flash
  }

  draw(context) {
    context.beginPath();
    context.strokeStyle = this.color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";
    context.fillText(this.text, this.posX, this.posY);
    context.lineWidth = 2;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  update(context) {
    this.draw(context);

    // Actualizar la posición X
    this.posX += this.dx;
    // Cambiar la dirección si el círculo llega al borde del canvas en X
    if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
      this.dx = -this.dx;
    }

    // Actualizar la posición Y
    this.posY += this.dy;
    // Cambiar la dirección si el círculo llega al borde del canvas en Y
    if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
      this.dy = -this.dy;
    }

    // Controlar el temporizador del flash azul
    if (this.isFlashing) {
      this.flashTimer--;
      if (this.flashTimer <= 0) {
        this.color = this.originalColor;
        this.isFlashing = false;
      }
    }
  }

  checkCollision(otherCircle) {
    const distX = this.posX - otherCircle.posX;
    const distY = this.posY - otherCircle.posY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    return distance < this.radius + otherCircle.radius;
  }

  // Función para aplicar el efecto de "flash"
  flashBlue() {
    this.color = "#0000FF";
    this.isFlashing = true;
    this.flashTimer = 10; // Duración del flash azul (ajustable)
  }

  // Función para intercambiar direcciones en colisión
  bounce(otherCircle) {
    let tempDx = this.dx;
    let tempDy = this.dy;

    // Intercambia las velocidades entre los dos círculos
    this.dx = otherCircle.dx;
    this.dy = otherCircle.dy;
    otherCircle.dx = tempDx;
    otherCircle.dy = tempDy;
  }
}

// Crear un array para almacenar los círculos
let circles = [];

// Función para generar círculos aleatorios
function generateCircles(n) {
  for (let i = 0; i < n; i++) {
    let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = Math.random() * (window_height - radius * 2) + radius;
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Color aleatorio
    let speed = Math.random() * 4 + 1; // Velocidad entre 1 y 5
    let text = `C${i + 1}`; // Etiqueta del círculo
    circles.push(new Circle(x, y, radius, color, text, speed));
  }
}

// Función para manejar las colisiones
function handleCollisions() {
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      if (circles[i].checkCollision(circles[j])) {
        // Aplicar el efecto de "flash" a ambos círculos
        circles[i].flashBlue();
        circles[j].flashBlue();

        // Rebotar (intercambiar direcciones)
        circles[i].bounce(circles[j]);
      }
    }
  }
}

// Función para animar los círculos
function animate() {
  ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas
  circles.forEach(circle => {
    circle.update(ctx); // Actualizar cada círculo
  });
  handleCollisions(); // Detectar colisiones y aplicar rebote
  requestAnimationFrame(animate); // Repetir la animación
}

// Generar N círculos y comenzar la animación
generateCircles(10); 
animate();
