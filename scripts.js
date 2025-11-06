// --- LOGIC HIỂN THỊ DROPDOWN USER (TỪ userData.js) ---
const renderUserDropdown = () => {
    // Kiểm tra và thoát nếu không tìm thấy phần tử HTML hoặc dữ liệu
    const menu = document.getElementById('userDropdownMenu');
    if (!menu || typeof userDropdownItems === 'undefined') return; 

    let htmlContent = '<ul>';
    userDropdownItems.forEach(item => {
        // Biến iconClass thành HTML cho icon
        const iconHtml = `<i class="${item.iconClass}"></i>`;
        
        // LOGIC SỬA ĐỔI: Chỉ thêm target="_blank" nếu link không phải là trang nội bộ (ví dụ: .html)
        const targetAttr = item.link.includes('.html') || item.link === '#' ? '' : 'target="_blank"';
        
        htmlContent += `
            <li>
                <a href="${item.link}" ${targetAttr}>
                    ${iconHtml}
                    ${item.name}
                </a>
            </li>
        `;
    });
    htmlContent += '</ul>';
    
    menu.innerHTML = htmlContent;
};
// --- LOGIC HIỂN THỊ PHẦN MỀM ---
const renderSoftwareCards = () => {
    const grid = document.getElementById('softwareGrid');
    if (!grid) return; 

    if (typeof softwareList === 'undefined' || softwareList.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: red;">Lỗi: Không tìm thấy dữ liệu phần mềm hoặc file softwareData.js chưa được tải.</p>';
        return;
    }
    
    let htmlContent = '';
    softwareList.forEach(item => {
        const cardHtml = `
            <div class="software-card">
                <div class="card-image-box" style="background-image: url('${item.image}');">
                    <span class="card-tag">${item.tag}</span>
                </div>
                <h4 class="card-title">${item.name}</h4>
                <div class="card-footer-stats">
                    <span>Lượt tải: ${item.downloads}</span>
                    <span class="star-rating">⭐</span>
                    <a href="${item.link}" class="btn btn-download">Download</a>
                </div>
            </div>
        `;
        htmlContent += cardHtml;
    });

    grid.innerHTML = htmlContent;

    // Gán sự kiện cho các nút Download (Software)
    const downloadBtns = grid.querySelectorAll('.btn-download');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Tải ' + e.currentTarget.closest('.software-card').querySelector('.card-title').textContent + ' (Chức năng mẫu)');
        });
    });
};

// --- LOGIC HIỂN THỊ TÀI LIỆU ---
const renderDocumentCards = () => {
    const grid = document.getElementById('documentsGrid');
    if (!grid) return;

    if (typeof documentsList === 'undefined' || documentsList.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: red;">Lỗi: Không tìm thấy dữ liệu tài liệu.</p>';
        return;
    }
    
    let htmlContent = '';
    documentsList.forEach((item, index) => {
        // Kiểm tra xem là link đơn hay mảng file (item.files là một mảng)
        const downloadButton = (typeof item.files !== 'undefined') 
            ? `<button class="btn btn-download btn-multi-file" data-index="${index}">Download</button>`
            : `<a href="${item.link}" class="btn btn-download">Download</a>`;
        
        const cardHtml = `
            <div class="software-card">
                <div class="card-image-box" style="background-image: url('${item.image}');">
                    <span class="card-tag">${item.tag}</span>
                </div>
                <h4 class="card-title">${item.name}</h4>
                <div class="card-footer-stats">
                    <span>Lượt tải: ${item.downloads}</span>
                    <span class="star-rating">⭐</span>
                    ${downloadButton}
                </div>
            </div>
        `;
        htmlContent += cardHtml;
    });

    grid.innerHTML = htmlContent;

    // 3. Gán sự kiện cho nút Download MULTI-FILE
    const multiFileBtns = grid.querySelectorAll('.btn-multi-file');
    multiFileBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            const item = documentsList[index];
            showMultiDownloadModal(item.name, item.files);
        });
    });
};

// Biến toàn cục cho Modal mới (Cần đặt sau DOMContentLoaded để tránh lỗi undefined)
let multiDownloadModal;
let modalMultiTitle;
let modalMultiBody;
let closeMultiBtn;

// Hàm hiển thị Modal
const showMultiDownloadModal = (itemName, files) => {
    if (!multiDownloadModal) return;

    modalMultiTitle.textContent = 'Tài Liệu: ' + itemName;
    
    let filesHtml = '<ul class="download-list">';
    files.forEach(file => {
        filesHtml += `
            <li>
                <span>${file.name}</span>
                <a href="${file.url}" class="btn btn-primary btn-small" download>Tải về</a>
            </li>
        `;
    });
    filesHtml += '</ul>';
    
    modalMultiBody.innerHTML = filesHtml;
    multiDownloadModal.style.display = 'block';
};

