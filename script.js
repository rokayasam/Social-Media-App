// Mock data
const mockPosts = [
    {
        id: 1,
        author: 'Sarah Johnson',
        username: '@sarah',
        avatar: 'https://i.pravatar.cc/48?img=1',
        time: '2 hours ago',
        text: 'Just discovered this amazing hiking trail! The views were absolutely breathtaking 🏞️',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        likes: 245,
        comments: 18,
        liked: false,
        saved: false
    },
    {
        id: 2,
        author: 'Mike Chen',
        username: '@mikechen',
        avatar: 'https://i.pravatar.cc/48?img=2',
        time: '5 hours ago',
        text: 'Morning coffee and city views. Perfect way to start the day ☕',
        image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=400&fit=crop',
        likes: 523,
        comments: 67,
        liked: false,
        saved: false
    }
];

const mockComments = {
    1: [
        {
            id: 1,
            author: 'Emma Wilson',
            username: '@emmaw',
            avatar: 'https://i.pravatar.cc/48?img=3',
            text: 'This looks incredible! Where is this?',
            time: '1 hour ago'
        },
        {
            id: 2,
            author: 'John Doe',
            username: '@johndoe',
            avatar: 'https://i.pravatar.cc/48?img=4',
            text: 'Amazing shot!',
            time: '30 minutes ago'
        }
    ],
    2: [
        {
            id: 1,
            author: 'Lisa Anderson',
            username: '@lisa',
            avatar: 'https://i.pravatar.cc/48?img=5',
            text: 'Perfect morning vibes!',
            time: '2 hours ago'
        }
    ]
};

const mockNotifications = [
    {
        id: 1,
        type: 'follow',
        user: 'David Kim',
        username: '@davidkim',
        avatar: 'https://i.pravatar.cc/48?img=6',
        action: 'started following you',
        time: '5 minutes ago',
        image: null,
        postId: null
    },
    {
        id: 2,
        type: 'like',
        user: 'Lisa Anderson',
        username: '@lisa',
        avatar: 'https://i.pravatar.cc/48?img=5',
        action: 'liked your post',
        time: '1 hour ago',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=48&h=48&fit=crop',
        postId: 1
    },
    {
        id: 3,
        type: 'comment',
        user: 'Tom Brown',
        username: '@tbrown',
        avatar: 'https://i.pravatar.cc/48?img=7',
        action: 'commented on your post: "Amazing shot! Where is this?"',
        time: '2 hours ago',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=48&h=48&fit=crop',
        postId: 1
    }
];

const mockFollowers = [
    {
        id: 1,
        name: 'Sarah Johnson',
        username: '@sarah',
        avatar: 'https://i.pravatar.cc/48?img=1',
        following: true
    },
    {
        id: 2,
        name: 'Mike Chen',
        username: '@mikechen',
        avatar: 'https://i.pravatar.cc/48?img=2',
        following: true
    },
    {
        id: 3,
        name: 'Emma Wilson',
        username: '@emmaw',
        avatar: 'https://i.pravatar.cc/48?img=3',
        following: false
    }
];

// Login functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const tab = e.target.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        document.getElementById(tab + 'Tab').classList.add('active');
    });
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showAppPage();
});

document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showAppPage();
});

function showAppPage() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('appPage').classList.add('active');
    loadFeed();
}

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.currentTarget.dataset.page;
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        e.currentTarget.classList.add('active');
        showPage(page);
    });
});

function showPage(page) {
    document.querySelectorAll('.content-page').forEach(p => p.classList.remove('active'));
    document.getElementById(page + 'Page').classList.add('active');
    
    if (page === 'profile') {
        loadProfile();
    } else if (page === 'notifications') {
        loadNotifications();
    } else if (page === 'search') {
        loadSearch();
    }
}

// Logout button in header
document.getElementById('logoutHeaderBtn').addEventListener('click', () => {
    document.getElementById('appPage').classList.remove('active');
    document.getElementById('loginPage').classList.add('active');
});

