// Fungsi untuk mengirim data ke Google Sheets menggunakan metode doPost di Apps Script
function postJSON(header, callback) {
    // Link Santri Baru
    var url = "https://script.google.com/macros/s/AKfycbxSKqefJtNe16dnsnnGh_t5EyvdfHuQvFOG5vKVtgBrqdU1VhK1d6rMAmgklITgBkyojQ/exec";

    var xmlhttp = new XMLHttpRequest();

    // Handle response asynchronously
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status === 200) {
                // Jika berhasil, kembalikan respons teks ke fungsi pemanggil (callback)
                callback(xmlhttp.responseText);
            } else {
                // Jika terjadi kesalahan, tangani kesalahan di sini
                console.error("Error:", xmlhttp.statusText);
                callback("Error: " + xmlhttp.statusText);
            }
        }
    };

    xmlhttp.onerror = function() {
        // Tangani kesalahan jaringan di sini
        console.error("Network Error");
        callback("Network Error");
    };

    // Coba mengirim permintaan POST
    xmlhttp.open("POST", url, true); // Use asynchronous request
    xmlhttp.setRequestHeader("User-Agent", "Mozilla/4.0 (compatible;MSIE 6.0; Windows NT 5.0)");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(header);
}

function handleSearch() {
    const searchNoKamar = document.getElementById('NoKamar').value.toLowerCase();
    const searchText = document.getElementById('nama').value.toLowerCase(); // Ambil teks nama dan ubah menjadi huruf kecil

    const containers = document.querySelectorAll('.container'); // Ambil semua kontainer
    const filteredEntries = []; // Array untuk menyimpan entri yang sesuai dengan pencarian
    

    // Iterasi melalui setiap kontainer
    containers.forEach(container => {
        const title = container.querySelector('h3');
        const nama = title.querySelector('.nama').textContent.toLowerCase(); // Ambil teks nama dan ubah menjadi huruf kecil
        const nokamar = title.querySelector('.nokamar').textContent.toLowerCase();
        
        // Periksa apakah teks pencarian ada dalam teks nama
        if (nama.includes(searchText) &&
            nokamar.includes(searchNoKamar)) {

            container.style.display = 'block'; // Tampilkan kontainer jika cocok dengan pencarian
            filteredEntries.push(container); // Tambahkan kontainer ke dalam array entri yang difilter

            
        } else {
            container.style.display = 'none'; // Sembunyikan kontainer jika tidak cocok dengan pencarian
        }
    });
    
    // Update label keterangan dengan informasi jumlah entri yang difilter
    const keteranganLabel = document.getElementById('keterangan');
    const totalEntries = containers.length;
    const filteredCount = filteredEntries.length;
    keteranganLabel.textContent = `Menampilkan (${filteredCount}) dari ${totalEntries} data keseluruhan`;

}



