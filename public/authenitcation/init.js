const auth = new Auth();

// Ensure this is run only when the .logout button is present
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('.logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            auth.logout();
        });
    }
});