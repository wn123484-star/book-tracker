const bookForm = document.getElementById('bookForm');
const bookGrid = document.getElementById('bookGrid');

function renderBooks() {
    const books = getBooks();
    bookGrid.innerHTML = '';
    
    if(books.length === 0) {
        bookGrid.innerHTML = `
            <div class="col-12">
                <div class="empty-state bg-body rounded-4 shadow-sm py-5">
                    <i class="bi bi-journal-x fs-1 d-block mb-3 default-icon"></i>
                    <img data-icon="icon-empty.png" class="empty-icon mb-3 dynamic-icon" alt="">
                    <h5 class="text-muted">Thư viện trống</h5>
                    <p class="mb-0">Hãy thêm cuốn sách đầu tiên của bạn ở biểu mẫu phía trên.</p>
                </div>
            </div>`;
        applyIconPack();
        return;
    }

    books.forEach((book, index) => {
        let badgeClass = 'text-bg-secondary';
        let iconClass = 'bi-bookmark';
        
        if(book.status === 'Đã đọc') { badgeClass = 'text-bg-success'; iconClass = 'bi-check-circle-fill'; }
        if(book.status === 'Đang đọc') { badgeClass = 'text-bg-warning'; iconClass = 'bi-book-half'; }
        
        const defaultImg = 'https://placehold.co/300x400/e9ecef/6c757d?text=No+Cover';
        const imgUrl = book.coverUrl && book.coverUrl.trim() !== '' ? book.coverUrl : defaultImg;
        
        bookGrid.innerHTML += `
            <div class="col-lg-3 col-md-4 col-sm-6">
                <div class="card h-100 card-hover shadow-sm bg-body">
                    <img src="${imgUrl}" class="card-img-top book-cover" onerror="this.src='${defaultImg}'">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold text-truncate" title="${book.title}">${book.title}</h5>
                        <p class="card-text mb-3 text-muted text-truncate"><i class="bi bi-person me-1"></i>${book.author}</p>
                        <div class="mb-4">
                            <span class="badge ${badgeClass} px-3 py-2 rounded-pill"><i class="bi ${iconClass} me-1"></i>${book.status}</span>
                        </div>
                        <div class="mt-auto d-flex gap-2">
                            <button class="btn btn-light flex-grow-1 border" onclick="editBook(${index})"><i class="bi bi-pencil"></i> Sửa</button>
                            <button class="btn btn-outline-danger px-3" onclick="deleteBook(${index})"><i class="bi bi-trash3"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const books = getBooks();
    const id = document.getElementById('bookId').value;
    const coverInput = document.getElementById('coverUrl').value;
    
    const newBook = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        coverUrl: coverInput,
        status: document.getElementById('status').value
    };
    
    if (id !== '') {
        books[id] = newBook;
    } else {
        books.push(newBook);
    }
    
    saveBooks(books);
    bookForm.reset();
    document.getElementById('bookId').value = '';
    renderBooks();
    
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Đã lưu thông tin sách',
        showConfirmButton: false,
        timer: 1500
    });
});

const btnBatchImport = document.getElementById('btnBatchImport');
if (btnBatchImport) {
    btnBatchImport.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const jsonData = JSON.parse(event.target.result);
                if (Array.isArray(jsonData)) {
                    const currentBooks = getBooks();
                    const newBooks = currentBooks.concat(jsonData);
                    saveBooks(newBooks);
                    renderBooks();
                    Swal.fire('Thành công', `Đã nhập thêm ${jsonData.length} cuốn sách vào thư viện!`, 'success');
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

window.deleteBook = (index) => {
    Swal.fire({
        title: 'Xóa sách?',
        text: "Bạn không thể hoàn tác hành động này!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Đồng ý xóa',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            const books = getBooks();
            books.splice(index, 1);
            saveBooks(books);
            renderBooks();
            Swal.fire('Đã xóa!', 'Sách đã bị xóa khỏi thư viện.', 'success');
        }
    });
};

window.editBook = (index) => {
    const books = getBooks();
    const b = books[index];
    document.getElementById('bookId').value = index;
    document.getElementById('title').value = b.title;
    document.getElementById('author').value = b.author;
    document.getElementById('coverUrl').value = b.coverUrl || '';
    document.getElementById('status').value = b.status;
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

document.addEventListener('DOMContentLoaded', renderBooks);