const mockPosts = [
    { id: 1, author: 'Sarah Johnson', username: '@sarah', avatar: 'https://i.pravatar.cc/48?img=1', time: '2 hours ago', text: 'Just discovered this amazing hiking trail! The views were absolutely breathtaking 🏞️', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', likes: 245, comments: [], liked: false, saved: false },
    { id: 2, author: 'Mike Chen', username: '@mikechen', avatar: 'https://i.pravatar.cc/48?img=2', time: '5 hours ago', text: 'Morning coffee and city views. Perfect way to start the day ☕', image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=400&fit=crop', likes: 523, comments: [], liked: false, saved: false }
];

const mockFollowers = [
    { id: 1, name: 'Sarah Johnson', username: '@sarah', avatar: 'https://i.pravatar.cc/48?img=1', following: true },
    { id: 2, name: 'Mike Chen', username: '@mikechen', avatar: 'https://i.pravatar.cc/48?img=2', following: true },
    { id: 3, name: 'Emma Wilson', username: '@emmaw', avatar: 'https://i.pravatar.cc/48?img=3', following: false }
];

const mockNotifications = [
    { id: 1, user: 'David Kim', username: '@davidkim', avatar: 'https://i.pravatar.cc/48?img=6', action: 'started following you', time: '5 minutes ago', postId: null },
    { id: 2, user: 'Lisa Anderson', username: '@lisa', avatar: 'https://i.pravatar.cc/48?img=5', action: 'liked your post', time: '1 hour ago', postId: 1 }
];

const $ = (sel) => document.querySelector(sel);
const $all = (sel) => document.querySelectorAll(sel);

// Tab switching on login
$all('.tab-btn').forEach(btn => btn.addEventListener('click', (e) => {
    $all('.tab-btn').forEach(b => b.classList.remove('active'));
    $all('.tab-content').forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');
    $(`#${e.target.dataset.tab}Tab`).classList.add('active');
}));

// Login
$('#loginForm').addEventListener('submit', (e) => { e.preventDefault(); showApp(); });
$('#signupForm').addEventListener('submit', (e) => { e.preventDefault(); showApp(); });

function showApp() {
    $('#loginPage').classList.remove('active');
    $('#appPage').classList.add('active');
    loadFeed(); loadProfile(); loadNotifications(); loadSearch();
}

// Navigation
$all('.nav-item').forEach(item => item.addEventListener('click', (e) => {
    e.preventDefault();
    $all('.nav-item').forEach(i => i.classList.remove('active'));
    e.currentTarget.classList.add('active');
    $all('.content-page').forEach(p => p.classList.remove('active'));
    $(`#${e.currentTarget.dataset.page}Page`).classList.add('active');
}));

$('#logoutHeaderBtn').addEventListener('click', () => {
    $('#appPage').classList.remove('active');
    $('#loginPage').classList.add('active');
});

// Create Post
const createPostModal = $('#createPostModal');
const postInputModal = $('#postInputModal');
let selectedImage = null;

$('#createPostBtn').addEventListener('click', () => createPostModal.classList.add('active'));
$('#closeModal').addEventListener('click', () => { createPostModal.classList.remove('active'); postInputModal.value = ''; selectedImage = null; });
$('#uploadPhotoBtn').addEventListener('click', () => $('#photoInput').click());
$('#photoInput').addEventListener('change', (e) => {
    if (e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (ev) => { selectedImage = ev.target.result; };
        reader.readAsDataURL(e.target.files[0]);
    }
});

$('#submitPostModalBtn').addEventListener('click', () => {
    const text = postInputModal.value.trim();
    if (!text) return;
    mockPosts.unshift({
        id: mockPosts.length + 1, author: 'Your Name', username: '@yourusername', avatar: 'https://i.pravatar.cc/100?img=8',
        time: 'just now', text, image: selectedImage || 'https://images.unsplash.com/photo-1516573398502-c452574b7ffc?w=600&h=400&fit=crop',
        likes: 0, comments: [], liked: false, saved: false
    });
    postInputModal.value = ''; selectedImage = null; createPostModal.classList.remove('active');
    loadFeed(); loadProfile();
});

// Load Feed
function loadFeed() {
    $('#feedContainer').innerHTML = '';
    mockPosts.forEach(post => {
        const postEl = document.createElement('div');
        postEl.className = 'post' + (post.saved ? ' saved' : '');
        postEl.dataset.postId = post.id;
        postEl.innerHTML = `
            <div class="post-header"><img src="${post.avatar}" alt="${post.author}" class="post-avatar"><div class="post-info"><div class="post-author">${post.author}</div><div class="post-time">${post.username} · ${post.time}</div></div></div>
            <div class="post-text">${post.text}</div>
            <img src="${post.image}" alt="Post image" class="post-image">
            <div class="post-actions">
                <button class="post-action like-btn">❤️ Like</button>
                <button class="post-action comment-btn">💬 Comment</button>
                <button class="post-action save-btn">${post.saved ? '💾 Saved' : '🔖 Save'}</button>
            </div>
            <div class="post-footer"><div class="post-stat">${post.likes} Likes</div><div class="post-stat">${post.comments.length} Comments</div></div>
            <div class="post-comments-section" style="display:none;"><div class="comments-list"></div><input type="text" class="comment-input" placeholder="Add a comment..."></div>
        `;
        
        postEl.querySelector('.like-btn').addEventListener('click', function() {
            post.liked = !post.liked;
            post.likes += post.liked ? 1 : -1;
            this.textContent = post.liked ? '❤️ Liked' : '❤️ Like';
            postEl.querySelector('.post-footer').innerHTML = `<div class="post-stat">${post.likes} Likes</div><div class="post-stat">${post.comments.length} Comments</div>`;
        });
        
        postEl.querySelector('.save-btn').addEventListener('click', function() {
            post.saved = !post.saved;
            postEl.classList.toggle('saved');
            this.textContent = post.saved ? '💾 Saved' : '🔖 Save';
            loadProfile();
        });
        
        const commentsSection = postEl.querySelector('.post-comments-section');
        const commentInput = postEl.querySelector('.comment-input');
        postEl.querySelector('.comment-btn').addEventListener('click', () => {
            commentsSection.style.display = commentsSection.style.display === 'block' ? 'none' : 'block';
            postEl.querySelector('.comments-list').innerHTML = post.comments.map(c => `<div class="comment-item"><div><strong>${c.author}</strong> ${c.username}</div><div>${c.text}</div></div>`).join('');
        });
        
        commentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
                post.comments.push({ author: 'You', username: '@you', text: e.target.value });
                e.target.value = '';
                postEl.querySelector('.comments-list').innerHTML = post.comments.map(c => `<div class="comment-item"><div><strong>${c.author}</strong> ${c.username}</div><div>${c.text}</div></div>`).join('');
                postEl.querySelector('.post-footer').innerHTML = `<div class="post-stat">${post.likes} Likes</div><div class="post-stat">${post.comments.length} Comments</div>`;
            }
        });
        
        $('#feedContainer').appendChild(postEl);
    });
}

