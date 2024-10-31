const auth = new Auth();

function initializePage() {
    console.log("Page initialization");

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
    // Dispatch event indicating init is complete
    document.dispatchEvent(new Event('initComplete'));
}

document.addEventListener("DOMContentLoaded", initializePage);
