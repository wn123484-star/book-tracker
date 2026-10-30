/* [MÃ: DL-01] Khai báo khóa lưu trữ LocalStorage, danh sách file CSS giao diện và bộ dữ liệu sách mẫu đa dạng */
const STORAGE_KEY = 'books';

const THEME_URLS = {
    'pure': '',
    'default': 'vendor/bootstrap/bootstrap.min.css',
    'flatly': 'vendor/bootswatch/flatly.min.css',
    'cyborg': 'vendor/bootswatch/cyborg.min.css',
    'sketchy': 'vendor/bootswatch/sketchy.min.css',
    'morph': 'vendor/bootswatch/morph.min.css'
};

// Hàm in nhật ký ra cửa sổ F12 (Console) có màu sắc rõ ràng để Tester kiểm tra và demo cho thầy xem luồng chạy
function ghiLogF12(nhomChucNang, hanhDong, duLieuChiTiet = '') {
    const thoiGian = new Date().toLocaleTimeString('vi-VN');
    console.log(
        `%c[TỦ SÁCH - ${thoiGian}] %c[${nhomChucNang}] %c${hanhDong}`,
        'color: #0ea5e9; font-weight: bold;',
        'color: #16a34a; font-weight: bold;',
        'color: #eab308; font-weight: 600;',
        duLieuChiTiet
    );
}

/* [MÃ: DL-08] Hàm hienThiThongBaoNgoaiLeHTML: Hiển thị mã trạng thái (200, 300, 400, 404, 500) trực tiếp lên khung HTML trên màn hình */
function hienThiThongBaoNgoaiLeHTML(maCode, tieuDe, chiTiet) {
    const statusBox = document.getElementById('systemStatusBox');
    const codeBadge = document.getElementById('statusCodeBadge');
    const titleText = document.getElementById('statusTitleText');
    const detailText = document.getElementById('statusDetailText');

    // Ghi log đồng thời vào F12 để vừa thấy trên màn hình vừa thấy trong Console
    ghiLogF12(`TRẠNG THÁI MÃ ${maCode}`, tieuDe, chiTiet);

    if (!statusBox || !codeBadge || !titleText || !detailText) return;

    // Xóa các class màu cũ rồi gắn class màu tương ứng với mã trạng thái mới
    statusBox.classList.remove('hidden-banner', 'status-200', 'status-300', 'status-400', 'status-404', 'status-500');

    let nhomClass = 'status-200';
    if (maCode >= 300 && maCode < 400) nhomClass = 'status-300';
    else if (maCode === 400) nhomClass = 'status-400';
    else if (maCode === 404) nhomClass = 'status-404';
    else if (maCode >= 500) nhomClass = 'status-500';

    statusBox.classList.add(nhomClass);
    codeBadge.innerText = `MÃ ${maCode}`;
    titleText.innerText = tieuDe;
    detailText.innerText = chiTiet;
}

// Tự động bắt mọi lỗi cú pháp hoặc ngoại lệ bất ngờ trong trang và hiện lên khung HTML trên màn hình
window.addEventListener('error', (event) => {
    if (event && event.message) {
        hienThiThongBaoNgoaiLeHTML(500, 'Phát hiện ngoại lệ hệ thống (Mã 500)', event.message);
    }
});

// Tự động phát hiện khi máy tính mất mạng hoặc có mạng trở lại để báo ngay trên giao diện HTML
window.addEventListener('offline', () => {
    hienThiThongBaoNgoaiLeHTML(500, 'Mất kết nối mạng Internet (Mã 500 - Offline)', 'Đã chuyển sang chế độ локаl (Offline). Bạn vẫn thêm, sửa, xóa sách và dùng bìa tự vẽ bình thường.');
});

window.addEventListener('online', () => {
    hienThiThongBaoNgoaiLeHTML(200, 'Đã kết nối mạng trở lại (Mã 200 - Online)', 'Mọi tính năng trực tuyến như tải ảnh bìa ngoài và gửi báo cáo qua thư đã sẵn sàng.');
});