// Create Post Modal
const createPostBtn = document.getElementById('createPostBtn');
const createPostModal = document.getElementById('createPostModal');
const closeModal = document.getElementById('closeModal');
const postInputModal = document.getElementById('postInputModal');
const submitPostModalBtn = document.getElementById('submitPostModalBtn');
const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
const photoInput = document.getElementById('photoInput');

let selectedImage = null;

createPostBtn.addEventListener('click', () => {
    createPostModal.classList.add('active');
});

closeModal.addEventListener('click', () => {
    createPostModal.classList.remove('active');
    postInputModal.value = '';
    selectedImage = null;
    uploadPhotoBtn.innerHTML = '<span>📷</span> Photo';
    uploadPhotoBtn.style.background = 'white';
    uploadPhotoBtn.style.color = 'var(--text)';
});

createPostModal.addEventListener('click', (e) => {
    if (e.target === createPostModal) {
        createPostModal.classList.remove('active');
        postInputModal.value = '';
        selectedImage = null;
        uploadPhotoBtn.innerHTML = '<span>📷</span> Photo';
        uploadPhotoBtn.style.background = 'white';
        uploadPhotoBtn.style.color = 'var(--text)';
    }
});

uploadPhotoBtn.addEventListener('click', () => {
    photoInput.click();
});

photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            selectedImage = event.target.result;
            uploadPhotoBtn.innerHTML = '<span>✓</span> Photo Added';
            uploadPhotoBtn.style.background = 'var(--light)';
            uploadPhotoBtn.style.color = 'var(--primary)';
        };
        reader.readAsDataURL(file);
    }
});

submitPostModalBtn.addEventListener('click', () => {
    const postText = postInputModal.value;
    if (postText.trim()) {
        const newPost = {
            id: mockPosts.length + 1,
            author: 'Your Name',
            username: '@yourusername',
            avatar: 'https://i.pravatar.cc/100?img=8',
            time: 'just now',
            text: postText,
            image: selectedImage || 'https://images.unsplash.com/photo-1516573398502-c452574b7ffc?w=600&h=400&fit=crop',
            likes: 0,
            comments: 0,
            liked: false,
            saved: false
        };
        mockPosts.unshift(newPost);
        postInputModal.value = '';
        selectedImage = null;
        uploadPhotoBtn.innerHTML = '<span>📷</span> Photo';
        uploadPhotoBtn.style.background = 'white';
        uploadPhotoBtn.style.color = 'var(--text)';
        createPostModal.classList.remove('active');
        
        if (document.getElementById('feedPage').classList.contains('active')) {
            loadFeed();
        }
    }
});

