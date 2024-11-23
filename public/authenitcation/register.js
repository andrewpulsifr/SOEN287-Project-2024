
class Register {
    constructor(form, fields) {
        this.form = form;
        this.fields = fields;
        this.userType = 'Client'; 
        this.validateOnSubmit();
    }

    validateOnSubmit() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault(); // prevent default event
            let error = 0;  // Initialize error counter
            this.fields.forEach((field) => {
                const input = document.querySelector(`#${field}`);
                if (this.validateFields(input) == false) {
                    error++;
                }
            });

            if (error === 0) {
                try {
                    const response = await fetch('http://localhost:4000/auth/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: document.querySelector('#email').value,
                            password: document.querySelector('#password').value,
                            address: document.querySelector('#address').value,
                            'first-name': document.querySelector('#FirstName').value,
                            'last-name': document.querySelector('#LastName').value,
                            userType: this.userType
                        })
                    });
    
                    const result = await response.json();
                    if (response.ok) {
                        window.location.href = "client-login.html";
                    } else {
                        console.error(result.message);
                        alert(result.message);
                    }
                } catch (err) {
                    console.error('Error:', err);
                    alert('Something went wrong!');
                }
            }
        });
    }

    validateFields(field) {
        const fieldName = field.getAttribute("name")
            .replace(/([A-Z])/g, ' $1') // Split camelCase into words
            .trim()
            .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
    
        if (field.value.trim() === "") {
            this.setStatus(field, `${fieldName} cannot be blank`, "error");
            return false;
        } else {
            // Email Validation
            if (field.type === "email") {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    this.setStatus(field, "Invalid email address", "error");
                    return false;
                }
            }
    
            // Password Validation
            if (field.type === "password") {
                const passwordRegex = /^(?=.*\d).{8,}$/; // At least 8 characters and at least one number
                if (!passwordRegex.test(field.value)) {
                    this.setStatus(field, "Password must be at least 8 characters and include a number", "error");
                    return false;
                }
            }
    
            // Address Validation
            if (field.name === "address" && field.value.length < 10) {
                this.setStatus(field, "Address must be at least 10 characters long", "error");
                return false;
            }
    
            // Name Validation
            if ((field.name === "FirstName" || field.name === "LastName") && !/^[A-Za-z\s]+$/.test(field.value)) {
                this.setStatus(field, `${fieldName} must only contain letters`, "error");
                return false;
            }
    
            // No issues
            this.setStatus(field, null, "success");
            return true;
        }
    }
    

    setStatus(field, message, status) {
        const errorMessage = document.querySelector(`.error-message[data-error-for="${field.id}"]`);
        if (status === "error") {
            errorMessage.innerText = message;
            errorMessage.classList.add("input-error");
        } else if (status === "success") {
            if (errorMessage) {
                errorMessage.innerText = ""; // Clear the message
            }
            errorMessage.classList.remove("input-error");
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const clientForm = document.querySelector(".sign-up-form");
    const fields = ["LastName","FirstName","address","email", "password"];

    new Register(clientForm, fields);
});

