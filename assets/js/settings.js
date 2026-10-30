/* [MÃ: CD-01] Quản lý toàn bộ các hộp chọn và nút bấm trong trang Tùy chỉnh (settings.html) */
document.addEventListener('DOMContentLoaded', () => {
    const themeSelector = document.getElementById('themeSelector');
    const fontSelector = document.getElementById('fontSelector');
    const iconPackSelector = document.getElementById('iconPackSelector');
    const bgUpload = document.getElementById('bgUpload');
    const btnResetVisuals = document.getElementById('btnResetVisuals');
    const emailConfigForm = document.getElementById('emailConfigForm');
    const btnClearData = document.getElementById('btnClearData');
    const btnRestoreSample = document.getElementById('btnRestoreSample');

    /* [MÃ: CD-02] Hộp chọn Màu sắc & Bố cục Giao diện (#themeSelector) */
    if (themeSelector) {
        themeSelector.value = localStorage.getItem('app_theme') || 'default';
        themeSelector.addEventListener('change', (e) => {
            const giaTriMoi = e.target.value;
            localStorage.setItem('app_theme', giaTriMoi);
            applySavedTheme();
            hienThiThongBaoNgoaiLeHTML(200, 'Đổi giao diện thành công (Mã 200)', `Đã chuyển sang phong cách giao diện: ${giaTriMoi}.`);
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã đổi phong cách giao diện', showConfirmButton: false, timer: 1400 });
        });
    }

    /* [MÃ: CD-03] Hộp chọn Kiểu chữ hiển thị (#fontSelector) */
    if (fontSelector) {
        fontSelector.value = localStorage.getItem('app_font') || 'priority-regular';
        fontSelector.addEventListener('change', (e) => {
            const fontMoi = e.target.value;
            localStorage.setItem('app_font', fontMoi);
            applySavedFont();
            hienThiThongBaoNgoaiLeHTML(200, 'Đổi kiểu chữ hiển thị thành công (Mã 200)', `Đã nạp font chữ cục bộ: ${fontMoi} (Chạy 100% Offline).`);
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã áp dụng kiểu chữ mới', showConfirmButton: false, timer: 1400 });
        });
    }

    /* [MÃ: CD-04] Hộp chọn Bộ biểu tượng trang trí (#iconPackSelector) */
    if (iconPackSelector) {
        let savedPack = localStorage.getItem('app_icon_pack') || 'bo1';
        if (savedPack !== 'bo1' && savedPack !== 'bo2' && savedPack !== 'bo4') savedPack = 'bo1';
        iconPackSelector.value = savedPack;

        iconPackSelector.addEventListener('change', (e) => {
            const boIconMoi = e.target.value;
            localStorage.setItem('app_icon_pack', boIconMoi);
            applyIconPack();
            hienThiThongBaoNgoaiLeHTML(200, 'Đổi bộ biểu tượng thành công (Mã 200)', `Đã đồng bộ gói biểu tượng: ${boIconMoi}.`);
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã đổi bộ biểu tượng', showConfirmButton: false, timer: 1400 });
        });
    }

    /* [MÃ: CD-05] Tải ảnh nền cá nhân (#bgUpload) và nút Khôi phục nền mặc định (#btnResetVisuals) */
    if (bgUpload) {
        bgUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            compressImage(file, 1920, 1080, 0.65, (base64) => {
                try {
                    localStorage.setItem('app_bg', base64);
                    applyCustomVisuals();
                    hienThiThongBaoNgoaiLeHTML(200, 'Cập nhật hình nền thành công (Mã 200)', `Đã nén và lưu ảnh ${file.name} vào bộ nhớ trình duyệt.`);
                    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã cập nhật hình nền mới', showConfirmButton: false, timer: 1400 });
                } catch (err) {
                    hienThiThongBaoNgoaiLeHTML(500, 'Tràn bộ nhớ khi lưu ảnh nền (Mã 500)', 'Ảnh quá nặng so với bộ nhớ trình duyệt, vui lòng chọn ảnh khác nhẹ hơn.');
                }
            });
        });
    }

    if (btnResetVisuals) {
        btnResetVisuals.addEventListener('click', () => {
            localStorage.removeItem('app_bg');
            applyCustomVisuals();
            hienThiThongBaoNgoaiLeHTML(300, 'Đã quay về hình nền mặc định (Mã 300)', 'Đã xóa ảnh nền cá nhân để giải phóng bộ nhớ LocalStorage.');
            Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: 'Đã khôi phục hình nền gốc', showConfirmButton: false, timer: 1400 });
        });
    }

    /* [MÃ: CD-06] Lưu cài đặt nhận báo cáo qua thư (#emailConfigForm), Khôi phục sách mẫu & Làm trống tủ sách */
    const emailConfig = JSON.parse(localStorage.getItem('emailConfig') || '{}');
    document.getElementById('targetEmail').value = emailConfig.targetEmail || '';
    document.getElementById('emailPublicKey').value = emailConfig.publicKey || '';
    document.getElementById('emailServiceId').value = emailConfig.serviceId || '';
    document.getElementById('emailTemplateId').value = emailConfig.templateId || '';

    if (emailConfigForm) {
        emailConfigForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const config = {
                targetEmail: document.getElementById('targetEmail').value.trim(),
                publicKey: document.getElementById('emailPublicKey').value.trim(),
                serviceId: document.getElementById('emailServiceId').value.trim(),
                templateId: document.getElementById('emailTemplateId').value.trim()
            };
            if (!config.targetEmail.includes('@')) {
                hienThiThongBaoNgoaiLeHTML(400, 'Địa chỉ thư điện tử không hợp lệ (Mã 400)', 'Vui lòng nhập đúng định dạng email có chứa ký tự @.');
                return;
            }
            localStorage.setItem('emailConfig', JSON.stringify(config));
            hienThiThongBaoNgoaiLeHTML(200, 'Lưu cấu hình hộp thư thành công (Mã 200)', `Sẵn sàng gửi báo cáo tới: ${config.targetEmail}.`);
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã lưu cài đặt hộp thư', showConfirmButton: false, timer: 1500 });
        });
    }

    // Nút nạp lại 12 cuốn sách mẫu ban đầu
    if (btnRestoreSample) {
        btnRestoreSample.addEventListener('click', () => {
            saveBooks(DEFAULT_BOOKS);
            hienThiThongBaoNgoaiLeHTML(200, 'Đã nạp lại 12 cuốn sách mẫu (Mã 200)', 'Tủ sách đã được khôi phục bộ dữ liệu mẫu đa dạng ban đầu.');
            Swal.fire('Đã khôi phục (Mã 200)', 'Đã nạp lại 12 cuốn sách mẫu vào tủ sách!', 'success');
        });
    }

    if (btnClearData) {
        btnClearData.addEventListener('click', () => {
            ghiLogF12('XÓA TOÀN BỘ', 'Người dùng bấm nút Làm trống toàn bộ tủ sách');
            Swal.fire({
                title: 'Làm trống toàn bộ tủ sách?',
                text: 'Tất cả sách hiện có sẽ bị xóa. Hãy tải tệp sao lưu trước nếu cần giữ lại!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Chắc chắn xóa',
                cancelButtonText: 'Hủy'
            }).then((result) => {
                if (result.isConfirmed) {
                    saveBooks([]);
                    hienThiThongBaoNgoaiLeHTML(200, 'Đã làm trống toàn bộ tủ sách (Mã 200)', 'Dữ liệu kệ sách hiện tại đã được đưa về 0 cuốn.');
                    Swal.fire('Đã làm trống (Mã 200)', 'Tủ sách của bạn đã được dọn sạch.', 'success');
                } else {
                    hienThiThongBaoNgoaiLeHTML(300, 'Đã hủy thao tác làm trống tủ sách (Mã 300)', 'Toàn bộ sách của bạn vẫn được giữ nguyên.');
                }
            });
        });
    }

    /* [MÃ: CD-07] Xử lý 5 nút bấm Kiểm thử & Mô phỏng Mã trạng thái (200, 300, 400, 404, 500) ngay trên giao diện */
    document.querySelectorAll('[data-test-code]').forEach(btn => {
        btn.addEventListener('click', () => {
            const code = parseInt(btn.getAttribute('data-test-code'), 10);
            if (code === 200) {
                hienThiThongBaoNgoaiLeHTML(200, 'Kiểm thử Mã 200 OK – Thành công', 'Kết nối dữ liệu hoàn hảo, thao tác đọc/ghi LocalStorage hoạt động trơn tru.');
            } else if (code === 300) {
                hienThiThongBaoNgoaiLeHTML(300, 'Kiểm thử Mã 300 – Chuyển hướng tài nguyên dự phòng', 'Khi ảnh bìa trực tuyến bị lỗi hoặc mất mạng, hệ thống tự động chuyển sang bộ vẽ ảnh bìa SVG nội bộ.');
            } else if (code === 400) {
                hienThiThongBaoNgoaiLeHTML(400, 'Kiểm thử Mã 400 – Dữ liệu đầu vào không hợp lệ', 'Bắt lỗi khi người dùng bỏ trống tên sách, nhập hạn đọc trong quá khứ hoặc mô tả ngắn hơn 10 ký tự.');
            } else if (code === 404) {
                hienThiThongBaoNgoaiLeHTML(404, 'Kiểm thử Mã 404 – Không tìm thấy tài nguyên hoặc sách', 'Báo hiệu khi từ khóa lọc không khớp cuốn sách nào hoặc đường dẫn tệp không tồn tại.');
            } else if (code === 500) {
                hienThiThongBaoNgoaiLeHTML(500, 'Kiểm thử Mã 500 – Ngoại lệ hệ thống / Mất kết nối máy chủ', 'Bắt ngoại lệ khi mất mạng lúc gửi EmailJS hoặc khi dung lượng LocalStorage bị đầy.');
            }
            document.getElementById('systemStatusBox').scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
});