// --- Logic Modal và Khởi động ---
document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo biến Modal sau khi DOMContentLoaded
    multiDownloadModal = document.getElementById('multiDownloadModal');
    modalMultiTitle = document.getElementById('modalMultiTitle');
    modalMultiBody = document.getElementById('modalMultiBody');
    closeMultiBtn = document.querySelector('.close-btn-multi');
    
    if (closeMultiBtn) {
        closeMultiBtn.onclick = () => { if (multiDownloadModal) multiDownloadModal.style.display = 'none'; };
    }

    const modal = document.getElementById("notificationModal");
    const closeBtn = document.querySelector(".close-btn");
    const hideBtn = document.getElementById("hideModalBtn");
    const okBtn = document.getElementById("okModalBtn");
    
    // SỬA LỖI: Đổi tên Key để tránh xung đột với key cũ
    const MODAL_STORAGE_KEY = 'hideModalUntil'; 

    const closeModal = () => { if (modal) modal.style.display = "none"; };
    
    // SỬA LỖI: Hàm này sẽ ẩn 1 GIỜ (60*60*1000 milliseconds)
    const hideForOneHour = () => { 
        // Lấy thời gian hiện tại + 1 giờ
        const expiryTime = new Date().getTime() + (60 * 60 * 1000);
        localStorage.setItem(MODAL_STORAGE_KEY, expiryTime); 
        closeModal(); 
    };

    // Khởi tạo Modal (SỬA LỖI LOGIC)
    const hideUntil = localStorage.getItem(MODAL_STORAGE_KEY);
    const now = new Date().getTime();

    if (!hideUntil || now > parseInt(hideUntil)) { // Nếu chưa set, hoặc đã hết hạn
        if (hideUntil) { // Nếu đã hết hạn thì xóa key cũ
            localStorage.removeItem(MODAL_STORAGE_KEY);
        }
        setTimeout(() => { if (modal) modal.style.display = "block"; }, 500);
    }
    
    if (closeBtn) closeBtn.onclick = closeModal;
    if (okBtn) okBtn.onclick = closeModal;
    if (hideBtn) hideBtn.onclick = hideForOneHour; // Gán hàm đã sửa
    
    window.onclick = (event) => { 
        if (event.target === modal) { closeModal(); }
        if (event.target === multiDownloadModal) { if (multiDownloadModal) multiDownloadModal.style.display = 'none'; }
    };

    // === LOGIC MENU MOBILE MỚI ===
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.left-sidebar');

    if (menuToggle && sidebar) {
        // Tùy chọn: Mặc định ẩn sidebar nếu màn hình là mobile khi tải trang
        if (window.innerWidth <= 768) {
             sidebar.classList.add('mobile-hidden'); 
        }

        menuToggle.addEventListener('click', () => {
            // Thêm/Xóa class 'open' để trượt menu ra/vào
            sidebar.classList.toggle('open');
            // Xóa class 'mobile-hidden' sau lần đầu mở
            if (sidebar.classList.contains('mobile-hidden')) {
                sidebar.classList.remove('mobile-hidden');
            }
        });

        // Đóng sidebar khi click vào bất kỳ link nào bên trong (chỉ trên mobile)
        sidebar.querySelectorAll('.menu-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                }
            });
        });
    }

    // GỌI HÀM MỚI (chỉ gọi nếu các phần tử tồn tại)
    if (document.getElementById('documentsGrid')) {
        renderDocumentCards(); 
    }
    if (document.getElementById('softwareGrid')) {
        renderSoftwareCards(); 
    }
	// ... (logic Modal, Menu Mobile, renderDocumentCards, renderSoftwareCards đã có)

    // === GỌI HÀM HIỂN THỊ DROPDOWN ===
    renderUserDropdown(); 

    // === LOGIC ẨN/HIỆN DROPDOWN USER ===
    const dropdownContainer = document.getElementById('userInfoDropdownContainer');
    const toggleButton = document.getElementById('userInfoToggle');

    if (dropdownContainer && toggleButton) {
        toggleButton.addEventListener('click', (event) => {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a> (chuyển trang)
            event.stopPropagation(); // Ngăn chặn sự kiện click lan truyền lên window
            dropdownContainer.classList.toggle('open');
        });

        // Đóng dropdown khi click ra ngoài
        window.addEventListener('click', (event) => {
            // Kiểm tra nếu dropdown đang mở VÀ click không nằm trong container dropdown
            if (dropdownContainer.classList.contains('open') && !dropdownContainer.contains(event.target)) {
                dropdownContainer.classList.remove('open');
            }
        });
    }
});