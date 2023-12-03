document.addEventListener('DOMContentLoaded', function () {

    let username = localStorage.getItem('username');
    if (username) {
        fetch(`/retrievefiles?username=${username}`)
            .then(response => response.json())
            .then(files => {
                let fileList = document.querySelector('.file-list');
                files.forEach(file => {
                    let fileElement = document.createElement('div');
                    fileElement.textContent = file.filename;
                    fileElement.addEventListener('click', () => loadFileContent(file.filename));
                    fileList.appendChild(fileElement);
                });
            });
    }

    document.getElementById('deleteNoteButton').addEventListener('click', deleteFileContent);
    document.getElementById('saveNoteButton').addEventListener('click', saveFileContent);
    document.querySelector('.add-file-btn').addEventListener('click', addNewFile);
});

function loadFileContent(filename) {
    fetch(`/retrievefilecontent?filename=${filename}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                // Assuming the server returns an array of objects and the file content is in the 'file_content' property
                document.getElementById('noteInput').value = data[0].file_content;
            } else {
                // Handle case where no content is returned
                document.getElementById('noteInput').value = "No content available.";
            }
            document.getElementById('currentFileName').value = filename;
        })
        .catch(error => {
            console.error('Error loading file content:', error);
            // Handle the error appropriately
        });
}


function saveFileContent() {
    let filename = document.getElementById('currentFileName').value;
    let fileContent = document.getElementById('noteInput').value;
    let username = localStorage.getItem('username');
    

    fetch('/alterfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, filename, file_content: fileContent })
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Parse as JSON only if the response is OK
        } else {
            // Handle non-JSON responses or server-side errors
            return response.text().then(text => { throw new Error(text) });
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // or response.text() if the response is plain text
        } else {
            throw new Error('Failed to save file');
        }
    })
    .then(data => {
        console.log('File saved successfully:', data);
    })
    .catch(error => {
        console.error('Error saving file:', error);
    });
}

function addNewFile() {
    let newFilename = prompt("Enter new file name:");
    if (newFilename) {
        let username = localStorage.getItem('username');
        let fileContent = "";

        let fileList = document.querySelector('.file-list');
        let fileElement = document.createElement('div');
        fileElement.textContent = newFilename;
        fileElement.addEventListener('click', () => loadFileContent(newFilename));
        fileList.appendChild(fileElement);

        fetch('/addfile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, filename: newFilename, file_content: fileContent })
        });
    }
}

function deleteFileContent() {
    let filename = document.getElementById('currentFileName').value;
    let username = localStorage.getItem('username');

    if (filename && confirm("Are you sure you want to delete this file?")) {
        fetch('/deletefile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, filename })
        })
        .then(response => {
            if(response.ok) {
                alert("File deleted successfully.");
                removeFileFromList(filename);
                document.getElementById('noteInput').value = ''; // Clear the textarea
                document.getElementById('currentFileName').value = ''; // Clear the current filename
            } else {
                alert("Error deleting file.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

function removeFileFromList(filename) {
    let fileList = document.querySelector('.file-list');
    let files = fileList.querySelectorAll('div');
    files.forEach(file => {
        if(file.textContent === filename) {
            fileList.removeChild(file);
        }
    });
}