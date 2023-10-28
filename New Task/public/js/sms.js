
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        tabContents.forEach((content) => {
            if (content.id === tabId) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        // Change the background color of the clicked button
        tabButtons.forEach((btn) => {
            if (btn === button) {
                btn.style.backgroundColor = '#6f33b3'; // Change to the desired color
            } else {
                btn.style.backgroundColor = ''; // Reset background color for other buttons
            }
        });
    });
});
    