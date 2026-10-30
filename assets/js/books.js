/* [MÃ: NV-02] Lấy các ô nhập liệu và hộp lọc trên trang Kệ sách để xử lý sự kiện */
document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('bookForm');
    const bookIdInput = document.getElementById('bookId');
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const deadlineInput = document.getElementById('deadline');
    const priorityInput = document.getElementById('priority');
    const statusInput = document.getElementById('status');
    const coverUrlInput = document.getElementById('coverUrl');
    const descriptionInput = document.getElementById('description');

    const btnSubmitBook = document.getElementById('btnSubmitBook');
    const btnCancelEdit = document.getElementById('btnCancelEdit');
    const formHeading = document.getElementById('formHeading');

    const searchInput = document.getElementById('searchInput');
    const filterStatus = document.getElementById('filterStatus');
    const filterPriority = document.getElementById('filterPriority');
    const sortDeadline = document.getElementById('sortDeadline');
    const bookGrid = document.getElementById('bookGrid');
    const bookCountBadge = document.getElementById('bookCountBadge');

    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    deadlineInput.value = defaultDate.toISOString().split('T')[0];

    /* [MÃ: NV-03] Hàm createOfflineCoverSVG & xuLyLoiAnhBia:
       Khi link ảnh bìa người dùng dán vào bị lỗi 404 hoặc mất mạng, hàm này tự chuyển sang bìa SVG nội bộ (Mã 300) và báo ngay trên khung màn hình */
    function createOfflineCoverSVG(title, author) {
        const safeTitle = (title || 'Sách hay').slice(0, 24).replace(/[<>&"']/g, '');
        const safeAuthor = (author || '').slice(0, 22).replace(/[<>&"']/g, '');
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260">
            <defs>
                <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#1e3a5f"/>
                    <stop offset="100%" stop-color="#2b6cb0"/>
                </linearGradient>
            </defs>
            <rect width="400" height="260" fill="url(#g)"/>
            <rect x="20" y="20" width="360" height="220" rx="10" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
            <text x="200" y="120" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">${safeTitle}</text>
            <text x="200" y="155" fill="#cbd5e1" font-family="sans-serif" font-size="14" text-anchor="middle">${safeAuthor}</text>
        </svg>`;
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
    }

    // Hàm toàn cục được gọi khi thẻ <img> của bìa sách bị lỗi không tải được URL
    window.xuLyLoiAnhBia = function(imgElement, tenSach, tacGia) {
        imgElement.onerror = null;
        imgElement.src = createOfflineCoverSVG(tenSach, tacGia);
        hienThiThongBaoNgoaiLeHTML(
            300,
            `Đã chuyển sang ảnh bìa tự vẽ dự phòng (Mã 300)`,
            `Đường dẫn ảnh của cuốn "${tenSach}" không phản hồi (Lỗi 404/Offline), hệ thống đã tự tạo bìa SVG thay thế.`
        );
    };

    /* [MÃ: NV-04] Hàm validateBookForm: Kiểm tra dữ liệu đầu vào, nếu sai báo Mã 400 lên cả khung HTML lẫn dưới ô nhập */
    function clearErrors() {
        document.getElementById('errorTitle').innerText = '';
        document.getElementById('errorAuthor').innerText = '';
        document.getElementById('errorDeadline').innerText = '';
        document.getElementById('errorDescription').innerText = '';
    }

    function validateBookForm(isEditing) {
        clearErrors();
        let isValid = true;
        const danhSachLoi = [];

        if (!titleInput.value.trim()) {
            document.getElementById('errorTitle').innerText = 'Vui lòng nhập tên cuốn sách.';
            danhSachLoi.push('Thiếu tên sách');
            isValid = false;
        }
        if (!authorInput.value.trim()) {
            document.getElementById('errorAuthor').innerText = 'Vui lòng nhập tên tác giả.';
            danhSachLoi.push('Thiếu tác giả');
            isValid = false;
        }
        if (!deadlineInput.value) {
            document.getElementById('errorDeadline').innerText = 'Vui lòng chọn ngày dự kiến đọc xong.';
            danhSachLoi.push('Thiếu hạn đọc');
            isValid = false;
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selectedDate = new Date(deadlineInput.value + 'T00:00:00');
            if (!isEditing && selectedDate < today) {
                document.getElementById('errorDeadline').innerText = 'Ngày dự kiến đọc xong không được nhỏ hơn hôm nay.';
                danhSachLoi.push('Hạn đọc nhỏ hơn ngày hiện tại');
                isValid = false;
            }
        }
        if (descriptionInput.value.trim().length < 10) {
            document.getElementById('errorDescription').innerText = 'Vui lòng nhập mô tả hoặc cảm nhận tối thiểu 10 ký tự.';
            danhSachLoi.push('Mô tả dưới 10 ký tự');
            isValid = false;
        }

        if (!isValid) {
            hienThiThongBaoNgoaiLeHTML(400, 'Dữ liệu biểu mẫu chưa hợp lệ (Mã 400)', `Vui lòng sửa các mục: ${danhSachLoi.join(', ')}.`);
        }
        return isValid;
    }

    [titleInput, authorInput, deadlineInput, descriptionInput].forEach(el => {
        el.addEventListener('input', clearErrors);
    });

    /* [MÃ: NV-05] Hàm getFilteredAndSortedBooks: Kết hợp cả Tìm kiếm từ khóa + Lọc trạng thái + Lọc ưu tiên + Sắp xếp hạn đọc */
    function getFilteredAndSortedBooks() {
        const allBooks = getBooks();
        const keyword = searchInput.value.trim().toLowerCase();
        const statusVal = filterStatus.value;
        const priorityVal = filterPriority.value;
        const sortVal = sortDeadline.value;

        let filtered = allBooks.filter(book => {
            const matchKeyword = !keyword ||
                (book.title && book.title.toLowerCase().includes(keyword)) ||
                (book.author && book.author.toLowerCase().includes(keyword)) ||
                (book.description && book.description.toLowerCase().includes(keyword));
            const matchStatus = (statusVal === 'all') || (book.status === statusVal);
            const matchPriority = (priorityVal === 'all') || ((book.priority || 'Trung bình') === priorityVal);
            return matchKeyword && matchStatus && matchPriority;
        });

        if (sortVal === 'asc') {
            filtered.sort((a, b) => new Date(a.deadline || '2099-12-31') - new Date(b.deadline || '2099-12-31'));
        } else if (sortVal === 'desc') {
            filtered.sort((a, b) => new Date(b.deadline || '1970-01-01') - new Date(a.deadline || '1970-01-01'));
        }
        return filtered;
    }

    /* [MÃ: NV-06] Hàm renderBooks: Vẽ danh sách các thẻ sách ra màn hình kệ sách (#bookGrid) */
    function renderBooks(coCapNhatBanner = false) {
        const displayBooks = getFilteredAndSortedBooks();
        bookCountBadge.innerText = `${displayBooks.length} cuốn`;

        if (displayBooks.length === 0) {
            bookGrid.innerHTML = `
                <div class="col-md-12 text-center py-5">
                    <i class="bi bi-journal-x fs-1 text-muted d-block mb-2 default-icon"></i>
                    <img data-icon="icon-empty.png" class="empty-icon mb-3 dynamic-icon" alt="">
                    <p class="text-muted mb-0">Không tìm thấy cuốn sách nào phù hợp với điều kiện tìm kiếm.</p>
                </div>`;
            applyIconPack();
            if (coCapNhatBanner) {
                hienThiThongBaoNgoaiLeHTML(404, 'Không tìm thấy cuốn sách nào khớp bộ lọc (Mã 404)', 'Hãy thử xóa từ khóa tìm kiếm hoặc chuyển hộp lọc về Tất cả.');
            }
            return;
        }

        if (coCapNhatBanner) {
            hienThiThongBaoNgoaiLeHTML(200, 'Lọc và sắp xếp kệ sách thành công (Mã 200)', `Tìm thấy ${displayBooks.length} cuốn sách phù hợp với điều kiện của bạn.`);
        }

        bookGrid.innerHTML = displayBooks.map(book => {
            const isDone = book.status === 'Đã đọc';
            let statusBadgeClass = 'bg-secondary';
            if (book.status === 'Đã đọc') statusBadgeClass = 'bg-success';
            else if (book.status === 'Đang đọc') statusBadgeClass = 'bg-warning text-dark';

            const prio = book.priority || 'Trung bình';
            let priorityBadgeClass = 'bg-secondary';
            if (prio === 'Cao') priorityBadgeClass = 'bg-danger';
            else if (prio === 'Trung bình') priorityBadgeClass = 'bg-primary';

            const formattedDeadline = book.deadline
                ? book.deadline.split('-').reverse().join('/')
                : 'Chưa đặt lịch';

            const fallbackCover = createOfflineCoverSVG(book.title, book.author);
            const coverSrc = (book.coverUrl && book.coverUrl.trim() !== '') ? book.coverUrl : fallbackCover;
            const safeTitleAttr = (book.title || '').replace(/'/g, "\\'");
            const safeAuthorAttr = (book.author || '').replace(/'/g, "\\'");

            return `
                <div class="col-md-4">
                    <div class="card book-card shadow-sm border-0 rounded-4 h-100 bg-body ${isDone ? 'book-done' : ''}">
                        <div class="book-cover-wrapper">
                            <img src="${coverSrc}" class="book-cover-img" alt="${book.title}"
                                 onerror="xuLyLoiAnhBia(this, '${safeTitleAttr}', '${safeAuthorAttr}')">
                        </div>
                        <div class="card-body p-4 d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                                <span class="badge ${statusBadgeClass}">${book.status}</span>
                                <span class="badge ${priorityBadgeClass}">Ưu tiên: ${prio}</span>
                            </div>
                            <h5 class="fw-bold mb-1 book-title-text">${book.title}</h5>
                            <p class="small text-muted mb-1"><i class="bi bi-person-pen me-1"></i>Tác giả: <strong>${book.author}</strong></p>
                            <p class="small text-muted mb-2"><i class="bi bi-calendar-event me-1"></i>Hạn đọc: <strong>${formattedDeadline}</strong></p>
                            <p class="small mb-3 flex-grow-1">${book.description || 'Cuốn sách hay trong tủ sách cá nhân.'}</p>
                            <div class="d-flex gap-2 mt-auto pt-3 border-top">
                                <button class="btn btn-sm ${isDone ? 'btn-outline-secondary' : 'btn-success'} flex-grow-1" onclick="toggleBookDone('${book.id}')">
                                    <i class="bi ${isDone ? 'bi-arrow-counterclockwise' : 'bi-check2-circle'} me-1"></i>${isDone ? 'Đọc lại' : 'Đã đọc xong'}
                                </button>
                                <button class="btn btn-sm btn-outline-primary" onclick="startEditBook('${book.id}')">
                                    <i class="bi bi-pencil-square"></i> Sửa
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteBook('${book.id}')">
                                    <i class="bi bi-trash"></i> Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* [MÃ: NV-07] Xử lý khi bấm nút "Lưu vào tủ sách" (Thêm mới hoặc Cập nhật sách đang sửa) */
    bookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const editingId = bookIdInput.value;
        const isEditing = Boolean(editingId);

        ghiLogF12('BIỂU MẪU SÁCH', isEditing ? `Bấm nút Lưu cập nhật sách ID: ${editingId}` : 'Bấm nút Thêm sách mới');

        if (!validateBookForm(isEditing)) {
            Swal.fire('Dữ liệu chưa hợp lệ (Mã 400)', 'Vui lòng kiểm tra lại các dòng nhắc lỗi màu đỏ dưới ô nhập.', 'warning');
            return;
        }

        const allBooks = getBooks();
        const bookData = {
            id: isEditing ? editingId : Date.now().toString(),
            title: titleInput.value.trim(),
            author: authorInput.value.trim(),
            deadline: deadlineInput.value,
            priority: priorityInput.value,
            status: statusInput.value,
            coverUrl: coverUrlInput.value.trim(),
            description: descriptionInput.value.trim()
        };

        if (isEditing) {
            const idx = allBooks.findIndex(b => String(b.id) === String(editingId));
            if (idx === -1) {
                hienThiThongBaoNgoaiLeHTML(404, 'Không tìm thấy mã sách cần sửa (Mã 404)', `Sách có ID ${editingId} không còn tồn tại trong bộ nhớ.`);
                return;
            }
            allBooks[idx] = bookData;
            saveBooks(allBooks);
            hienThiThongBaoNgoaiLeHTML(200, 'Cập nhật thông tin sách thành công (Mã 200)', `Đã lưu thay đổi cho cuốn "${bookData.title}".`);
            Swal.fire('Đã cập nhật (Mã 200)', `Đã lưu thay đổi cho cuốn "${bookData.title}".`, 'success');
        } else {
            allBooks.unshift(bookData);
            saveBooks(allBooks);
            hienThiThongBaoNgoaiLeHTML(200, 'Thêm sách mới thành công (Mã 200)', `Đã đưa cuốn "${bookData.title}" vào kệ sách cá nhân.`);
            Swal.fire('Đã thêm sách (Mã 200)', `Cuốn "${bookData.title}" đã được thêm vào kệ!`, 'success');
        }

        resetBookForm();
        renderBooks(false);
    });

    function resetBookForm() {
        bookForm.reset();
        bookIdInput.value = '';
        deadlineInput.value = defaultDate.toISOString().split('T')[0];
        priorityInput.value = 'Trung bình';
        statusInput.value = 'Chưa đọc';
        clearErrors();
        formHeading.innerHTML = `<i class="bi bi-plus-circle text-primary me-2 default-icon"></i><img data-icon="icon-add.png" class="title-icon me-2 dynamic-icon" alt="">Thêm sách mới vào tủ`;
        btnSubmitBook.innerHTML = `<i class="bi bi-save me-1"></i>Lưu vào tủ sách`;
        btnCancelEdit.classList.add('d-none');
        applyIconPack();
    }

    btnCancelEdit.addEventListener('click', () => {
        hienThiThongBaoNgoaiLeHTML(300, 'Đã hủy chế độ chỉnh sửa (Mã 300)', 'Biểu mẫu đã quay về trạng thái Thêm sách mới.');
        resetBookForm();
    });

    /* [MÃ: NV-08] Ba hàm gắn vào 3 nút bấm trên từng thẻ sách: Đánh dấu đọc xong, Sửa sách, Xóa sách */
    window.toggleBookDone = function(id) {
        const allBooks = getBooks();
        const book = allBooks.find(b => String(b.id) === String(id));
        if (!book) {
            hienThiThongBaoNgoaiLeHTML(404, 'Không tìm thấy sách cần đổi trạng thái (Mã 404)', `Không tồn tại sách có ID: ${id}`);
            return;
        }
        const trangThaiCu = book.status;
        book.status = (book.status === 'Đã đọc') ? 'Đang đọc' : 'Đã đọc';
        saveBooks(allBooks);
        renderBooks(false);
        hienThiThongBaoNgoaiLeHTML(200, 'Đổi trạng thái đọc thành công (Mã 200)', `Cuốn "${book.title}" đã chuyển từ "${trangThaiCu}" sang "${book.status}".`);
    };

    window.startEditBook = function(id) {
        const allBooks = getBooks();
        const book = allBooks.find(b => String(b.id) === String(id));
        if (!book) {
            hienThiThongBaoNgoaiLeHTML(404, 'Không tìm thấy sách để sửa (Mã 404)', `Không tồn tại sách có ID: ${id}`);
            return;
        }

        bookIdInput.value = book.id;
        titleInput.value = book.title || '';
        authorInput.value = book.author || '';
        deadlineInput.value = book.deadline || defaultDate.toISOString().split('T')[0];
        priorityInput.value = book.priority || 'Trung bình';
        statusInput.value = book.status || 'Chưa đọc';
        coverUrlInput.value = book.coverUrl || '';
        descriptionInput.value = book.description || 'Cuốn sách đáng đọc trong tủ sách cá nhân.';
        clearErrors();

        formHeading.innerHTML = `<i class="bi bi-pencil-square text-primary me-2"></i>Cập nhật thông tin sách`;
        btnSubmitBook.innerHTML = `<i class="bi bi-check2-circle me-1"></i>Lưu thay đổi`;
        btnCancelEdit.classList.remove('d-none');

        hienThiThongBaoNgoaiLeHTML(300, `Đang nạp dữ liệu sách lên khung sửa (Mã 300)`, `Đang chỉnh sửa cuốn "${book.title}". Hãy bấm Lưu thay đổi sau khi sửa xong.`);
        document.getElementById('bookFormCard').scrollIntoView({ behavior: 'smooth' });
    };

    window.deleteBook = function(id) {
        const allBooks = getBooks();
        const book = allBooks.find(b => String(b.id) === String(id));
        if (!book) {
            hienThiThongBaoNgoaiLeHTML(404, 'Không tìm thấy sách cần xóa (Mã 404)', `Không tồn tại sách có ID: ${id}`);
            return;
        }

        ghiLogF12('YÊU CẦU XÓA SÁCH', `Mở hộp thoại xác nhận xóa cuốn "${book.title}"`, { idSach: id });

        Swal.fire({
            title: 'Xóa cuốn sách này?',
            text: `Bạn có chắc muốn xóa cuốn "${book.title}" khỏi kệ sách không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Đồng ý xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                const updated = allBooks.filter(b => String(b.id) !== String(id));
                saveBooks(updated);
                renderBooks(false);
                hienThiThongBaoNgoaiLeHTML(200, 'Xóa sách thành công (Mã 200)', `Đã gỡ cuốn "${book.title}" khỏi tủ sách cá nhân.`);
                Swal.fire('Đã xóa! (Mã 200)', 'Cuốn sách đã được gỡ khỏi kệ.', 'success');
            } else {
                hienThiThongBaoNgoaiLeHTML(300, 'Đã hủy thao tác xóa sách (Mã 300)', `Cuốn "${book.title}" vẫn được giữ nguyên trên kệ.`);
            }
        });
    };

    /* [MÃ: NV-09] Gắn sự kiện lắng nghe khi người dùng gõ tìm kiếm, chọn lọc trạng thái/ưu tiên hoặc sắp xếp hạn đọc */
    [searchInput, filterStatus, filterPriority, sortDeadline].forEach(el => {
        const suKien = el.tagName === 'INPUT' ? 'input' : 'change';
        el.addEventListener(suKien, () => {
            renderBooks(true);
        });
    });

    // Nút gộp thêm danh sách sách từ tệp JSON bên ngoài vào kệ hiện tại
    const btnBatchImport = document.getElementById('btnBatchImport');
    if (btnBatchImport) {
        btnBatchImport.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target.result);
                    if (!Array.isArray(imported)) throw new Error('Format');
                    const currentBooks = getBooks();
                    imported.forEach((item, idx) => {
                        currentBooks.push({
                            id: item.id ? `${item.id}_${Date.now()}_${idx}` : `${Date.now()}_${idx}`,
                            title: item.title || 'Sách chưa đặt tên',
                            author: item.author || 'Chưa rõ tác giả',
                            deadline: item.deadline || defaultDate.toISOString().split('T')[0],
                            priority: item.priority || 'Trung bình',
                            status: item.status || 'Chưa đọc',
                            coverUrl: item.coverUrl || '',
                            description: item.description || 'Cuốn sách được gộp thêm từ tệp dữ liệu.'
                        });
                    });
                    saveBooks(currentBooks);
                    renderBooks(false);
                    hienThiThongBaoNgoaiLeHTML(200, 'Gộp thêm tệp sách thành công (Mã 200)', `Đã nối thêm ${imported.length} cuốn sách từ tệp ${file.name} vào kệ.`);
                    Swal.fire('Thành công (Mã 200)', `Đã gộp thêm ${imported.length} cuốn sách vào kệ!`, 'success');
                } catch {
                    hienThiThongBaoNgoaiLeHTML(400, 'Lỗi đọc tệp JSON gộp thêm (Mã 400)', `Tệp ${file.name} bị hỏng hoặc sai cấu trúc mảng JSON.`);
                    Swal.fire('Lỗi (Mã 400)', 'Tệp không đúng định dạng dữ liệu sách.', 'error');
                }
            };
            reader.readAsText(file);
            e.target.value = '';
        });
    }

    renderBooks(false);
});