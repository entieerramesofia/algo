
document.addEventListener("DOMContentLoaded", () => {
    const loading = document.getElementById("loading");
    const dashboard = document.getElementById("page-content");
    const clock = document.getElementById("clock");
    const cameraPreview = document.getElementById("camera-preview");

    // Solicitar permiso y mostrar la cámara al cargar index.html.
    async function startCamera() {
        if (!cameraPreview) return;

        if (!navigator.mediaDevices?.getUserMedia) {
            cameraPreview.setAttribute("aria-label", "La cámara requiere HTTPS o localhost y un navegador compatible");
            console.error("La cámara requiere HTTPS o localhost y un navegador compatible.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            cameraPreview.srcObject = stream;
            await cameraPreview.play();
        } catch (error) {
            console.error("No se pudo iniciar la cámara:", error);
            cameraPreview.setAttribute("aria-label", "Permite el acceso a la cámara para ver la transmisión");
        }
    }

    startCamera();

    // Mostrar la interfaz después de iniciar el sistema
    window.setTimeout(() => {
        loading?.classList.add("hidden");
        dashboard?.classList.add("ready");
    }, 900);

    // Reloj digital
    function updateClock() {
        if (!clock) return;

        clock.textContent = new Date().toLocaleTimeString("es-MX", {
            hour12: false
        });
    }

    updateClock();
    window.setInterval(updateClock, 9000);

    // Botones del panel de control
    const controlButtons = document.querySelectorAll(
        ".control-grid button"
    );

    controlButtons.forEach((button) => {
        button.addEventListener("click", () => {
            controlButtons.forEach((item) => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            const mode = button.dataset.mode;
            console.log("Módulo seleccionado:", mode);
        });
    });
});
