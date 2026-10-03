const bg = document.getElementById("galaxy");
const ctx = bg.getContext("2d");

const heartCanvas = document.getElementById("heart");
const hctx = heartCanvas.getContext("2d");

const heartButton = document.getElementById("heartButton");
const tapText = document.getElementById("tapText");
const birthdayMessage = document.getElementById("birthdayMessage");

let width;
let height;

let stars = [];
let particles = [];
let explosionParticles = [];

let time = 0;
let clicked = false;


// ===============================
// AJUSTAR CANVAS
// ===============================

function resize() {

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    bg.width = width * dpr;
    bg.height = height * dpr;

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    const rect =
        heartCanvas.getBoundingClientRect();

    heartCanvas.width = rect.width * dpr;
    heartCanvas.height = rect.height * dpr;

    hctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    createStars();

    createHeart();
}

window.addEventListener(
    "resize",
    resize
);


// ===============================
// ESTRELLAS DEL FONDO
// ===============================

function createStars() {

    stars = [];

    for (let i = 0; i < 180; i++) {

        stars.push({

            x: Math.random() * width,

            y: Math.random() * height,

            size:
                Math.random() * 1.8 + 0.2,

            alpha:
                Math.random(),

            speed:
                Math.random() * 0.02 + 0.005
        });
    }
}


function drawStars() {

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    stars.forEach(star => {

        star.alpha += star.speed;

        const opacity =
            0.25 +
            Math.abs(
                Math.sin(star.alpha)
            ) * 0.75;

        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(255,220,255,${opacity})`;

        ctx.shadowBlur = 8;

        ctx.shadowColor =
            "#d946ff";

        ctx.fill();
    });

    ctx.shadowBlur = 0;
}


// ===============================
// FORMA DEL CORAZÓN
// ===============================

function heartShape(t) {

    return {

        x:
            16 *
            Math.pow(
                Math.sin(t),
                3
            ),

        y:
            13 *
                Math.cos(t)
            - 5 *
                Math.cos(2 * t)
            - 2 *
                Math.cos(3 * t)
            - Math.cos(4 * t)
    };
}


function isInsideHeart(x, y) {

    let inside = false;

    const points = 120;

    for (
        let i = 0,
        j = points - 1;

        i < points;

        j = i++
    ) {

        const a =
            heartShape(
                i *
                Math.PI *
                2 /
                points
            );

        const b =
            heartShape(
                j *
                Math.PI *
                2 /
                points
            );

        if (
            ((a.y > y) !==
            (b.y > y)) &&

            (
                x <
                (b.x - a.x) *
                (y - a.y) /
                (b.y - a.y) +
                a.x
            )
        ) {

            inside = !inside;
        }
    }

    return inside;
}


// ===============================
// CREAR CORAZÓN
// ===============================

function createHeart() {

    particles = [];

    const rect =
        heartCanvas.getBoundingClientRect();

    const scale =
        Math.min(
            rect.width / 38,
            rect.height / 38
        );

    const total = 1500;

    for (
        let i = 0;
        i < total;
        i++
    ) {

        let x;
        let y;

        do {

            x =
                Math.random() *
                32 - 16;

            y =
                Math.random() *
                30 - 15;

        } while (
            !isInsideHeart(x, y)
        );


        const random =
            Math.random();

        let color;

        if (random < 0.35) {

            color = "#ff72e8";

        } else if (random < 0.7) {

            color = "#9f8cff";

        } else {

            color = "#ffffff";
        }


        particles.push({

            x:
                x * scale,

            y:
                -y * scale,

            originalX:
                x * scale,

            originalY:
                -y * scale,

            size:
                Math.random() *
                1.7 + 0.4,

            alpha:
                Math.random(),

            speed:
                Math.random() *
                0.04 + 0.01,

            color
        });
    }
}


// ===============================
// DIBUJAR CORAZÓN
// ===============================

function drawHeart() {

    const rect =
        heartCanvas.getBoundingClientRect();

    const w = rect.width;
    const h = rect.height;

    hctx.clearRect(
        0,
        0,
        w,
        h
    );

    time += 0.025;

    const pulse =
        1 +
        Math.sin(time) *
        0.025;


    hctx.save();

    hctx.translate(
        w / 2,
        h / 2
    );

    hctx.scale(
        pulse,
        pulse
    );


    particles.forEach(p => {

        if (clicked) {

            // Movimiento hacia afuera
            p.x +=
                (p.x -
                p.originalX) *
                0.025;

            p.y +=
                (p.y -
                p.originalY) *
                0.025;

        } else {

            // Regresa lentamente
            p.x +=
                (p.originalX - p.x) *
                0.02;

            p.y +=
                (p.originalY - p.y) *
                0.02;
        }


        p.alpha += p.speed;

        const opacity =
            0.4 +
            Math.abs(
                Math.sin(p.alpha)
            ) * 0.6;


        hctx.beginPath();

        hctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
        );

        hctx.fillStyle =
            p.color;

        hctx.globalAlpha =
            opacity;

        hctx.shadowBlur = 8;

        hctx.shadowColor =
            p.color;

        hctx.fill();
    });


    hctx.restore();

    hctx.globalAlpha = 1;
    hctx.shadowBlur = 0;
}


// ===============================
// EXPLOSIÓN DE ESTRELLAS
// ===============================

function createExplosion() {

    const rect =
        heartCanvas.getBoundingClientRect();

    const centerX =
        rect.width / 2;

    const centerY =
        rect.height / 2;


    for (let i = 0; i < 250; i++) {

        const angle =
            Math.random() *
            Math.PI * 2;

        const speed =
            Math.random() *
            8 + 2;


        explosionParticles.push({

            x: centerX,

            y: centerY,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            size:
                Math.random() *
                3 + 1,

            life: 1,

            color:
                Math.random() > 0.5
                ? "#ff70e8"
                : "#ffffff"
        });
    }
}


function drawExplosion() {

    explosionParticles.forEach(p => {

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.97;
        p.vy *= 0.97;

        p.life -= 0.015;


        hctx.beginPath();

        hctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
        );

        hctx.globalAlpha =
            Math.max(
                p.life,
                0
            );

        hctx.fillStyle =
            p.color;

        hctx.shadowBlur = 15;

        hctx.shadowColor =
            p.color;

        hctx.fill();
    });


    explosionParticles =
        explosionParticles.filter(
            p => p.life > 0
        );

    hctx.globalAlpha = 1;
}


// ===============================
// CLICK DEL CORAZÓN
// ===============================

heartButton.addEventListener(
    "click",
    () => {

        if (clicked) return;

        clicked = true;

        document.body.classList.add(
            "finished"
        );

        tapText.style.display =
            "none";

        createExplosion();

        setTimeout(() => {

            birthdayMessage.classList.add(
                "show"
            );

        }, 500);
    }
);


// ===============================
// ANIMACIÓN
// ===============================

function animate() {

    drawStars();

    drawHeart();

    drawExplosion();

    requestAnimationFrame(
        animate
    );
}


resize();

animate();