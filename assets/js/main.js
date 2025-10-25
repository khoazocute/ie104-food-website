// main.js — controls the cart popup overlay
document.addEventListener("DOMContentLoaded", () => {
    const cartBtn = document.getElementById("cart-btn");
    const cartPopup = document.getElementById("cart-popup");
    const closeCart = document.getElementById("close-cart");

    if (!cartBtn || !cartPopup) return; // safety check

    // When the cart icon is clicked -> show overlay
    cartBtn.addEventListener("click", () => {
        cartPopup.style.display = "flex";
    });

    // When "close" button clicked -> hide overlay
    closeCart.addEventListener("click", () => {
        cartPopup.style.display = "none";
    });

    // Optional: click outside the box closes the cart
    cartPopup.addEventListener("click", (e) => {
        if (e.target === cartPopup) {
            cartPopup.style.display = "none";
        }
    });
});