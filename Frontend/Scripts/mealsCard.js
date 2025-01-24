document.addEventListener('DOMContentLoaded', () => {
    const recipeFilters = document.querySelector('.recipe-filters');
    const defaultFilterId = '1'; // Default filter to load on page load

    const loadContentByFilter = (buttonId) => {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-button').forEach(button => {
            button.classList.remove('active');
        });

        // Add active class to the clicked button
        const button = document.getElementById(buttonId);
        if (button) {
            button.classList.add('active');

            // Mapping filter IDs to their respective URLs
            const urlMap = {
                '1': 'allMeals.html',
                '2': 'quickMeals.html',
                '3': 'vegetarian.html',
                '4': 'high-protein.html',
                '5': 'desserts.html',
            };

            const url = urlMap[buttonId];
            if (url) {
                // Fetch the content and load it into the placeholder
                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.text();
                    })
                    .then(data => {
                        document.getElementById('recipe-placeholder').innerHTML = data;
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                    });
            }
        }
    };

    if (recipeFilters) {
        // Add click event listener for the filter buttons
        recipeFilters.addEventListener('click', (event) => {
            if (event.target.classList.contains('filter-button')) {
                const buttonId = event.target.id;
                loadContentByFilter(buttonId);
            }
        });

        // Load the default content (All recipes) on page load
        loadContentByFilter(defaultFilterId);
    } else {
        console.error('.recipe-filters element not found in the DOM.');
    }
});