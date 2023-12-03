document.addEventListener("DOMContentLoaded", attachListeners);
document.addEventListener("DOMContentLoaded", checkPage);
document.addEventListener("DOMContentLoaded", attachListeners);
document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add('fade-in');
    attachListeners();
    checkPage();
});

let lastScrollTop = 0;

window.addEventListener("scroll", function () {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll <= 0) {
        document.querySelector('.navbar').classList.remove('scroll-down');
        document.querySelector('.navbar').classList.add('scroll-up');
    } else if (currentScroll > lastScrollTop) {
        document.querySelector('.navbar').classList.add('scroll-down');
        document.querySelector('.navbar').classList.remove('scroll-up');
    } else {
        document.querySelector('.navbar').classList.add('scroll-up');
        document.querySelector('.navbar').classList.remove('scroll-down');
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, false);



var navbar = document.querySelector('.navbar');

function showNavbarOnMouseApproach(event) {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll <= 0) {
        return;
    }

    if (event.clientY <= 100) {
        navbar.classList.add('scroll-up');
        navbar.classList.remove('scroll-down');
    } else {
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    }
}

document.addEventListener('mousemove', showNavbarOnMouseApproach);


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

    const navLinks = document.querySelectorAll('.navbar a:not(.logout)');
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const destination = this.getAttribute('href');

            document.body.classList.add('fade-out');

            setTimeout(() => {
                window.location.href = destination;
            }, 0);
        });
    });


}

document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');

    inputs.forEach(input => {
        const defaultPlaceholder = input.placeholder;

        input.addEventListener('focus', function () {
            this.placeholder = '';
        });

        input.addEventListener('blur', function () {
            if (this.value.trim() === '') {
                this.placeholder = defaultPlaceholder;
            }
        });
    });
});


function resetFontSize() {
    let elements = document.querySelectorAll('body, body *:not(.font-resize-controls, .font-resize-controls *)');
    elements.forEach(el => {
        el.style.fontSize = '';
    });
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

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => {
            if (response.ok) {
                return response.text();

            } else {

                passwordInput.classList.add('shake');
                passwordInput.value = '';
                setTimeout(() => passwordInput.classList.remove('shake'), 500);
                throw new Error('Login failed. Please check your username and password.');
            }
        })
        .then(data => {
            console.log(data);
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);

            window.location.href = 'notes.html';
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
    let baseFontSize = localStorage.getItem('baseFontSize');
    if (!baseFontSize) {
        let style = window.getComputedStyle(document.body, null).getPropertyValue('font-size');
        baseFontSize = parseFloat(style);
        localStorage.setItem('baseFontSize', baseFontSize);
    }

    let newFontSize = parseFloat(baseFontSize) + change;

    document.body.style.fontSize = newFontSize + 'px';

    localStorage.setItem('baseFontSize', newFontSize);
}

document.addEventListener('DOMContentLoaded', function () {
    const baseFontSize = localStorage.getItem('baseFontSize');
    if (baseFontSize) {
        document.body.style.fontSize = baseFontSize + 'px';
    }
});

function resetFontSize() {
    localStorage.removeItem('baseFontSize');
    
    document.body.style.fontSize = ''; 

    let elements = document.querySelectorAll('body, body *');
    elements.forEach(el => {
        el.style.fontSize = ''; 
    });
}



document.addEventListener('DOMContentLoaded', function () {
    var starterBtn = document.getElementById('starterBtn');
    var premiumBtn = document.getElementById('premiumBtn');
    var enterpriseBtn = document.getElementById('enterpriseBtn');

    var starterModal = document.getElementById('starterPlanModal');
    var premiumModal = document.getElementById('premiumPlanModal');
    var enterpriseModal = document.getElementById('enterprisePlanModal');

    var closeSpans = document.getElementsByClassName('close');

    function openModal(modal) {
        modal.classList.add('show');
        modal.classList.remove('hide');
        modal.style.display = 'block';
    }

    function closeModal(modal) {
        modal.classList.add('hide');
        modal.addEventListener('animationend', function () {
            modal.style.display = 'none';
            modal.classList.remove('show');
            modal.classList.remove('hide');
        }, { once: true });
    }

    if (starterBtn) {
        starterBtn.onclick = function () {
            openModal(starterModal);
        };
    }

    if (premiumBtn) {
        premiumBtn.onclick = function () {
            openModal(premiumModal);
        };
    }

    if (enterpriseBtn) {
        enterpriseBtn.onclick = function () {
            openModal(enterpriseModal);
        };
    }

    Array.from(closeSpans).forEach(function (span) {
        span.onclick = function () {
            closeModal(this.parentElement.parentElement);
        };
    });

    window.onclick = function (event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    };

    var gettingStartedBtn = document.getElementById('gettingStartedBtn');
    var accountManagementBtn = document.getElementById('accountManagementBtn');
    var troubleshootingBtn = document.getElementById('troubleshootingBtn');

    var gettingStartedModal = document.getElementById('gettingStartedModal');
    var accountManagementModal = document.getElementById('accountManagementModal');
    var troubleshootingModal = document.getElementById('troubleshootingModal');



    if (gettingStartedBtn) {
        gettingStartedBtn.onclick = function () {
            openModal(gettingStartedModal);
        };
    }

    if (accountManagementBtn) {
        accountManagementBtn.onclick = function () {
            openModal(accountManagementModal);
        };
    }

    if (troubleshootingBtn) {
        troubleshootingBtn.onclick = function () {
            openModal(troubleshootingModal);
        };
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const readAloudButton = document.getElementById('readAloudButton');

    readAloudButton.addEventListener('click', function () {
        readPageAloud();
    });
});

let isReading = false;
let speech;

function readPageAloud() {
    if (isReading) {
        window.speechSynthesis.cancel();
        isReading = false;
        return;
    }

    let textToRead = window.getSelection().toString().trim() !== "" ?
        window.getSelection().toString() :
        document.body.innerText;

    speech = new SpeechSynthesisUtterance(textToRead);
    window.speechSynthesis.speak(speech);
    isReading = true;

    speech.onend = function () {
        isReading = false;
    };
}

function toggleNavbarImages() {
    var images = document.querySelectorAll('.navbar .navbar-icons');

    // Check if the images are currently shown or not
    var imagesShown = localStorage.getItem('navbarImagesShown') === 'true';

    images.forEach(function(img) {
        if (imagesShown) {
            img.style.display = 'none';
        } else {
            img.style.display = 'inline';
        }
    });

    // Save the new state
    localStorage.setItem('navbarImagesShown', !imagesShown);
}

document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.navbar .navbar-icons');
    const imagesShown = localStorage.getItem('navbarImagesShown') === 'true';

    images.forEach(function(img) {
        img.style.display = imagesShown ? 'inline' : 'none';
    });

});