// Load Profile
function loadProfile() {
    $('#postsTab').innerHTML = `<div class="profile-posts">${mockPosts.map(p => `<div class="profile-post-item" data-id="${p.id}"><img src="${p.image}" alt=""></div>`).join('')}</div>`;
    
    const saved = mockPosts.filter(p => p.saved);
    $('#savedPostsContainer').innerHTML = saved.length ? `<div class="profile-posts">${saved.map(p => `<div class="profile-post-item" data-id="${p.id}"><img src="${p.image}" alt=""></div>`).join('')}</div>` : '<div class="empty-state"><p>No saved posts yet</p></div>';
    
    $('#followersTab').innerHTML = `<div class="followers-list">${mockFollowers.map((f, i) => `<div class="follower-item"><div class="follower-info"><img src="${f.avatar}" class="follower-avatar"><div><div class="follower-name">${f.name}</div><div class="follower-username">${f.username}</div></div></div><button class="btn-follow ${f.following ? 'btn-following' : ''}">${f.following ? 'Following' : 'Follow'}</button></div>`).join('')}</div>`;
    
    $all('#followersTab .btn-follow').forEach((btn, i) => btn.addEventListener('click', () => {
        mockFollowers[i].following = !mockFollowers[i].following;
        btn.textContent = mockFollowers[i].following ? 'Following' : 'Follow';
        btn.classList.toggle('btn-following');
    }));

    $all('#postsTab .profile-post-item, #savedTab .profile-post-item').forEach(item => item.addEventListener('click', () => goToPost(Number(item.dataset.id))));
}

