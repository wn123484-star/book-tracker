document.addEventListener('DOMContentLoaded', () => {
    const themeSelector = document.getElementById('themeSelector');
    themeSelector.value = localStorage.getItem('app_theme') || 'default';

    themeSelector.addEventListener('change', (e) => {
        const selected = e.target.value;
        localStorage.setItem('app_theme', selected);
        const linkElement = document.getElementById('themeStylesheet');
        if (linkElement && THEME_URLS[selected]) {
            linkElement.href = THEME_URLS[selected];
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã áp dụng giao diện mới', showConfirmButton: false, timer: 1500 });
        }
    });

    const iconPackSelector = document.getElementById('iconPackSelector');
    if(iconPackSelector) {
        iconPackSelector.value = localStorage.getItem('app_icon_pack') || 'bo1';
        iconPackSelector.addEventListener('change', (e) => {
            localStorage.setItem('app_icon_pack', e.target.value);
            applyIconPack();
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã đổi bộ Icon', showConfirmButton: false, timer: 1500 });
        });
    }

    const bgUpload = document.getElementById('bgUpload');
    if(bgUpload) {
        bgUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(!file) return;
            compressImage(file, 1920, 1080, 0.6, (base64) => {
                localStorage.setItem('app_bg', base64);
                applyCustomVisuals();
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã đổi hình nền', showConfirmButton: false, timer: 1500 });
            });
        });
    }

    const btnResetVisuals = document.getElementById('btnResetVisuals');
    if(btnResetVisuals) {
        btnResetVisuals.addEventListener('click', () => {
            localStorage.removeItem('app_bg');
            applyCustomVisuals();
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã khôi phục nền gốc', showConfirmButton: false, timer: 1500 });
        });
    }

    const emailConfig = JSON.parse(localStorage.getItem('emailConfig') || '{}');
    document.getElementById('targetEmail').value = emailConfig.targetEmail || '';
    document.getElementById('emailPublicKey').value = emailConfig.publicKey || '';
    document.getElementById('emailServiceId').value = emailConfig.serviceId || '';
    document.getElementById('emailTemplateId').value = emailConfig.templateId || '';

    document.getElementById('emailConfigForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const config = {
            targetEmail: document.getElementById('targetEmail').value.trim(),
            publicKey: document.getElementById('emailPublicKey').value.trim(),
            serviceId: document.getElementById('emailServiceId').value.trim(),
            templateId: document.getElementById('emailTemplateId').value.trim()
        };
        localStorage.setItem('emailConfig', JSON.stringify(config));
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã lưu cấu hình Email', showConfirmButton: false, timer: 1500 });
    });

    document.getElementById('btnClearData').addEventListener('click', () => {
        Swal.fire({
            title: 'Xóa toàn bộ dữ liệu?',
            text: "Hành động này sẽ xóa toàn bộ sách trong LocalStorage!",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Chắc chắn xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('books');
                Swal.fire('Đã xóa', 'Thư viện đã được dọn sạch.', 'success').then(() => window.location.href = 'index.html');
            }
        });
    });
});