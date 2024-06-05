

function toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
    var content = document.getElementById('content');
    
    if (sidebar && content) {
        sidebar.classList.toggle('active');
        content.classList.toggle('active');
    } else {
        console.error('Sidebar or content element not found');
    }
}

function handleSearchDomisini() {
    const searchPPSA = document.getElementById('CariPPSA').options[document.getElementById('CariPPSA').selectedIndex].textContent.toLowerCase();
    const searchText = document.getElementById('CariDaerah').value.toLowerCase(); // Ambil teks nama dan ubah menjadi huruf kecil

    const containers = document.querySelectorAll('.containerDomisili'); // Ambil semua kontainer
    const filteredEntries = []; // Array untuk menyimpan entri yang sesuai dengan pencarian
    

    // Iterasi melalui setiap kontainer
    containers.forEach(container => {
        const title = container.querySelector('h3');
        const nama = title.querySelector('.nama').textContent.toLowerCase(); // Ambil teks nama dan ubah menjadi huruf kecil
        const PPSA = title.querySelector('.ppsa').textContent.toLowerCase();
        
        // Periksa apakah teks pencarian ada dalam teks nama
        if (nama.includes(searchText + '.') &&
            PPSA.includes(searchPPSA)) {

            container.style.display = 'block'; // Tampilkan kontainer jika cocok dengan pencarian
            filteredEntries.push(container); // Tambahkan kontainer ke dalam array entri yang difilter

            
        } else {
            container.style.display = 'none'; // Sembunyikan kontainer jika tidak cocok dengan pencarian
        }
    });
}

// Fungsi untuk memuat data dari Google Sheets
function loadDataDomisili() {
    const loader = document.getElementById('loaderSideBar');
    loader.classList.remove('hidden');
    loader.classList.add('visible');

    const dataContainer = document.getElementById('dataContainerSideBar');
    dataContainer.innerHTML = '';

    // Mendapatkan nilai terpilih dari elemen select
    const CariPPSA = document.getElementById('CariPPSA').value;
    const CariDaerah = document.getElementById('CariDaerah').value;

    // URL default jika pilihan adalah "Semua"
    let url = 'https://script.google.com/macros/s/AKfycbwrsqq3HnTZboySMizPefTYVlq71DUSboCWAjaGAk4A_E98DEQVrci1mP6X5hBSkO1rZg/exec';
    
    // Jika pilihan bukan "Semua", tambahkan parameter baru ke URL
    //if (CariPPSA !== 'Semua') {
        //url += '?action=CariDaerah&PPSA=' + encodeURIComponent(CariPPSA) + '&Daerah=' + encodeURIComponent(CariDaerah);
    //}

    fetch(url)
        .then(response => response.json())
        .then(data => {
            renderDataSideBar(data.data); // Ubah dari data menjadi data.data
            handleSearchDomisini()
        })
        .catch(error => console.error('Error fetching data:', error));
}


// Render data untuk sidebar
function renderDataSideBar(data) {
    const dataContainer = document.getElementById('dataContainerSideBar');
    dataContainer.innerHTML = '';

    data.forEach(item => {
        const container = document.createElement('div');
        container.classList.add('containerDomisili');

        const title = document.createElement('h3');

        const namaSpan = document.createElement('span');
        namaSpan.classList.add('nama');
        namaSpan.textContent = item.Daerah + '.' + String(item.NoKamar).padStart(2, '0');

        const PPSASpan = document.createElement('span');
        PPSASpan.classList.add('ppsa');
        PPSASpan.textContent = item.PPSA;

        const idsSpan = document.createElement('span');
        idsSpan.classList.add('ids');
        idsSpan.textContent = item.KetuaKamar;



        // Menambahkan spasi di antara elemen span
        title.appendChild(namaSpan);
        title.appendChild(document.createTextNode(' ')); // Tambahkan spasi di antara elemen
        title.appendChild(PPSASpan);
        title.appendChild(document.createTextNode(' ')); // Tambahkan spasi di antara elemen
        title.appendChild(idsSpan);

        container.appendChild(title);
        dataContainer.appendChild(container);
    });

    // Memperbaiki pemilihan elemen loader
    const loader = document.getElementById('loaderSideBar');
    loader.classList.remove('visible');
    loader.classList.add('hidden');
}