// Danh sách 12 cuốn sách mẫu đa dạng, có cuốn "Hai Con Mèo Ngồi Bên Cửa Sổ" kèm URL ảnh bìa
const DEFAULT_BOOKS = [
    {
        id: "1001",
        title: "Hai Con Mèo Ngồi Bên Cửa Sổ",
        author: "Nguyễn Nhật Ánh",
        description: "Chuyện tình bạn dễ thương giữa mèo Gấu và chuột Tí Hon cùng những bài thơ tình lãng mạn bên khung cửa sổ.",
        deadline: "2026-11-12",
        priority: "Cao",
        status: "Đang đọc",
        coverUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "1002",
        title: "Dế Mèn Phiêu Lưu Ký",
        author: "Tô Hoài",
        description: "Hành trình trưởng thành đầy bài học sâu sắc về tình bạn và lòng nhân ái của chú Dế Mèn qua nhiều vùng đất.",
        deadline: "2026-11-15",
        priority: "Trung bình",
        status: "Đã đọc",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "1003",
        title: "Đắc Nhân Tâm",
        author: "Dale Carnegie",
        description: "Cuốn sách gối đầu giường hướng dẫn nghệ thuật giao tiếp, lắng nghe và thu phục lòng người trong cuộc sống.",
        deadline: "2026-11-25",
        priority: "Cao",
        status: "Đã đọc",
        coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "1004",
        title: "Clean Code - Mã Sạch",
        author: "Robert C. Martin",
        description: "Cẩm nang viết mã nguồn rõ ràng, dễ bảo trì, đặt tên biến chuẩn và tối ưu hàm dành cho dân lập trình.",
        deadline: "2026-12-01",
        priority: "Cao",
        status: "Đang đọc",
        coverUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "1005",
        title: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
        author: "Rosie Nguyễn",
        description: "Những chia sẻ truyền cảm hứng giúp người trẻ định hướng việc tự học, đi trải nghiệm và theo đuổi ước mơ.",
        deadline: "2026-11-20",
        priority: "Thấp",
        status: "Đã đọc",
        coverUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "1006",
        title: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
        author: "Nguyễn Nhật Ánh",
        description: "Những trang viết trong trẻo về tuổi thơ nơi làng quê nghèo với tình anh em và những rung động đầu đời.",
        deadline: "2026-12-15",
        priority: "Trung bình",
        status: "Chưa đọc",
        coverUrl: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "1007",
        title: "Nhà Giả Kim",
        author: "Paulo Coelho",
        description: "Câu chuyện triết lý về chàng chăn cừu Santiago trên con đường vượt sa mạc theo đuổi vận mệnh của đời mình.",
        deadline: "2026-11-18",
        priority: "Cao",
        status: "Đã đọc",
        coverUrl: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "1008",
        title: "JavaScript: The Good Parts",
        author: "Douglas Crockford",
        description: "Khám phá những tinh hoa cốt lõi của ngôn ngữ JavaScript giúp viết code web mượt mà và ít lỗi hơn.",
        deadline: "2027-01-10",
        priority: "Trung bình",
        status: "Chưa đọc",
        coverUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "1009",
        title: "Sapiens: Lược Sử Loài Người",
        author: "Yuval Noah Harari",
        description: "Bức tranh toàn cảnh về lịch sử tiến hóa và phát triển của văn minh nhân loại từ thời cổ đại đến hiện đại.",
        deadline: "2026-12-05",
        priority: "Cao",
        status: "Đang đọc",
        coverUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "1010",
        title: "Cây Cam Ngọt Của Tôi",
        author: "José Mauro de Vasconcelos",
        description: "Câu chuyện chạm đến trái tim về cậu bé Zezé tinh nghịch nhưng giàu tình cảm và cây cam ngọt sau vườn.",
        deadline: "2026-12-22",
        priority: "Trung bình",
        status: "Chưa đọc",
        coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "1011",
        title: "Muôn Kiếp Nhân Sinh",
        author: "Nguyên Phong",
        description: "Những câu chuyện tiền kiếp kỳ lạ giúp người đọc chiêm nghiệm sâu sắc về luật nhân quả trong đời sống.",
        deadline: "2027-01-20",
        priority: "Thấp",
        status: "Chưa đọc",
        coverUrl: ""
    },
    {
        id: "1012",
        title: "Không Diệt Không Sinh Đừng Sợ Hãi",
        author: "Thích Nhất Hạnh",
        description: "Những lời giảng nhẹ nhàng, sâu lắng giúp tâm hồn bình an và vượt qua nỗi sợ hãi trước những biến cố.",
        deadline: "2027-02-28",
        priority: "Thấp",
        status: "Chưa đọc",
        coverUrl: ""
    }
];

