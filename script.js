document.addEventListener('DOMContentLoaded', function () {
    const createPostBtn = document.getElementById('createPostBtn');
    const createPostModal = document.getElementById('createPostModal');
    const closeModal = document.getElementById('closeModal');
    const postForm = document.getElementById('postForm');
    const postContainer = document.querySelector('.post-container');
    const postDetailModal = document.getElementById('postDetailModal');
    const closeDetailModal = document.getElementById('closeDetailModal');
    const detailTitle = document.getElementById('detailTitle');
    const detailDate = document.getElementById('detailDate');
    const detailDescription = document.getElementById('detailDescription');

    // Load posts from "Blogs" on page load
    loadPosts();

    createPostBtn.addEventListener('click', function () {
        createPostModal.style.display = 'flex';
    });

    closeModal.addEventListener('click', function () {
        createPostModal.classList.add('fadeOut');
        setTimeout(() => {
            createPostModal.style.display = 'none';
            createPostModal.classList.remove('fadeOut');
        }, 500);
    });

    postForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const postCategory = document.getElementById('postCategory').value;
        const postTitle = document.getElementById('postTitle').value;
        const postDescription = document.getElementById('postDescription').value;

        if (postCategory.trim() === '' || postTitle.trim() === '' || postDescription.trim() === '') {
            alert('Please fill out all fields.');
            return;
        }

        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'short' })} ${currentDate.getFullYear()}`;

        // Create post object
        const newPost = {
            title: postTitle,
            category: postCategory,
            description: postDescription,
            date: formattedDate
        };

        // Save post to Local Storage under "Blogs"
        savePostToLocalStorage(newPost);

        // Display the new post
        displayPost(newPost);

        // Close modal & reset form
        createPostModal.style.display = 'none';
        postForm.reset();
    });

    postContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('load-more') || event.target.classList.contains('post-title')) {
            const title = event.target.getAttribute('data-title');
            const date = event.target.getAttribute('data-date');
            const description = event.target.getAttribute('data-description');

            detailTitle.textContent = title;
            detailDate.textContent = date;
            detailDescription.textContent = description;

            postDetailModal.style.display = 'flex';
        }

        if (event.target.classList.contains('delete-post')) {
            const titleToDelete = event.target.getAttribute('data-title');

            // Remove from Local Storage
            deletePostFromLocalStorage(titleToDelete);

            // Remove from UI
            const postToDelete = document.querySelector(`.post-title[data-title="${titleToDelete}"]`).closest('.post-box');
            postToDelete.classList.add('fadeOut');
            setTimeout(() => {
                postContainer.removeChild(postToDelete);
            }, 500);
        }
    });

    closeDetailModal.addEventListener('click', function () {
        postDetailModal.classList.add('fadeOut');
        setTimeout(() => {
            postDetailModal.style.display = 'none';
            postDetailModal.classList.remove('fadeOut');
        }, 500);
    });

    function savePostToLocalStorage(post) {
        let posts = JSON.parse(localStorage.getItem('Blogs/posts')) || [];
        posts.unshift(post); // Add new post at the beginning
        localStorage.setItem('Blogs/posts', JSON.stringify(posts));
    }

    function loadPosts() {
        let posts = JSON.parse(localStorage.getItem('Blogs/posts')) || [];
        posts.forEach(displayPost);
    }

    function displayPost(post) {
        const newPost = document.createElement('div');
        newPost.className = 'post-box';
        newPost.innerHTML = `
            <h1 class="post-title" data-title="${post.title}" data-date="${post.date}" data-description="${post.description}">
                ${post.title}
            </h1><br>
            <h2 class="category">${post.category}</h2><br>
            <span class="post-date">${post.date}</span>
            <p class="post-description">${post.description.substring(0, 100)}...</p>
            <button class="delete-post" data-title="${post.title}">Delete</button>
            <span class="load-more" data-title="${post.title}" data-date="${post.date}" data-description="${post.description}">Load more</span>
        `;
        postContainer.insertBefore(newPost, postContainer.firstChild);
    }

    function deletePostFromLocalStorage(title) {
        let posts = JSON.parse(localStorage.getItem('Blogs/posts')) || [];
        posts = posts.filter(post => post.title !== title);
        localStorage.setItem('Blogs/posts', JSON.stringify(posts));
    }
});
