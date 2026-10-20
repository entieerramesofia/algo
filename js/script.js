
document.addEventListener("DOMContentLoaded", () => {
    const loading = document.getElementById("loading");
    const dashboard = document.getElementById("page-content");
    const clock = document.getElementById("clock");

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
    window.setInterval(updateClock, 1000);

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
