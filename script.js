document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const form = document.getElementById('contactForm');
const formStatusMessage = document.getElementById('formStatusMessage');
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    submitButton.classList.add('opacity-70', 'cursor-not-allowed');

    formStatusMessage.textContent = '';
    formStatusMessage.classList.remove('show', 'text-green-400', 'text-red-400');

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            formStatusMessage.textContent = 'Message sent successfully! I will get back to you shortly.';
            formStatusMessage.classList.add('show', 'text-green-400');
            form.reset();
        } else {
            const data = await response.json();
            if (Object.hasOwnProperty.call(data, 'errors')) {
                formStatusMessage.textContent = `Error: ${data["errors"].map(error => error["message"]).join(", ")}`;
            } else {
                formStatusMessage.textContent = 'Oops! There was a problem submitting your message. Please try again.';
            }
            formStatusMessage.classList.add('show', 'text-red-400');
        }
    } catch (error) {
        formStatusMessage.textContent = 'Network error. Please check your internet connection and try again later.';
        formStatusMessage.classList.add('show', 'text-red-400');
        console.error('Form submission error:', error);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
        submitButton.classList.remove('opacity-70', 'cursor-not-allowed');
        setTimeout(() => {
            formStatusMessage.classList.remove('show', 'text-green-400', 'text-red-400');
            formStatusMessage.textContent = '';
        }, 5000);
    }
});