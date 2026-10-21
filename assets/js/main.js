document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('total-books')) {
        const books = getBooks();
        document.getElementById('total-books').textContent = books.length;
        document.getElementById('read-books').textContent = books.filter(b => b.status === 'Đã đọc').length;
        document.getElementById('unread-books').textContent = books.filter(b => b.status === 'Chưa đọc').length;
    }
});