// Feed
function loadFeed() {
    const feedContainer = document.getElementById('feedContainer');
    feedContainer.innerHTML = '';
    
    mockPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        if (post.saved) {
            postElement.classList.add('saved');
        }
        postElement.innerHTML = `
            <div class="post-header">
                <img src="${post.avatar}" alt="${post.author}" class="post-avatar">
                <div class="post-info">
                    <div class="post-author">${post.author}</div>
                    <div class="post-time">${post.username} · ${post.time}</div>
                </div>
                <button class="post-menu">⋯</button>
            </div>
            <div class="post-text">${post.text}</div>
            <img src="${post.image}" alt="Post image" class="post-image">
            <div class="post-actions">
                <button class="post-action like-btn" data-id="${post.id}">❤️ Like</button>
                <button class="post-action comment-btn" data-id="${post.id}">💬 Comment</button>
                <button class="post-action save-btn ${post.saved ? 'saved' : ''}" data-id="${post.id}">${post.saved ? '💾' : '🔖'} ${post.saved ? 'Saved' : 'Save'}</button>
            </div>
            <div class="post-footer">
                <div class="post-stat likes-count">${post.likes} Likes</div>
                <div class="post-stat">${post.comments} Comments</div>
            </div>
            <div class="post-comments-section" id="comments-${post.id}" style="display: none;">
                <div class="comments-list"></div>
                <div class="add-comment">
                    <input type="text" class="comment-input" placeholder="Add a comment..." data-post-id="${post.id}">
                </div>
            </div>
        `;
        
        postElement.querySelector('.like-btn').addEventListener('click', function() {
            const isLiked = post.liked;
            post.liked = !isLiked;
            post.likes += isLiked ? -1 : 1;
            this.textContent = post.liked ? '❤️ Liked' : '❤️ Like';
            postElement.querySelector('.likes-count').textContent = post.likes + ' Likes';
        });
        
        // Save button
        postElement.querySelector('.save-btn').addEventListener('click', function() {
            post.saved = !post.saved;
            this.textContent = post.saved ? '💾 Saved' : '🔖 Save';
            this.classList.toggle('saved');
        });
        
        const commentBtn = postElement.querySelector('.comment-btn');
        const commentsSection = postElement.querySelector('.post-comments-section');
        
        commentBtn.addEventListener('click', () => {
            const isVisible = commentsSection.style.display === 'block';
            commentsSection.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                loadComments(post.id, postElement);
            }
        });
        
        postElement.querySelector('.comment-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const commentText = e.target.value;
                if (commentText.trim()) {
                    const newComment = {
                        id: (mockComments[post.id]?.length || 0) + 1,
                        author: 'Your Name',
                        username: '@yourusername',
                        avatar: 'https://i.pravatar.cc/100?img=8',
                        text: commentText,
                        time: 'just now'
                    };
                    
                    if (!mockComments[post.id]) {
                        mockComments[post.id] = [];
                    }
                    mockComments[post.id].push(newComment);
                    post.comments++;
                    e.target.value = '';
                    loadComments(post.id, postElement);
                    postElement.querySelector('.post-stat').textContent = post.comments + ' Comments';
                }
            }
        });
        
        feedContainer.appendChild(postElement);
    });
}

// Load Comments
function loadComments(postId, postElement) {
    const commentsList = postElement.querySelector('.comments-list');
    commentsList.innerHTML = '';
    
    const comments = mockComments[postId] || [];
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment-item';
        commentElement.innerHTML = `
            <img src="${comment.avatar}" alt="${comment.author}" class="comment-avatar">
            <div class="comment-content">
                <div class="comment-header">
                    <strong>${comment.author}</strong>
                    <span class="comment-handle">${comment.username}</span>
                    <span class="comment-time">${comment.time}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
            </div>
        `;
        commentsList.appendChild(commentElement);
    });
}

// Profile
function loadProfile() {
    const postsTab = document.getElementById('postsTab');
    postsTab.innerHTML = `
        <div class="profile-posts">
            ${mockPosts.map(post => `
                <div class="profile-post-item">
                    <img src="${post.image}" alt="Post" loading="lazy">
                </div>
            `).join('')}
        </div>
    `;
    
    const savedTab = document.getElementById('savedPostsContainer');
    const savedPosts = mockPosts.filter(post => post.saved);
    
    if (savedPosts.length === 0) {
        savedTab.innerHTML = `
            <div class="empty-state">
                <h3>Saved Posts</h3>
                <p>Posts you've saved will appear here</p>
            </div>
        `;
    } else {
        savedTab.innerHTML = `
            <div class="profile-posts">
                ${savedPosts.map(post => `
                    <div class="profile-post-item">
                        <img src="${post.image}" alt="Post" loading="lazy">
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    const followersTab = document.getElementById('followersTab');
    followersTab.innerHTML = `
        <div class="followers-list">
            ${mockFollowers.map(follower => `
                <div class="follower-item">
                    <div class="follower-info">
                        <img src="${follower.avatar}" alt="${follower.name}" class="follower-avatar">
                        <div>
                            <div class="follower-name">${follower.name}</div>
                            <div class="follower-username">${follower.username}</div>
                        </div>
                    </div>
                    <button class="btn-follow ${follower.following ? 'btn-following' : ''}" data-id="${follower.id}">
                        ${follower.following ? 'Following' : 'Follow'}
                    </button>
                </div>
            `).join('')}
        </div>
    `;
    
    // Add follow/unfollow event listeners
    document.querySelectorAll('.follower-item .btn-follow').forEach(btn => {
        btn.addEventListener('click', function() {
            const followerId = this.dataset.id;
            const follower = mockFollowers.find(f => f.id == followerId);
            follower.following = !follower.following;
            this.textContent = follower.following ? 'Following' : 'Follow';
            this.classList.toggle('btn-following');
        });
    });
}

document.querySelectorAll('.profile-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.profile-content').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        document.getElementById(e.target.dataset.tab + 'Tab').classList.add('active');
    });
});

