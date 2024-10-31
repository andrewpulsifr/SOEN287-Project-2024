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
        this.form.addEventListener('submit', (e) => {
            e.preventDefault(); // prevent default event
            let error = 0;  // Initialize error counter
            this.fields.forEach((field) => {
                const input = document.querySelector(`#${field}`);
                if (this.validateFields(input) == false) {
                    error++;
                }
            });

            if (error == 0) {
                //do login api request
                localStorage.setItem('auth', this.userType);
                console.log('success');
                if(this.userType == 'client'){
                    window.location.href = "home.html";
                }
                else{
                    window.location.href = "business-home.html";
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
                } else if (field.value !== password) { // Match with preset password
                    this.setStatus(field, "Password does not match", "error");
                    return false;
                } else {
                    this.setStatus(field, null, "success");
                    return true;
                }
            }
            
            // Email validation
            if (field.type === "email") {
                if (field.value === email) { // Match with preset email
                    this.setStatus(field, null, "success");
                    return true;
                } else {
                    this.setStatus(field, "Invalid email", "error");
                    return false;
                }
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
        new Login(clientForm, fields, 'client');
    }

    if (adminForm) {
        new Login(adminForm, fields, 'admin');
    }
});
