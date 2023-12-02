document.addEventListener("DOMContentLoaded", attachListeners);
document.addEventListener("DOMContentLoaded", checkPage);

function attachListeners() {
    document.querySelector('.login_form')?.addEventListener('submit', login);
    let logoutButton = document.querySelector('.logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    let addButton = document.querySelector('.add_file');
    if (addButton) {
        addButton.addEventListener('click', addFile);
    }
}

function addFile() {
    let filebar = document.querySelector('.files');
    let newFileButton = document.createElement('button');
    newFileButton.textContent = 'My New File';
    newFileButton.addEventListener('click', () => console.log("Go to new note"));
    filebar.appendChild(newFileButton);
}

function checkPage() {
    let username = localStorage.getItem('username');
    if (window.location.href.includes('login.html') && username)
        window.location = 'notes.html';
    if (window.location.href.includes('notes.html') && !username)
        window.location = 'login.html';
}

function login(event) {
    event.preventDefault();

    const usernameInput = document.querySelector('.login_form input[type="text"]');
    const passwordInput = document.querySelector('.login_form input[type="password"]');

    const username = usernameInput.value;
    const password = passwordInput.value;

    const url = 'http://localhost:3000/login';

    fetch(url, { // make call to server.js to authenticate login information
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            return response.text();

        } else { // handle incorrect password
            
            passwordInput.classList.add('shake');
            passwordInput.value = '';
            setTimeout(() => passwordInput.classList.remove('shake'), 500); 
            throw new Error('Login failed. Please check your username and password.');
        }
    })
    .then(data => {
        console.log(data); // Handle the response data
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);

        window.location.href = 'notes.html'; // Redirect to notes page on successful login
    })
    .catch(error => {
        console.error('Error:', error);
    });
}



function logout(event) {
    event.preventDefault();
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    window.location.href = 'login.html';
}

function changeFontSize(change) {
    let elements = document.querySelectorAll('body *:not(.font-resize-controls, .font-resize-controls *)');
    
    elements.forEach(el => {
        let style = window.getComputedStyle(el, null).getPropertyValue('font-size');
        let fontSize = parseFloat(style); // Get current size
        el.style.fontSize = (fontSize + change) + 'px'; // Set new size
    });
}