// Edit Profile Modal
const editProfileBtn = document.getElementById('editProfileBtn');
const editProfileModal = document.getElementById('editProfileModal');
const closeEditModal = document.getElementById('closeEditModal');
const saveProfileBtn = document.getElementById('saveProfileBtn');

editProfileBtn.addEventListener('click', () => {
    editProfileModal.classList.add('active');
});

closeEditModal.addEventListener('click', () => {
    editProfileModal.classList.remove('active');
});

editProfileModal.addEventListener('click', (e) => {
    if (e.target === editProfileModal) {
        editProfileModal.classList.remove('active');
    }
});

saveProfileBtn.addEventListener('click', () => {
    const newName = document.getElementById('editName').value;
    const newUsername = document.getElementById('editUsername').value;
    const newBio = document.getElementById('editBio').value;
    
    if (newName.trim() && newUsername.trim()) {
        document.getElementById('profileName').textContent = newName;
        document.getElementById('profileUsername').textContent = newUsername;
        document.getElementById('profileBio').textContent = newBio;
        editProfileModal.classList.remove('active');
    }
});

// Notifications
function loadNotifications() {
    const container = document.getElementById('notificationsContainer');
    container.innerHTML = '';
    
    mockNotifications.forEach(notif => {
        const notifElement = document.createElement('div');
        notifElement.className = 'notification-item';
        notifElement.innerHTML = `
            <img src="${notif.avatar}" alt="${notif.user}" class="notification-avatar">
            <div class="notification-content" ${notif.postId ? `style="cursor: pointer;"` : ''}>
                <div class="notification-text">
                    <strong>${notif.user}</strong> ${notif.action}
                </div>
                <div class="notification-time">${notif.time}</div>
            </div>
            ${notif.image ? `<img src="${notif.image}" alt="Post" class="notification-image">` : ''}
            <button class="notification-delete" data-id="${notif.id}">✕</button>
        `;
        
        if (notif.postId) {
            notifElement.querySelector('.notification-content').addEventListener('click', () => {
                document.querySelectorAll('.nav-item').forEach(item => {
                    if (item.dataset.page === 'feed') {
                        item.click();
                    }
                });
            });
        }
        
        notifElement.querySelector('.notification-delete').addEventListener('click', () => {
            notifElement.remove();
        });
        
        container.appendChild(notifElement);
    });
}

// Search
function loadSearch() {
    const container = document.getElementById('suggestedUsers');
    displaySearchResults(mockFollowers);
}

function displaySearchResults(results) {
    const container = document.getElementById('suggestedUsers');
    container.innerHTML = '';
    
    if (results.length === 0) {
        container.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 24px;">No users found</p>';
        return;
    }
    
    results.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'suggested-user';
        userElement.innerHTML = `
            <div class="suggested-user-info">
                <img src="${user.avatar}" alt="${user.name}" class="suggested-avatar">
                <div>
                    <div class="suggested-name">${user.name}</div>
                    <div class="suggested-handle">${user.username}</div>
                    <div class="suggested-followers">2,543 followers</div>
                </div>
            </div>
            <button class="btn-follow ${user.following ? 'btn-following' : ''}" data-id="${user.id}">
                ${user.following ? 'Following' : 'Follow'}
            </button>
        `;
        
        userElement.querySelector('.btn-follow').addEventListener('click', function() {
            user.following = !user.following;
            this.textContent = user.following ? 'Following' : 'Follow';
            this.classList.toggle('btn-following');
        });
        
        container.appendChild(userElement);
    });
}

// Search input
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm.trim() === '') {
        displaySearchResults(mockFollowers);
    } else {
        const results = mockFollowers.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.username.toLowerCase().includes(searchTerm)
        );
        displaySearchResults(results);
    }
});