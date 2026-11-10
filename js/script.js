
document.addEventListener("DOMContentLoaded", () => {
    const loading = document.getElementById("loading");
    const dashboard = document.getElementById("page-content");
    const clock = document.getElementById("clock");
    const cameraPreview = document.getElementById("camera-preview");

    // Solicitar permiso y mostrar la cámara en el panel visual.
    if (cameraPreview && navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then((stream) => {
                cameraPreview.srcObject = stream;
            })
            .catch((error) => {
                console.error("No se pudo iniciar la cámara:", error);
                cameraPreview.setAttribute("aria-label", "No se pudo acceder a la cámara");
            });
    } else if (cameraPreview) {
        cameraPreview.setAttribute("aria-label", "La cámara requiere un navegador compatible y una conexión segura");
    }

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
