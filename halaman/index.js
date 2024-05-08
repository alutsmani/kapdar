  // Fungsi untuk mengirim data ke Google Sheets menggunakan metode doPost di Apps Script
function postJSON(header) {
    // Link Santri Baru
    var url = "https://script.google.com/macros/s/AKfycbzANtzKbwFWCvWd4UP_OrezPyzoVzosXONdax0JdncfvnTsGIbQIrZMAnKZWq62dfQGhw/exec";

    var xmlhttp = new XMLHttpRequest();

    // Coba mengirim permintaan POST
    try {
        xmlhttp.open("POST", url, false);
        xmlhttp.setRequestHeader("User-Agent", "Mozilla/4.0 (compatible;MSIE 6.0; Windows NT 5.0)");
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlhttp.send(header);
    } catch (err) {
        return "Error: " + err.message;
    }

    // Periksa apakah pengiriman berhasil
    if (xmlhttp.status !== 200) {
        return "Error: " + xmlhttp.statusText;
    } else {
        // Jika berhasil, kembalikan respons teks
        return xmlhttp.responseText;
    }
}

function handleSearch() {
    const searchText = document.getElementById('nama').value.toLowerCase(); // Ambil teks nama dan ubah menjadi huruf kecil
    const containers = document.querySelectorAll('.container'); // Ambil semua kontainer
    const filteredEntries = []; // Array untuk menyimpan entri yang sesuai dengan pencarian
    let totalBayar = 0;

    // Iterasi melalui setiap kontainer
    containers.forEach(container => {
        const title = container.querySelector('h3');
        const nama = title.querySelector('.nama').textContent.toLowerCase(); // Ambil teks nama dan ubah menjadi huruf kecil
        
        // Periksa apakah teks pencarian ada dalam teks nama
        if (nama.includes(searchText)) {
            container.style.display = 'block'; // Tampilkan kontainer jika cocok dengan pencarian
            filteredEntries.push(container); // Tambahkan kontainer ke dalam array entri yang difilter

            // Ambil nilai pembayaran dari kontainer yang sesuai
            const BayarDetail = container.querySelector('.BayarDetail');
            if (BayarDetail) { // Periksa apakah elemen pembayaran ada
                // Tambahkan nilai pembayaran ke totalBayar
                totalBayar += parseFloat(BayarDetail.textContent);
            }
        } else {
            container.style.display = 'none'; // Sembunyikan kontainer jika tidak cocok dengan pencarian
        }
    });
    
    // Update label keterangan dengan informasi jumlah entri yang difilter
    const keteranganLabel = document.getElementById('keterangan');
    const totalEntries = containers.length;
    const filteredCount = filteredEntries.length;
    keteranganLabel.textContent = `Menampilkan (${filteredCount}) dari ${totalEntries} data keseluruhan`;

    const keteranganBayar = document.getElementById('keteranganBayar');
    keteranganBayar.textContent = `Total pembayaran: ${totalBayar}`;
}



// Fungsi untuk memuat data dari Google Sheets
function loadData() {
    // Mendapatkan nilai terpilih dari elemen select
    const cariDiniyahValue = document.getElementById('cariDiniyah').value;

    // URL default jika pilihan adalah "Semua"
    let url = 'https://script.google.com/macros/s/AKfycbzANtzKbwFWCvWd4UP_OrezPyzoVzosXONdax0JdncfvnTsGIbQIrZMAnKZWq62dfQGhw/exec';

    // Jika pilihan bukan "Semua", tambahkan parameter baru ke URL
    if (cariDiniyahValue !== 'Semua') {
        url += '?action=CariSesuaiHead&Head=Diniyah&Isi=' + encodeURIComponent(cariDiniyahValue);
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            renderData(data.data); // Ubah dari data menjadi data.data
            handleSearch()
        })
        .catch(error => console.error('Error fetching data:', error));
}




