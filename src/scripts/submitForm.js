export default function initializeForm(
  GHL_WEBHOOK_URL,
  RECAPTCHA_SITE_KEY,
  REDIRECT_URL,
) {
  async function submitForm(e) {
    e.preventDefault();

    try {
      const recaptchaToken = await grecaptcha.execute(RECAPTCHA_SITE_KEY, {
        action: "submit",
      });

      const recaptchaResponse = await fetch("/recaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recaptcha: recaptchaToken }),
      });

      const gResponse = await recaptchaResponse.json();

      if (gResponse.success) {
        await submitToGHL();
      } else {
        alert("Form submission failed. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred during form submission:", error);
    }
  }

  async function submitToGHL() {
    const formData = new FormData(form);

    const confirmEmailValue = formData.get("confirm-email");
    if (!confirmEmailValue) {
      form.action = GHL_WEBHOOK_URL;
    }

    const combinedData = new Map();

    for (const [key, value] of formData.entries()) {
      if (combinedData.has(key)) {
        combinedData.set(key, `${combinedData.get(key)}, ${value}`);
      } else {
        combinedData.set(key, value);
      }
    }

    const finalFormData = new URLSearchParams(combinedData);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: finalFormData,
      });

      if (response.ok) {
        window.location.href = REDIRECT_URL;
      } else {
        console.error("Form submission failed:", response.statusText);
      }
    } catch (error) {
      console.error("Network error occurred while submitting the form:", error);
    }
  }

  const form = document.getElementById("form");
  form.addEventListener("submit", submitForm);
}
