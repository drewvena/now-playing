async function editFormHandler(event) {
    event.preventDefault();

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length-1
    ];
    const username = document.querySelector('#profile-username').value;
    const email = document.querySelector('#profile-email').value;
    const location = document.querySelector('#profile-location').value;
    const bio = document.querySelector('#profile-bio').value;
    console.log(id, username, email, location, bio);
    const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            username,
            email,
            location,
            bio
            }),
            headers: {
            'Content-Type': 'application/json'
        }
    });

    if(response.ok){
        document.location.replace('/profile/user');
    } else {
        alert("Failed to edit profile... Please check that your input info is valid and try again.");
    }

    }

document.querySelector('.edit-profile-form').addEventListener('submit', editFormHandler);