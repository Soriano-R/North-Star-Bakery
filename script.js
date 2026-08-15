"use strict";

const bakeryProducts = [
    { id: "country-sourdough", name: "Country Sourdough" },
    { id: "butter-croissant", name: "Butter Croissant" },
    { id: "celebration-cake", name: "Celebration Cake" },
    { id: "signature-loaf", name: "Signature Loaf" }
];

const storageKeys = {
    favorites: "northStarBakeryFavorites",
    contactDraft: "northStarBakeryContactDraft"
};

function readStoredArray(key) {
    try {
        const storedValue = JSON.parse(localStorage.getItem(key));
        return Array.isArray(storedValue) ? storedValue : [];
    } catch (error) {
        return [];
    }
}

function productName(productId) {
    const product = bakeryProducts.find((item) => item.id === productId);
    return product ? product.name : "Bakery item";
}

function initializeFavorites() {
    const favoritesList = document.querySelector("#favorites-list");
    if (!favoritesList) {
        return;
    }

    let favorites = readStoredArray(storageKeys.favorites).filter((id) =>
        bakeryProducts.some((product) => product.id === id)
    );

    function saveFavorites() {
        localStorage.setItem(storageKeys.favorites, JSON.stringify(favorites));
    }

    function renderFavorites() {
        const emptyMessage = document.querySelector("#favorites-empty");
        const preorderLink = document.querySelector("#favorites-preorder-link");
        favoritesList.replaceChildren();

        favorites.forEach((productId) => {
            const item = document.createElement("li");
            item.textContent = productName(productId);
            favoritesList.append(item);
        });

        emptyMessage.hidden = favorites.length > 0;
        preorderLink.hidden = favorites.length === 0;

        document.querySelectorAll("[data-favorite-id]").forEach((button) => {
            const productId = button.dataset.favoriteId;
            const isFavorite = favorites.includes(productId);
            button.setAttribute("aria-pressed", String(isFavorite));
            button.textContent = isFavorite
                ? `Remove ${productName(productId)} from Favorites`
                : `Add ${productName(productId)} to Favorites`;
        });
    }

    document.querySelectorAll("[data-favorite-id]").forEach((button) => {
        button.addEventListener("click", () => {
            const productId = button.dataset.favoriteId;
            favorites = favorites.includes(productId)
                ? favorites.filter((id) => id !== productId)
                : [...favorites, productId];
            saveFavorites();
            renderFavorites();
        });
    });

    renderFavorites();
}

function todayAsInputValue() {
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
    return localDate.toISOString().split("T")[0];
}

function initializeRequestForm() {
    const form = document.querySelector("#request-form");
    if (!form) {
        return;
    }

    const fields = {
        name: form.elements.name,
        email: form.elements.email,
        pickupDate: form.elements["pickup-date"],
        itemDetails: form.elements["item-details"]
    };

    fields.pickupDate.min = todayAsInputValue();

    function showError(field, message) {
        const errorElement = document.querySelector(`#${field.id}-error`);
        field.classList.toggle("field-error", Boolean(message));
        field.setAttribute("aria-invalid", String(Boolean(message)));
        if (errorElement) {
            errorElement.textContent = message;
        }
        return !message;
    }

    function validateName() {
        const value = fields.name.value.trim();
        return showError(fields.name, value.length >= 2 ? "" : "Please enter at least 2 characters for your name.");
    }

    function validateEmail() {
        const value = fields.email.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return showError(fields.email, emailPattern.test(value) ? "" : "Please enter a complete email address, such as name@example.com.");
    }

    function validatePickupDate() {
        const value = fields.pickupDate.value;
        const message = !value
            ? "Please select a requested pickup date."
            : value < todayAsInputValue()
                ? "Please choose today or a future date."
                : "";
        return showError(fields.pickupDate, message);
    }

    function validateDetails() {
        const value = fields.itemDetails.value.trim();
        return showError(fields.itemDetails, value.length >= 10 ? "" : "Please add at least 10 characters of item details.");
    }

    function validateRequestType() {
        const selectedType = form.querySelector('input[name="request-type"]:checked');
        const errorElement = document.querySelector("#request-type-error");
        errorElement.textContent = selectedType ? "" : "Please choose preorder or general question.";
        return Boolean(selectedType);
    }

    function saveDraft() {
        const selectedType = form.querySelector('input[name="request-type"]:checked');
        const draft = {
            name: fields.name.value,
            email: fields.email.value,
            requestType: selectedType ? selectedType.value : ""
        };
        localStorage.setItem(storageKeys.contactDraft, JSON.stringify(draft));
    }

    function loadDraft() {
        try {
            const draft = JSON.parse(localStorage.getItem(storageKeys.contactDraft));
            if (!draft || typeof draft !== "object") {
                return;
            }
            fields.name.value = draft.name || "";
            fields.email.value = draft.email || "";
            const requestType = form.querySelector(`input[name="request-type"][value="${draft.requestType}"]`);
            if (requestType) {
                requestType.checked = true;
            }
        } catch (error) {
            localStorage.removeItem(storageKeys.contactDraft);
        }
    }

    [fields.name, fields.email].forEach((field) => field.addEventListener("input", saveDraft));
    form.querySelectorAll('input[name="request-type"]').forEach((field) => field.addEventListener("change", saveDraft));

    fields.name.addEventListener("blur", validateName);
    fields.email.addEventListener("blur", validateEmail);
    fields.pickupDate.addEventListener("change", validatePickupDate);
    fields.itemDetails.addEventListener("blur", validateDetails);

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const checks = [validateName(), validateEmail(), validatePickupDate(), validateRequestType(), validateDetails()];
        const formStatus = document.querySelector("#form-status");

        if (checks.every(Boolean)) {
            saveDraft();
            formStatus.textContent = "Your request is ready to send. We will contact you to confirm availability.";
        } else {
            formStatus.textContent = "";
            form.querySelector(".field-error")?.focus();
        }
    });

    loadDraft();
}

initializeFavorites();
initializeRequestForm();