/* [MÃ: DL-02] Hàm applySavedTheme: Đọc giao diện đã lưu trong máy rồi đổi file CSS tương ứng */
function applySavedTheme() {
    const savedTheme = localStorage.getItem('app_theme') || 'default';
    const linkElement = document.getElementById('themeStylesheet');
    if (!linkElement) return;

    if (savedTheme === 'pure') {
        linkElement.removeAttribute('href');
        document.documentElement.classList.add('pure-mode');
    } else {
        linkElement.href = THEME_URLS[savedTheme] || THEME_URLS['default'];
        document.documentElement.classList.remove('pure-mode');
    }
    ghiLogF12('GIAO DIỆN', 'Đã áp dụng bộ giao diện:', { maGiaoDien: savedTheme, cheDoCodeThuan: savedTheme === 'pure' });
}

/* [MÃ: DL-03] Hàm applySavedFont: Đọc kiểu chữ đã lưu rồi gắn vào thẻ html để CSS tự đổi font */
function applySavedFont() {
    const savedFont = localStorage.getItem('app_font') || 'priority-regular';
    document.documentElement.setAttribute('data-font', savedFont);
    ghiLogF12('FONT CHỮ', 'Đã nạp kiểu chữ:', { maFont: savedFont });
}

/* [MÃ: DL-04] Hàm applyIconPack: Đổi qua lại giữa Bộ 1 (bo1), Bộ 2 (bo2) trong thư mục assets/img/ và Bộ mặc định web (bo4) */
function applyIconPack() {
    let pack = localStorage.getItem('app_icon_pack') || 'bo1';
    if (pack !== 'bo1' && pack !== 'bo2' && pack !== 'bo4') {
        pack = 'bo1';
        localStorage.setItem('app_icon_pack', 'bo1');
    }

    if (pack === 'bo4') {
        document.documentElement.classList.add('use-default-icons');
    } else {
        document.documentElement.classList.remove('use-default-icons');
        document.querySelectorAll('.dynamic-icon').forEach(img => {
            const iconName = img.getAttribute('data-icon');
            if (iconName) {
                img.src = `assets/img/${pack}/${iconName}`;
                img.onerror = function() {
                    this.style.display = 'none';
                    const fallbackIcon = this.previousElementSibling;
                    if (fallbackIcon && fallbackIcon.classList.contains('default-icon')) {
                        fallbackIcon.style.display = 'inline-block';
                    }
                    hienThiThongBaoNgoaiLeHTML(300, `Chuyển hướng biểu tượng dự phòng (Mã 300)`, `Không tìm thấy ảnh ${iconName}, đã tự động bật biểu tượng mặc định của web.`);
                };
            }
        });
    }
    ghiLogF12('BIỂU TƯỢNG', 'Đã đồng bộ gói biểu tượng:', { boIconDangDung: pack });
}

