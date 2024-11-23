class Auth {
    constructor() {
        document.querySelector("body").style.display = "none"; // default before validation
        const auth = localStorage.getItem('auth');
        this.validateAuth(auth);
    }

    validateAuth(auth){
        if (!auth) {  // If no role is set, redirect to homepage
            window.location.replace("/"); 
        } else if (auth === 'Client' || auth === 'Admin') {
            document.querySelector("body").style.display = "block"; // Show page for valid users
            document.dispatchEvent(new Event('authInitialized'));
        } else {
            // Any other roles or unknown values would redirect to the homepage
            window.location.replace("/");
        }
    }

    logout(){
        localStorage.removeItem('auth');
        window.location.replace("client-login.html");
    }

    async deleteAccount() {
        const userId = localStorage.getItem('userId'); // Get user ID from localStorage
        try {
            const response = await fetch(`/users/${userId}`, { // Call backend delete route
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                localStorage.removeItem('auth'); // Clear localStorage
                localStorage.removeItem('userId');
                window.location.replace("client-login.html");
            } else {
                console.error('Failed to delete account:', await response.text());
            }
        } catch (err) {
            console.error('Error deleting account:', err);
        }
    }

}