document.addEventListener('DOMContentLoaded', document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const passwordForm = document.getElementById('passwordForm');
    const updateProfileBtn = document.getElementById('updateProfileBtn');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const updateNotificationsBtn = document.getElementById('updateNotificationsBtn');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');

    // Fetch current user data on page load
    const fetchUserData = async () => {
        try {
            const response = await fetch('http://localhost:5000/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            if (response.ok) {
                const userData = await response.json();
                document.getElementById('username').value = userData.username;
                document.getElementById('email').value = userData.email;
                document.getElementById('emailNotifications').checked = userData.emailNotifications;
            } else {
                alert('Failed to load user data.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    // Update profile information
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;

        try {
            const response = await fetch('http://localhost:5000/user/updateProfile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({ username, email }),
            });

            if (response.ok) {
                alert('Profile updated successfully');
            } else {
                alert('Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred. Please try again later.');
        }
    });

    // Change password
    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/user/changePassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (response.ok) {
                alert('Password changed successfully');
            } else {
                alert('Failed to change password.');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('An error occurred. Please try again later.');
        }
    });

    // Update email notification preferences
    updateNotificationsBtn.addEventListener('click', async () => {
        const emailNotifications = document.getElementById('emailNotifications').checked;

        try {
            const response = await fetch('http://localhost:5000/user/updateNotifications', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({ emailNotifications }),
            });

            if (response.ok) {
                alert('Notification preferences updated');
            } else {
                alert('Failed to update notification preferences.');
            }
        } catch (error) {
            console.error('Error updating notifications:', error);
            alert('An error occurred. Please try again later.');
        }
    });

    // Delete user account
    deleteAccountBtn.addEventListener('click', async () => {
        const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');

        if (confirmDelete) {
            try {
                const response = await fetch('http://localhost:5000/user/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });

                if (response.ok) {
                    alert('Account deleted successfully');
                    window.location.href = '/login'; // Redirect to login page after deletion
                } else {
                    alert('Failed to delete account.');
                }
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('An error occurred. Please try again later.');
            }
        }
    });

    // Initialize the account settings page by fetching user data
    fetchUserData();
});
);
