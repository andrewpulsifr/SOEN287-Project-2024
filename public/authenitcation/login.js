const password = 'password';
const email = 'email';

class Login {
    constructor(form, fields, userType) {
        this.form = form;
        this.fields = fields;
        this.userType = userType;
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
                    const response = await fetch('http://localhost:4000/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: document.querySelector('#username').value,
                            password: document.querySelector('#password').value,
                            userType: this.userType
                        })
                    });
    
                    const result = await response.json();
                    if (response.ok) {
                        localStorage.setItem('auth', result.role); // Store user role
                        if (result.role === 'Client') {
                            window.location.href = "home.html";
                        } else if (result.role === 'Admin') {
                            window.location.href = "business-home.html";
                        }
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
        const fieldName = field.getAttribute("name").charAt(0).toUpperCase() + field.getAttribute("name").slice(1); // Capitalize field name
        if (field.value.trim() === "") {
            this.setStatus(field, `${fieldName} cannot be blank`, "error");
            return false;
        } else {
            // Password validation
            if (field.type === "password") {
                if (field.value.length < 8) {
                    this.setStatus(field, "Password must be at least 8 characters long", "error");
                    return false;
                } else {
                    this.setStatus(field, null, "success");
                    return true;
                }
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // Email validation
            if (field.type === "email") {
                if (!emailRegex.test(field.value)) {
                    this.setStatus(field, "Invalid email address", "error");
                    return false;
                }

                this.setStatus(field, null, "success");
                return true;
            
            }
        }
    }
    

    setStatus(field, message, status) {
        const errorMessage = field.parentElement.nextElementSibling;
        if (status == "error") {
            errorMessage.innerText = message;
            errorMessage.classList.add("input-error");
        } else if(status == "success") {
            if(errorMessage){
                errorMessage.innerText = ""; // Clear the error message when the field is valid
            }
            errorMessage.classList.remove("input-error");
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const clientForm = document.querySelector(".client-login-form");
    const adminForm = document.querySelector(".admin-login-form");
    const fields = ["username", "password"];

    if (clientForm) {
        new Login(clientForm, fields, 'Client');
    }

    if (adminForm) {
        new Login(adminForm, fields, 'Admin');
    }
});
