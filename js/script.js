setTimeout(() => {

    const loader = document.getElementById("loading");
    const content = document.getElementById("page-content");

    loader.classList.add("slide-up");

    loader.addEventListener("transitionend", () => {

        loader.style.display = "none";
        content.style.display = "block";

    });

},3000);