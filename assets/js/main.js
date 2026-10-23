const THEME_URLS = {
    'default': 'vendor/bootstrap/bootstrap.min.css',
    'flatly': 'vendor/bootswatch/flatly.min.css',
    'cyborg': 'vendor/bootswatch/cyborg.min.css',
    'sketchy': 'vendor/bootswatch/sketchy.min.css',
    'morph': 'vendor/bootswatch/morph.min.css'
};

function applySavedTheme() {
    const savedTheme = localStorage.getItem('app_theme') || 'default';
    const linkElement = document.getElementById('themeStylesheet');
    if (linkElement && THEME_URLS[savedTheme]) {
        linkElement.href = THEME_URLS[savedTheme];
    }
}

function applyIconPack() {
    const pack = localStorage.getItem('app_icon_pack') || 'bo1';
    if (pack === 'bo4') {
        document.documentElement.classList.add('use-default-icons');
    } else {
        document.documentElement.classList.remove('use-default-icons');
        document.querySelectorAll('.dynamic-icon').forEach(img => {
            const iconName = img.getAttribute('data-icon');
            if(iconName) img.src = `assets/img/${pack}/${iconName}`;
        });
    }
}

function applyCustomVisuals() {
    const bg = localStorage.getItem('app_bg');
    if (bg) {
        document.body.style.backgroundImage = `url(${bg})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.classList.add('has-bg');
    } else {
        document.body.style.backgroundImage = 'none';
        document.body.classList.remove('has-bg');
    }
}

function compressImage(file, maxWidth, maxHeight, quality, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round(height *= maxWidth / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round(width *= maxHeight / height);
                    height = maxHeight;
                }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const base64 = canvas.toDataURL('image/jpeg', quality);
            callback(base64);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function getBooks() {
    try {
        const data = localStorage.getItem('books');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

function saveBooks(booksArray) {
    localStorage.setItem('books', JSON.stringify(booksArray));
}

document.addEventListener('DOMContentLoaded', () => {
    applySavedTheme();
    applyIconPack();
    applyCustomVisuals();

    const btnExport = document.getElementById('btnExportJSON');
    if(btnExport) {
        btnExport.addEventListener('click', () => {
            const data = localStorage.getItem('books') || '[]';
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `book_tracker_backup_${new Date().getTime()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            Swal.fire('Thành công', 'Đã tải xuống tệp sao lưu dữ liệu', 'success');
        });
    }

    const btnImport = document.getElementById('btnImportJSON');
    if(btnImport) {
        btnImport.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const jsonData = JSON.parse(event.target.result);
                    if (Array.isArray(jsonData)) {
                        localStorage.setItem('books', JSON.stringify(jsonData));
                        Swal.fire('Thành công', 'Đã khôi phục dữ liệu sách', 'success').then(() => location.reload());
                    } else {
                        throw new Error("Format");
                    }
                } catch {
                    Swal.fire('Lỗi', 'Tệp JSON không đúng định dạng', 'error');
                }
            };
            reader.readAsText(file);
            e.target.value = '';
        });
    }
});