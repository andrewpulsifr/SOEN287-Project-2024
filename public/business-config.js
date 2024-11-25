document.querySelector(".form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        primaryColor: document.getElementById("primaryColor").value,
        secondaryColor: document.getElementById("secondaryColor").value,
        accentColor: document.getElementById("accentColor").value,
    };

    try {
        const response = await fetch('/submit-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
});
