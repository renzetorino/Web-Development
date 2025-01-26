fetch('./footer.html') 
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load footer');
        }
        return response.text(); 
    })
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data; 
    })
    .catch(error => {
        console.error('Error:', error); 
    });
