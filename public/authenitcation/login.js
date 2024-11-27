class Login {
    constructor(form, fields, userType) {
        this.form = form;
        this.fields = fields;
        this.userType = userType;
        this.validateOnSubmit();
    }

    validateOnSubmit() {
        this.form.addEventListener('submit', async (e) => {
            console.log("Submit")
            e.preventDefault(); // Prevent default form submission
            let error = 0; // Initialize error counter
    
            // Validate fields
            this.fields.forEach((field) => {
                const input = document.querySelector(`#${field}`);
                console.log(input);
                if (!this.validateFields(input)) {
                    error++;
                }
            });
    
            if (error === 0) {
                console.log("0 errors");
                try {
                    const response = await fetch('http://localhost:4000/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: document.querySelector('#email').value,
                            password: document.querySelector('#password').value,
                            userType: this.userType
                        })
                    });
    
                    // Extract tokens and user role from the response
                    const result = await response.json();
                    if (response.ok) {
                        const { accessToken, refreshToken, role } = result || {};  // Fallback to an empty object if result is undefined
                        if (!accessToken || !refreshToken || !role) {
                            console.error('Missing tokens or role in the response');
                            alert('Unexpected server response');
                            return;
                        }
                        // Store tokens and role in localStorage
                        localStorage.setItem('accessToken', accessToken);
                        localStorage.setItem('refreshToken', refreshToken);
                        localStorage.setItem('auth', role);
        
                        // Redirect based on user role
                        if (role === 'Client') {
                            window.location.href = "home.html";
                        } else if (role === 'Admin') {
                            window.location.href = "business-home.html";
                        }
                    }else {
                        const emailField = document.querySelector(`#${this.fields[0]}`);
                        const passwordField = document.querySelector(`#${this.fields[1]}`);
                        this.setStatus(emailField, "Invalid email or password.", "error");
                        this.setStatus(passwordField, "Invalid email or password.", "error");
                    }
                } catch (error) {
                    console.error('Error:', error.message);
                    alert('Something went wrong. Check error stack.');
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
            // Email validation
            if (field.type === "email") {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
        if (status === "error") {
            errorMessage.innerText = message;
            errorMessage.classList.add("input-error");
            errorMessage.style.display = "block";
        } else if (status === "success") {
            if (errorMessage) {
                errorMessage.innerText = "";
                errorMessage.classList.remove("input-error");
                errorMessage.style.display = "none";
            }
        }
    }
}

// Initialize login forms
document.addEventListener('DOMContentLoaded', () => {
    const clientForm = document.querySelector(".client-login-form");
    const adminForm = document.querySelector(".admin-login-form");
    const fields = ["email", "password"];

    if (clientForm) {
        console.log("Client login form loaded")
        new Login(clientForm, fields, 'Client');
    }

    if (adminForm) {
        new Login(adminForm, fields, 'Admin');
    }
});