// Fungsi untuk memuat data dari Google Sheets
function loadData() {
    const loader = document.getElementById('loader');
    document.querySelector('.loader').classList.remove('hidden');
    document.querySelector('.loader').classList.add('visible');

    const dataContainer = document.getElementById('dataContainer');
    dataContainer.innerHTML = '';

    // Mendapatkan nilai terpilih dari elemen select
    const CariPPSA = document.getElementById('CariPPSA').value;
    const CariStatusSantri = document.getElementById('CariStatusSantri').value;
    const CariDaerah = document.getElementById('CariDaerah').value;

    // URL default jika pilihan adalah "Semua"
    let url = 'https://script.google.com/macros/s/AKfycbxSKqefJtNe16dnsnnGh_t5EyvdfHuQvFOG5vKVtgBrqdU1VhK1d6rMAmgklITgBkyojQ/exec';

    // Jika pilihan bukan "Semua", tambahkan parameter baru ke URL
    if (CariPPSA !== 'Semua') {
        url += '?action=CariDaerah&IDS=' + encodeURIComponent(CariPPSA) + '&StatusSantri=' + encodeURIComponent(CariStatusSantri) + '&Daerah=' + encodeURIComponent(CariDaerah);

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

        const noSpan = document.createElement('span');
        noSpan.classList.add('nokamar');
        // Memastikan item.NoKamar diperlakukan sebagai string
        let noKamarString = String(item.NoKamar).padStart(2, '0');
        noSpan.textContent = noKamarString;

        const idsSpan = document.createElement('span');
        idsSpan.classList.add('ids');
        idsSpan.textContent = `IDS : ${item.IDS}`;

        // Menambahkan span ke dalam judul
        title.appendChild(namaSpan);
        title.appendChild(noSpan);
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
        const DiniyahRow = document.createElement('tr');
        const DiniyahLabel = document.createElement('td');
        DiniyahLabel.textContent = 'Diniyah';
        const DiniyahDetail = document.createElement('td');
        DiniyahDetail.textContent = `${item.Diniyah} [${item.KelasMD}.${item.KelMD}]`;
        DiniyahRow.appendChild(DiniyahLabel);
        DiniyahRow.appendChild(DiniyahDetail);
        tbody.appendChild(DiniyahRow);

        //Melanjutkan Ke
        const FormalRow = document.createElement('tr');
        const FormalLabel = document.createElement('td');
        FormalLabel.textContent = 'Formal';
        const FormalDetail = document.createElement('td');
        FormalDetail.textContent = `${item.Formal} [${item.KelasFormal}.${item.KelFormal}]`;
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
        MasehiLabel.textContent = "TimeStamp:";
        const MasehiDetail = document.createElement('td');
        MasehiDetail.textContent = formatDate(item.TanggalUpdate);
        MasehiRow.appendChild(MasehiLabel);
        MasehiRow.appendChild(MasehiDetail);
        tbody.appendChild(MasehiRow);

        

        table.appendChild(tbody);
        details.appendChild(table);

        // Membuat input dan tombol
        const inputContainer = document.createElement('div');
        inputContainer.classList.add('input-container');

        const selectElement = document.createElement('select');
        const options = ["Mukim / Mondok", "Khoriji / Nyulok", "Boyong", "Guru Tugas", "Deleted", "Pengurus", "Alumni"];
        // Iterasi melalui array pilihan dan menambahkan setiap pilihan ke dalam select
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option; // Nilai yang akan dikirim saat dipilih
            optionElement.textContent = option; // Teks yang akan ditampilkan dalam opsi
            selectElement.appendChild(optionElement); // Menambahkan opsi ke dalam select
        });


        const input2 = document.createElement('input');
        input2.type = 'text';
        input2.placeholder = 'Daerah';
        input2.style.width = '50px';

        const input3 = document.createElement('input');
        input3.type = 'text';
        input3.placeholder = 'No';
        input3.style.width = '50px';

        const submitButton = document.createElement('button');
        submitButton.classList.add('submit-button');
        submitButton.textContent = 'Kirim';
        
        const label = document.createElement('label');
        label.textContent = '.';
        label.style.color = 'green';

        submitButton.addEventListener('click', function() {
            try {
                let noKamarFormatted = String(input3.value).padStart(2, '0');
                var headerData = 'action=PostIDS&IDS=' + item.IDS + '&StatusSantri=' + selectElement.value + '&Daerah=' + input2.value + '&NoKamar=\'' + noKamarFormatted;

                postJSON(headerData, function(response) {
                    // Tanggapi hasil respons sesuai kebutuhan Anda
                    console.log(response);

                    // Mengubah teks label menjadi "Data telah disimpan!" jika permintaan berhasil
                    label.textContent = "Data telah disimpan!";
                });
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

        selectElement.value = item.StatusSantri || '';
        input2.value = item.Daerah || '';
        input3.value = item.NoKamar || '';

        
    });
    const loader = document.getElementById('loader');
    document.querySelector('.loader').classList.remove('visible');
    document.querySelector('.loader').classList.add('hidden');
}


// Memanggil fungsi loadData() saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    //loadData();
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
