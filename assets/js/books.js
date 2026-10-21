let books = [];
let editingId = null;

const form = document.getElementById('bookForm');
const tbody = document.getElementById('bookTableBody');
const btnSubmit = document.getElementById('btnSubmit');
const btnCancel = document.getElementById('btnCancel');
const searchInput = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');
const importJson = document.getElementById('importJson');

document.addEventListener('DOMContentLoaded', () => {
    books = getBooks();
    renderTable(books);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const deadline = document.getElementById('deadline').value;
    
    if(deadline < today) {
        Swal.fire('Lỗi!', 'Ngày dự kiến không được ở quá khứ', 'error');
        return;
    }

    const bookData = {
        id: editingId || generateId(),
        title: document.getElementById('title').value.trim(),
        author: document.getElementById('author').value.trim(),
        deadline: deadline,
        priority: document.getElementById('priority').value,
        status: document.getElementById('status').value
    };

    if(editingId) {
        const index = books.findIndex(b => b.id === editingId);
        books[index] = bookData;
        Swal.fire('Thành công', 'Đã cập nhật thông tin sách', 'success');
    } else {
        books.push(bookData);
        Swal.fire('Thành công', 'Đã thêm sách mới', 'success');
    }

    saveBooks(books);
    resetForm();
    renderTable(books);
});

btnCancel.addEventListener('click', resetForm);

searchInput.addEventListener('input', applyFilters);
filterStatus.addEventListener('change', applyFilters);

if(importJson) {
    importJson.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if(!file) return;
        
        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const importedData = JSON.parse(evt.target.result);
                if(Array.isArray(importedData)) {
                    books = importedData;
                    saveBooks(books);
                    renderTable(books);
                    Swal.fire('Thành công', 'Đã nạp dữ liệu từ tệp', 'success');
                } else {
                    Swal.fire('Lỗi', 'Định dạng JSON không hợp lệ', 'error');
                }
            } catch(err) {
                Swal.fire('Lỗi', 'Không thể đọc tệp JSON', 'error');
            }
            importJson.value = '';
        };
        reader.readAsText(file);
    });
}

function applyFilters() {
    const term = searchInput.value.toLowerCase();
    const status = filterStatus.value;
    
    let filtered = books.filter(b => 
        (b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term))
    );
    
    if(status !== 'all') {
        filtered = filtered.filter(b => b.status === status);
    }
    
    filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    renderTable(filtered);
}

function renderTable(dataToRender) {
    tbody.innerHTML = '';
    if(dataToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-3">Không có dữ liệu!</td></tr>';
        return;
    }
    
    dataToRender.forEach(b => {
        let statusClass = b.status === 'Đã đọc' ? 'bg-success' : (b.status === 'Đang đọc' ? 'bg-warning text-dark' : 'bg-secondary');
        let priorClass = b.priority === 'Cao' ? 'text-danger fw-bold' : (b.priority === 'Trung bình' ? 'text-primary' : 'text-muted');
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="fw-bold">${b.title}</td>
            <td>${b.author}</td>
            <td>${formatDate(b.deadline)}</td>
            <td class="${priorClass}">${b.priority}</td>
            <td><span class="badge ${statusClass}">${b.status}</span></td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editBook('${b.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteBook('${b.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.editBook = function(id) {
    const b = books.find(x => x.id === id);
    if(!b) return;
    
    editingId = id;
    document.getElementById('title').value = b.title;
    document.getElementById('author').value = b.author;
    document.getElementById('deadline').value = b.deadline;
    document.getElementById('priority').value = b.priority;
    document.getElementById('status').value = b.status;
    
    btnSubmit.innerHTML = '<i class="fas fa-save"></i> Cập Nhật';
    btnCancel.classList.remove('d-none');
    window.scrollTo({top: 0, behavior: 'smooth'});
};

window.deleteBook = function(id) {
    Swal.fire({
        title: 'Bạn chắc chắn muốn xóa?',
        text: "Dữ liệu không thể khôi phục!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            books = books.filter(b => b.id !== id);
            saveBooks(books);
            applyFilters();
            Swal.fire('Đã xóa!', 'Sách đã được xóa', 'success');
        }
    });
};

function resetForm() {
    form.reset();
    editingId = null;
    btnSubmit.innerHTML = '<i class="fas fa-save"></i> Lưu Sách';
    btnCancel.classList.add('d-none');
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}