// Profile Tabs
$all('.profile-tab').forEach(tab => tab.addEventListener('click', (e) => {
    $all('.profile-tab').forEach(t => t.classList.remove('active'));
    $all('.profile-content').forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');
    $(`#${e.target.dataset.tab}Tab`).classList.add('active');
}));

// Edit Profile
$('#editProfileBtn').addEventListener('click', () => $('#editProfileModal').classList.add('active'));
$('#closeEditModal').addEventListener('click', () => $('#editProfileModal').classList.remove('active'));
$('#saveProfileBtn').addEventListener('click', () => {
    if ($('#editName').value.trim()) $('#profileName').textContent = $('#editName').value.trim();
    if ($('#editUsername').value.trim()) $('#profileUsername').textContent = $('#editUsername').value.trim();
    if ($('#editBio').value.trim()) $('#profileBio').textContent = $('#editBio').value.trim();
    $('#editProfileModal').classList.remove('active');
});

// Load Notifications
function loadNotifications() {
    $('#notificationsContainer').innerHTML = '';
    mockNotifications.forEach(n => {
        const el = document.createElement('div');
        el.className = 'notification-item';
        el.innerHTML = `<img src="${n.avatar}" class="notification-avatar"><div class="notification-content"><div class="notification-text"><strong>${n.user}</strong> ${n.action}</div><div class="notification-time">${n.time}</div></div><button class="notification-delete">✕</button>`;
        if (n.postId) el.addEventListener('click', (e) => { if (!e.target.classList.contains('notification-delete')) goToPost(n.postId); });
        el.querySelector('.notification-delete').addEventListener('click', () => el.remove());
        $('#notificationsContainer').appendChild(el);
    });
}

// Go to post
function goToPost(postId) {
    $all('.nav-item').forEach(i => i.classList.remove('active'));
    $('[data-page="feed"]').classList.add('active');
    $all('.content-page').forEach(p => p.classList.remove('active'));
    $('#feedPage').classList.add('active');
    loadFeed();
    setTimeout(() => {
        const postEl = document.querySelector(`.post[data-post-id="${postId}"]`);
        if (postEl) {
            postEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            postEl.classList.add('highlight');
            setTimeout(() => postEl.classList.remove('highlight'), 2000);
        }
    }, 100);
}

// Search
function displayResults(results) {
    $('#suggestedUsers').innerHTML = results.map((u, i) => `<div class="suggested-user"><div class="suggested-user-info"><img src="${u.avatar}" class="suggested-avatar"><div><div class="suggested-name">${u.name}</div><div class="suggested-handle">${u.username}</div></div></div><button class="btn-follow ${u.following ? 'btn-following' : ''}">${u.following ? 'Following' : 'Follow'}</button></div>`).join('');
    $all('#suggestedUsers .btn-follow').forEach((btn, i) => btn.addEventListener('click', () => {
        results[i].following = !results[i].following;
        btn.textContent = results[i].following ? 'Following' : 'Follow';
        btn.classList.toggle('btn-following');
    }));
}

function loadSearch() { displayResults(mockFollowers); }

$('#searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const res = mockFollowers.filter(u => u.name.toLowerCase().includes(term) || u.username.toLowerCase().includes(term));
    displayResults(res.length ? res : mockFollowers);
});

$('#globalSearch').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        $all('.nav-item').forEach(i => i.classList.remove('active'));
        $('[data-page="search"]').classList.add('active');
        $all('.content-page').forEach(p => p.classList.remove('active'));
        $('#searchPage').classList.add('active');
        $('#searchInput').value = e.target.value;
        $('#searchInput').dispatchEvent(new Event('input'));
    }
});