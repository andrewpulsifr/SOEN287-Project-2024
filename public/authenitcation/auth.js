class Auth {
    constructor() {
        document.querySelector("body").style.display = "none"; // default before validation
        const auth = localStorage.getItem('auth');
        this.validateAuth(auth);
    }

    validateAuth(auth){
        if (!auth) {  // If no role is set, redirect to homepage
            window.location.replace("/"); 
        } else if (auth === 'client' || auth === 'admin') {
            document.querySelector("body").style.display = "block"; // Show page for valid users
        } else {
            // Any other roles or unknown values would redirect to the homepage
            window.location.replace("/");
        }
    }

    logout(){
        localStorage.removeItem('auth');
        window.location.replace("client-login.html");
    }
}