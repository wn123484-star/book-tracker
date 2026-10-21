const navbarHTML = `
<nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
    <div class="container">
        <a class="navbar-brand fw-bold" href="index.html"><i class="fas fa-book-reader"></i> Quản Lý Sách</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item"><a class="nav-link" href="index.html">Trang chủ</a></li>
                <li class="nav-item"><a class="nav-link" href="books.html">Quản lý sách</a></li>
                <li class="nav-item"><a class="nav-link" href="about.html">Giới thiệu</a></li>
            </ul>
        </div>
    </div>
</nav>
`;

const footerHTML = `
<footer class="bg-dark text-white text-center py-4 mt-auto">
    <div class="container">
        <p class="mb-0">Bản quyền © 2026 - Dự án Quản Lý Sách</p>
    </div>
</footer>
`;

document.addEventListener('DOMContentLoaded', () => {
    const h = document.getElementById('app-header');
    const f = document.getElementById('app-footer');
    if(h) h.innerHTML = navbarHTML;
    if(f) f.innerHTML = footerHTML;
    
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if(link.getAttribute('href') === currentPath) {
            link.classList.add('active', 'fw-bold');
        }
    });
});