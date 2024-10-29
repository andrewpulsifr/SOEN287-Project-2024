const password = 'password';
const email = 'password';

class Login {
    constructor(form, fields) {
        this.form = form;
        this.fields = fields;
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
                localStorage.setItem('auth',1);
                console.log('success');
                window.location.href = "../home.html";
            }
        });
    }

    validateFields(field) {
        const fieldName = field.getAttribute("name").charAt(0).toUpperCase() + field.getAttribute("name").slice(1); // Capitalize field name (e.g., 'Username')
        console.log(field);
        if (field.value.trim() === "") {
            this.setStatus(
                field,
                `${fieldName} cannot be blank`,
                "error"
            );
            return false;
        } else {
            if(field.type == "password") {
                if(field.value.length < 8) {
                    this.setStatus(
                        field,
                        "Password must be at least 8 characters long",
                        "error"
                    );
                    return false;
                }
                else{
                    this.setStatus(field,null,"success");
                    return true;
                } 
            }
            else{
                if(field.type == "password"){
                    if(field.value == password){
                        this.setStatus(field,null,"success");
                        return true;
                    }
                    else{
                        this.setStatus(
                            field,
                            "Password does not match",
                            "error"
                        );
                        return false;
                    }
                }
                if(field.type == "email"){
                    this.setStatus(field,null,"success");
                    return true;
                }
                else{
                    this.setStatus(
                        field,
                        "Invalid email",
                        "error"
                    );
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

const form = document.querySelector(".client-login-form");
if (form) {
    const fields = ["username", "password"];
    const validator = new Login(form, fields);
}
