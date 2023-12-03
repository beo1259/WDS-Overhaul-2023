
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const username = this.username.value; // getting username value
    const password = this.password.value; // getting password value

    
    const url = 'http://localhost:3000/adduser';

    fetch(url, { // make post request to adduser endpoint, to store user
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.text())
    .then(data => {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        window.location.href = 'notes.html';
        alert(data); // Show response from the server
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

