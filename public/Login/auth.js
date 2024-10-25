class Auth {
    constructor() {
        document.querySelector("body").style.display = "none"; // default before validation
        const auth = localStorage.getItem('auth');
        this.validateAuth(auth);
    }

    validateAuth(auth){
        if (auth != 1){ 
            window.location.replace("/"); // change location
        }
        else{
            document.querySelector("body").style.display = "block"; 
        }
    }

    logout(){
        locateStorage.removeItem('auth');
        window.location.replace("/");
    }
}