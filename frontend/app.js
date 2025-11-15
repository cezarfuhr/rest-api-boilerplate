const API_URL = 'http://localhost:3000/api/v1';
let token = localStorage.getItem('token');

// Utility Functions
function showMessage(message, type = 'success') {
  const messageEl = document.getElementById('message');
  messageEl.textContent = message;
  messageEl.className = `message ${type}`;
  messageEl.style.display = 'block';

  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 3000);
}

function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  document.getElementById(`${tabName}-tab`).classList.add('active');
  event.target.classList.add('active');
}

function showCreatePost() {
  document.getElementById('create-post').style.display = 'block';
}

function hideCreatePost() {
  document.getElementById('create-post').style.display = 'none';
  document.getElementById('create-post-form').reset();
}

// Auth Functions
async function register(e) {
  e.preventDefault();

  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao registrar');
    }

    token = data.token;
    localStorage.setItem('token', token);
    showMessage('Registrado com sucesso!');
    showUserInterface(data.user);
    document.getElementById('register-form').reset();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

async function login(e) {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao fazer login');
    }

    token = data.token;
    localStorage.setItem('token', token);
    showMessage('Login realizado com sucesso!');
    showUserInterface(data.user);
    document.getElementById('login-form').reset();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

function logout() {
  token = null;
  localStorage.removeItem('token');
  showMessage('Logout realizado com sucesso!');
  showAuthInterface();
}

function showUserInterface(user) {
  document.getElementById('auth-section').querySelector('h2').textContent = 'Perfil';
  document.querySelectorAll('.tabs, .tab-content').forEach(el => (el.style.display = 'none'));
  document.getElementById('user-info').style.display = 'block';
  document.getElementById('posts-section').style.display = 'block';

  document.getElementById('user-details').innerHTML = `
    <p><strong>Nome:</strong> ${user.name}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Função:</strong> ${user.role}</p>
  `;

  loadPosts();
}

function showAuthInterface() {
  document.getElementById('auth-section').querySelector('h2').textContent = 'Autenticação';
  document.querySelectorAll('.tabs, .tab-content').forEach(el => (el.style.display = ''));
  document.getElementById('user-info').style.display = 'none';
  document.getElementById('posts-section').style.display = 'none';
}

// Posts Functions
async function loadPosts() {
  try {
    const response = await fetch(`${API_URL}/posts`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao carregar posts');
    }

    displayPosts(data.data);
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

function displayPosts(posts) {
  const postsListEl = document.getElementById('posts-list');

  if (posts.length === 0) {
    postsListEl.innerHTML = '<p>Nenhum post encontrado.</p>';
    return;
  }

  postsListEl.innerHTML = posts
    .map(
      post => `
    <div class="post-card">
      <h4>${post.title}</h4>
      <p>${post.content || 'Sem conteúdo'}</p>
      <div class="post-meta">
        <span>Por: ${post.author.name}</span>
        <span>Data: ${new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
      </div>
      <span class="post-status ${post.published ? 'published' : 'draft'}">
        ${post.published ? 'Publicado' : 'Rascunho'}
      </span>
      ${
        token
          ? `
      <div class="post-actions">
        <button onclick="deletePost('${post.id}')">Excluir</button>
      </div>
      `
          : ''
      }
    </div>
  `
    )
    .join('');
}

async function createPost(e) {
  e.preventDefault();

  if (!token) {
    showMessage('Você precisa estar logado', 'error');
    return;
  }

  const title = document.getElementById('post-title').value;
  const content = document.getElementById('post-content').value;
  const published = document.getElementById('post-published').checked;

  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, published }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao criar post');
    }

    showMessage('Post criado com sucesso!');
    hideCreatePost();
    loadPosts();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

async function deletePost(postId) {
  if (!confirm('Tem certeza que deseja excluir este post?')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao excluir post');
    }

    showMessage('Post excluído com sucesso!');
    loadPosts();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

// Event Listeners
document.getElementById('register-form').addEventListener('submit', register);
document.getElementById('login-form').addEventListener('submit', login);
document.getElementById('create-post-form').addEventListener('submit', createPost);

// Check if user is already logged in
async function checkAuth() {
  if (token) {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        showUserInterface(user);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    }
  }
}

// Initialize
checkAuth();
