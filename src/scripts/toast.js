export function toast(color, text) {
  const toastContainer = document.querySelector(".toast__container");
  const toastParagraph = document.querySelector(".toast__container p");

  toastParagraph.innerText = text;

  toastContainer.style = `background-color: ${color}; border-color: ${color}`;

  toastContainer.classList.remove("hidden");

  setTimeout(() => {
    toastContainer.classList.add("toast__fadeOut");
  }, 3000);

  setTimeout(() => {
    toastContainer.classList.remove("toast__fadeOut");
    toastContainer.classList.add("hidden");
  }, 3990);
}