/* [MÃ: DL-05] Hàm applyCustomVisuals & compressImage: Cài ảnh nền cá nhân và nén ảnh qua thẻ Canvas cho nhẹ bộ nhớ */
function applyCustomVisuals() {
    const bg = localStorage.getItem('app_bg');
    if (bg) {
        document.body.style.backgroundImage = `url(${bg})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.classList.add('has-bg');
        ghiLogF12('HÌNH NỀN', 'Đang sử dụng hình nền cá nhân từ LocalStorage');
    } else {
        document.body.style.backgroundImage = 'none';
        document.body.classList.remove('has-bg');
        ghiLogF12('HÌNH NỀN', 'Đang sử dụng nền mặc định của giao diện');
    }
}

function compressImage(file, maxWidth, maxHeight, quality, callback) {
    ghiLogF12('NÉN ẢNH', 'Bắt đầu nén tệp ảnh tải lên:', { tenTep: file.name, dungLuongGocKB: Math.round(file.size / 1024) });
    const reader = new FileReader();
    reader.onerror = function() {
        hienThiThongBaoNgoaiLeHTML(400, 'Lỗi đọc tệp hình ảnh (Mã 400)', 'Không thể đọc tệp ảnh bạn vừa chọn.');
    };
    reader.onload = function(e) {
        const img = new Image();
        img.onerror = function() {
            hienThiThongBaoNgoaiLeHTML(400, 'Tệp không phải hình ảnh hợp lệ (Mã 400)', 'Vui lòng chọn đúng tệp ảnh đuôi .jpg, .png hoặc .webp.');
        };
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
            const base64Data = canvas.toDataURL('image/jpeg', quality);
            ghiLogF12('NÉN ẢNH', 'Nén ảnh hoàn tất:', { chieuRongMoi: width, chieuCaoMoi: height });
            callback(base64Data);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

/* [MÃ: DL-06] Hàm getBooks & saveBooks: Đọc và ghi danh sách sách vào LocalStorage có bắt ngoại lệ tràn bộ nhớ */
function getBooks() {
    try {
        const rawData = localStorage.getItem(STORAGE_KEY);
        if (!rawData) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BOOKS));
            ghiLogF12('DỮ LIỆU', 'Khởi tạo lần đầu: Đã nạp 12 sách mẫu vào LocalStorage', { soLuongMau: DEFAULT_BOOKS.length });
            return [...DEFAULT_BOOKS];
        }
        const parsed = JSON.parse(rawData);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        hienThiThongBaoNgoaiLeHTML(500, 'Lỗi đọc dữ liệu bộ nhớ (Mã 500)', 'Dữ liệu LocalStorage bị hỏng định dạng JSON, hệ thống tạm trả về mảng rỗng.');
        return [];
    }
}

function saveBooks(booksArray) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(booksArray));
        ghiLogF12('DỮ LIỆU', 'Đã lưu danh sách sách mới vào LocalStorage:', { tongSoSachHienTai: booksArray.length });
        return true;
    } catch (e) {
        hienThiThongBaoNgoaiLeHTML(500, 'Bộ nhớ trình duyệt đã đầy (Mã 500 - QuotaExceeded)', 'Dung lượng LocalStorage vượt quá giới hạn 5MB. Hãy xóa bớt hình nền hoặc tải tệp sao lưu.');
        Swal.fire('Tràn bộ nhớ (Mã 500)', 'Bộ nhớ trình duyệt đã đầy, vui lòng gỡ hình nền cá nhân hoặc xóa bớt dữ liệu cũ.', 'error');
        return false;
    }
}

/* [MÃ: DL-07] Gắn sự kiện cho các nút trên thanh điều hướng và nút đóng khung thông báo trạng thái */
document.addEventListener('DOMContentLoaded', () => {
    ghiLogF12('KHỞI ĐỘNG TRANG', `Đang mở trang: ${document.title}`, { duongDan: window.location.pathname });

    applySavedTheme();
    applySavedFont();
    applyIconPack();
    applyCustomVisuals();

    // Nút đóng thu gọn khung thông báo trạng thái trên màn hình
    const btnHideStatusBox = document.getElementById('btnHideStatusBox');
    if (btnHideStatusBox) {
        btnHideStatusBox.addEventListener('click', () => {
            document.getElementById('systemStatusBox').classList.add('hidden-banner');
            ghiLogF12('KHUNG TRẠNG THÁI', 'Người dùng bấm ẩn thanh thông báo trạng thái trên màn hình');
        });
    }

    // Nếu mở trang lúc đang mất mạng thì báo ngay trên thanh trạng thái
    if (!navigator.onLine) {
        hienThiThongBaoNgoaiLeHTML(300, 'Đang chạy ở chế độ Ngoại tuyến (Mã 300 - Offline Mode)', 'Không có Internet nhưng toàn bộ tính năng quản lý sách, font chữ và bìa SVG vẫn hoạt động 100%.');
    }

    document.querySelectorAll('.nav-link, .navbar-brand').forEach(link => {
        link.addEventListener('click', () => {
            ghiLogF12('ĐIỀU HƯỚNG', `Người dùng bấm chuyển sang trang: ${link.innerText.trim()}`, { href: link.getAttribute('href') });
        });
    });

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navbarNav = document.getElementById('navbarNav');
    if (mobileMenuBtn && navbarNav) {
        mobileMenuBtn.addEventListener('click', () => {
            if (document.documentElement.classList.contains('pure-mode')) {
                navbarNav.classList.toggle('show');
            }
            ghiLogF12('MENU ĐIỆN THOẠI', 'Bấm nút đóng/mở menu trên màn hình nhỏ');
        });
    }

    // Nút Tải tệp sao lưu (.json)
    const btnExport = document.getElementById('btnExportJSON');
    if (btnExport) {
        btnExport.addEventListener('click', () => {
            const books = getBooks();
            ghiLogF12('SAO LƯU DỮ LIỆU', 'Bấm nút Tải tệp sao lưu JSON', { soLuongSachSaoLuu: books.length });

            if (books.length === 0) {
                hienThiThongBaoNgoaiLeHTML(400, 'Không thể sao lưu tủ sách trống (Mã 400)', 'Hiện chưa có cuốn sách nào trong tủ để xuất ra tệp JSON.');
                Swal.fire('Thông báo (Mã 400)', 'Tủ sách đang trống, chưa có dữ liệu để sao lưu.', 'info');
                return;
            }
            const dataStr = JSON.stringify(books, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const fileName = `tu-sach-ca-nhan-${new Date().toISOString().slice(0, 10)}.json`;

            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            hienThiThongBaoNgoaiLeHTML(200, 'Xuất tệp sao lưu thành công (Mã 200)', `Đã tải tệp ${fileName} gồm ${books.length} cuốn sách về máy tính.`);
            Swal.fire('Thành công (Mã 200)', 'Đã tải xuống tệp sao lưu tủ sách.', 'success');
        });
    }

    // Nút Phục hồi dữ liệu từ tệp (.json)
    const btnImport = document.getElementById('btnImportJSON');
    if (btnImport) {
        btnImport.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            ghiLogF12('PHỤC HỒI DỮ LIỆU', 'Đã chọn tệp JSON để khôi phục:', { tenTep: file.name, kichThuocBytes: file.size });

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const jsonData = JSON.parse(event.target.result);
                    if (Array.isArray(jsonData)) {
                        saveBooks(jsonData);
                        hienThiThongBaoNgoaiLeHTML(200, 'Phục hồi dữ liệu thành công (Mã 200)', `Đã nạp lại ${jsonData.length} cuốn sách từ tệp ${file.name}.`);
                        Swal.fire('Thành công (Mã 200)', `Đã khôi phục ${jsonData.length} cuốn sách!`, 'success').then(() => location.reload());
                    } else {
                        throw new Error('Dữ liệu trong tệp không phải là danh sách mảng');
                    }
                } catch (err) {
                    hienThiThongBaoNgoaiLeHTML(400, 'Tệp sao lưu bị lỗi cấu trúc (Mã 400)', `Tệp ${file.name} không đúng chuẩn JSON của Tủ Sách Cá Nhân.`);
                    Swal.fire('Lỗi định dạng (Mã 400)', 'Tệp sao lưu không đúng định dạng.', 'error');
                }
            };
            reader.readAsText(file);
            e.target.value = '';
        });
    }
});