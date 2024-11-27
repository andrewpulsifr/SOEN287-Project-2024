import { fetchWrapper } from './fetchHandler/fetchWrapper.js';

const token = localStorage.getItem('accessToken');
console.log('JWT token:', token);

// Function to fetch user data
async function fetchUser() {
    try {
        const url = '/users/get-user'; 
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };

        const response = await fetchWrapper(url, options);
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        console.log('Fetched User Data:', userData);

        const email = userData.Email || 'No email provided';
        const password = userData.Password || ''; 

        // Populate user data in the form
        document.getElementById('email').value = email;

    } catch (error) {
        console.error('Error fetching user data:', error);
        alert('An error occurred while fetching user data. Please try again later.');
    }
}

// Function to fetch client data
async function fetchClient() {
    try {
        const url = '/users/get-client'; 
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };

        const response = await fetchWrapper(url, options);
        if (!response.ok) {
            throw new Error('Failed to fetch client data');
        }

        const clientData = await response.json();
        console.log('Fetched Client Data:', clientData);

        const firstName = clientData.FirstName || '';
        const lastName = clientData.LastName || '';
        const address = clientData.Address || '';

        // Populate client data in the form
        document.getElementById('firstName').value = firstName;
        document.getElementById('lastName').value = lastName;
        document.getElementById('address').value = address;

    } catch (error) {
        console.error('Error fetching client data:', error);
        alert('An error occurred while fetching client data. Please try again later.');
    }
}

// Function to save profile data
async function saveProfile(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const address = document.getElementById('address').value;

    const profileData = {
        client: {
            firstName: firstName || undefined, 
            lastName: lastName || undefined,
            address: address || undefined
        }
    };

    try {
        const updateResponse = await fetchWrapper('/users/profile/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
        });

        if (!updateResponse.ok) {
            throw new Error('Failed to update client profile');
        }

        const updatedClientData = await updateResponse.json();
        alert('Profile updated successfully');

        // Update the view with the updated profile data
        document.getElementById('email').value = updatedClientData.user?.Email || 'No email provided';
        document.getElementById('firstName').value = updatedClientData.client?.FirstName || '';
        document.getElementById('lastName').value = updatedClientData.client?.LastName || '';
        document.getElementById('address').value = updatedClientData.client?.Address || '';
        window.location.reload();
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('An error occurred while updating your profile.');
    }
}

async function deleteAccount() {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        try {
            const response = await fetchWrapper('/users/profile/delete', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete account.');
            }

            alert('Account deleted successfully.');

            // Clear any stored tokens or user data
            
            // Redirect the user to the login page
            window.location.href = '/client-login.html';
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('An error occurred while deleting your account. Please try again later.');
        }
    }
}

// Attach event listeners to fetch the profile and save it
document.addEventListener('DOMContentLoaded', () => {
    fetchUser();
    fetchClient(); // Assuming you want to fetch client data separately

    const editProfileForm = document.getElementById('editProfileForm');
    editProfileForm.addEventListener('submit', saveProfile);

    
    const deleteAccountButton = document.getElementsByClassName('delete-btn')[0];
    deleteAccountButton.addEventListener('click', deleteAccount);
});