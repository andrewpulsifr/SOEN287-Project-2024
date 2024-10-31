const auth = new Auth();

// Ensure this is run only when the .logout button is present
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('.logout');
    const deleteButton = document.querySelector('.delete-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            auth.logout();
        });
    }
    if (deleteButton) {
        deleteButton.addEventListener('click', (e) => {
            auth.logout();
        });
    }
});