// Fungsi untuk merender data ke dalam HTML
function renderData(data) {
    const dataContainer = document.getElementById('dataContainer');
    dataContainer.innerHTML = '';

    data.forEach(item => {
        const container = document.createElement('div');
        container.classList.add('container');

        const title = document.createElement('h3');

        // Membuat elemen span untuk mengatur ukuran font yang berbeda
        const namaSpan = document.createElement('span');
        namaSpan.classList.add('nama');
        namaSpan.textContent = item.Nama;

        const nikSpan = document.createElement('span');
        nikSpan.classList.add('nik');
        nikSpan.textContent = `${item.NIK}`;

        const idsSpan = document.createElement('span');
        idsSpan.classList.add('ids');
        idsSpan.textContent = `IDS : ${item.IDS}`;

        // Menambahkan span ke dalam judul
        title.appendChild(namaSpan);
        title.appendChild(nikSpan);
        title.appendChild(idsSpan);

        title.addEventListener('click', function() {
        const details = container.querySelector('.details');
        const inputContainer = container.querySelector('.input-container');
        details.style.display = details.style.display === 'block' ? 'none' : 'block';
        inputContainer.style.display = inputContainer.style.display === 'block' ? 'none' : 'block';
        });

        const details = document.createElement('div');
        details.classList.add('details');

        // Buat tabel untuk menyusun data dalam dua kolom
        const table = document.createElement('table');
        const tbody = document.createElement('tbody');

        // Kolom pertama: label
        const th1 = document.createElement('th');
        th1.textContent = 'Informasi';
        tbody.appendChild(th1);

        // Kolom kedua: isi
        const th2 = document.createElement('th');
        th2.textContent = '';
        tbody.appendChild(th2);

        //Melanjutkan Ke
        const FormalRow = document.createElement('tr');
        const FormalLabel = document.createElement('td');
        FormalLabel.textContent = 'Formal';
        const FormalDetail = document.createElement('td');
        FormalDetail.textContent = item.Formal;
        FormalRow.appendChild(FormalLabel);
        FormalRow.appendChild(FormalDetail);
        tbody.appendChild(FormalRow);

        
        // Data Ayah
        
        const ayahRow = document.createElement('tr');
        const ayahLabel = document.createElement('td');
        ayahLabel.textContent = 'Ayah';
        const ayahDetail = document.createElement('td');
        ayahDetail.textContent = item.Ayah;
        ayahRow.appendChild(ayahLabel);
        ayahRow.appendChild(ayahDetail);
        tbody.appendChild(ayahRow);

        // Data Ibu
        const ibuRow = document.createElement('tr');
        const ibuLabel = document.createElement('td');
        ibuLabel.textContent = 'Ibu';
        const ibuDetail = document.createElement('td');
        ibuDetail.textContent = item.Ibu;
        ibuRow.appendChild(ibuLabel);
        ibuRow.appendChild(ibuDetail);
        tbody.appendChild(ibuRow);

        // Data Alamat
        const alamatRow = document.createElement('tr');
        const alamatLabel = document.createElement('td');
        alamatLabel.textContent = 'Alamat';
        const alamatDetail = document.createElement('td');
        alamatDetail.textContent = `${item.Dusun} ${item.RT}/${item.RW}, ${item.Desa}, ${item.Kecamatan}, ${item.Kabupaten}`;
        alamatRow.appendChild(alamatLabel);
        alamatRow.appendChild(alamatDetail);
        tbody.appendChild(alamatRow);



        // Data Masehi
        const MasehiRow = document.createElement('tr');
        const MasehiLabel = document.createElement('td');
        MasehiLabel.textContent = "Tanggal daftar";
        const MasehiDetail = document.createElement('td');
        MasehiDetail.textContent = item.Hijriyah + " H. - " + formatDate(item.Masehi) + " M.";
        MasehiRow.appendChild(MasehiLabel);
        MasehiRow.appendChild(MasehiDetail);
        tbody.appendChild(MasehiRow);

        // Data Pembayaran
        const BayarRow = document.createElement('tr');
        const BayarLabel = document.createElement('td');
        BayarLabel.textContent = "Pembayaran";
        const BayarDetail = document.createElement('td');
        BayarDetail.textContent = item.Bayar_Madrasah.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
        BayarRow.appendChild(BayarLabel);
        BayarRow.appendChild(BayarDetail);
        tbody.appendChild(BayarRow);

        table.appendChild(tbody);
        details.appendChild(table);

        // Membuat input dan tombol
        const inputContainer = document.createElement('div');
        inputContainer.classList.add('input-container');

        const selectElement = document.createElement('select');
        const options = ["", "Isti'dadiyah", "Ula", "Wustha", "Ulya"];
        // Iterasi melalui array pilihan dan menambahkan setiap pilihan ke dalam select
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option; // Nilai yang akan dikirim saat dipilih
            optionElement.textContent = option; // Teks yang akan ditampilkan dalam opsi
            selectElement.appendChild(optionElement); // Menambahkan opsi ke dalam select
        });


        const input2 = document.createElement('input');
        input2.type = 'text';
        input2.placeholder = 'Kelas';
        input2.style.width = '50px';

        const input3 = document.createElement('input');
        input3.type = 'text';
        input3.placeholder = 'Kel';
        input3.style.width = '50px';

        const submitButton = document.createElement('button');
        submitButton.classList.add('submit-button');
        submitButton.textContent = 'Kirim';
        
        const label = document.createElement('label');
        label.textContent = '.';
        label.style.color = 'green';

        submitButton.addEventListener('click', function() {
        try {
            var headerData = 'NIK=' + item.NIK + '&Diniyah=' + selectElement.value + '&KelasMD=' + input2.value + '&KelMD=' + input3.value
            var response = postJSON(headerData);

            // Tanggapi hasil respons sesuai kebutuhan Anda
            console.log(response);
            
            // Mengubah teks label menjadi "Data telah disimpan!" jika permintaan berhasil
            label.textContent = "Data telah disimpan!";
        } catch (error) {
            // Menangani kesalahan dengan menampilkan pesan kesalahan dan mengubah warna teks label menjadi merah
            console.error('Terjadi kesalahan:', error);
            label.textContent = "Terjadi kesalahan!";
            label.style.color = 'red'; // Mengubah warna teks label menjadi merah
        }
        });

        
        inputContainer.appendChild(selectElement);
        inputContainer.appendChild(input2);
        inputContainer.appendChild(input3);
        
        inputContainer.appendChild(submitButton);
        inputContainer.appendChild(label);

        container.appendChild(title);
        container.appendChild(details);
        container.appendChild(inputContainer);
        dataContainer.appendChild(container);

        selectElement.value = item.Diniyah || '';
        input2.value = item.KelasMD || '';
        input3.value = item.KelMD || '';


    });
}


// Memanggil fungsi loadData() saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    loadData();
});

function formatDate(inputDate) {
    // Membuat objek Date dari string tanggal
    const dateObject = new Date(inputDate);

    // Mendapatkan tanggal, bulan, dan tahun dari objek Date
    const day = dateObject.getDate().toString().padStart(2, '0'); // Mengonversi tanggal menjadi dua digit dengan fungsi padStart
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Bulan dimulai dari 0, jadi harus ditambah 1
    const year = dateObject.getFullYear();

    // Menggabungkan tanggal, bulan, dan tahun dalam format 'DD/MM/YYYY'
    const formattedDate = `${day}/${month}/${year}`;
    
    return formattedDate;
}