const bukubuku = [];
const sesuaiPencarian = [];
const RENDER_EVENT = "tampil-buku";
const SAVED_EVENT = "buku-tersimpan";
const STORAGE_KEY = "bookshelf-app";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    tambahBuku();
  });

  if (cekStorage()) {
    ambildataStorage();
  }
});

function simpankeStorage(pesan) {
  if (cekStorage()) {
    const string = JSON.stringify(bukubuku);
    localStorage.setItem(STORAGE_KEY, string);
    alert(pesan);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function tambahBuku() {
  const Title = document.getElementById("title").value;
  const Author = document.getElementById("author").value;
  const Year = document.getElementById("year").value;
  const Selesai = document.getElementById("isComplete").checked;

  function idUnik() {
    return +new Date();
  }

  const idBuku = idUnik();
  const Buku = buatBuku(idBuku, Title, Author, Year, Selesai);
  bukubuku.push(Buku);

  simpankeStorage("Buku berhasil ditambahkan");
}

function cekStorage() {
  if (typeof Storage === undefined) {
    alert("Tidak bisa menyimpan ke storage browser");
    return false;
  }
  return true;
}

function ambildataStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const buku of data) {
      bukubuku.push(buku);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function buatBuku(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function satuListBuku(idBuku) {
  for (const listbuku of bukubuku) {
    if (listbuku.id === idBuku) {
      return listbuku;
    }
  }
  return null;
}

function indexListBuku(idBuku) {
  for (const index in bukubuku) {
    if (bukubuku[index].id === idBuku) {
      return index;
    }
  }

  return -1;
}

function hapusBuku(idBuku) {
  if(confirm("Yakin untuk menghapus data buku ini?")){
    const bukuTarget = indexListBuku(idBuku);
    if (bukuTarget === -1) return;
    bukubuku.splice(bukuTarget, 1);
    simpankeStorage("Data buku terhapus");
  }
}

function belumDibaca(idBuku) {
  const bukuTarget = satuListBuku(idBuku);

  if (bukuTarget == null) return;

  bukuTarget.isComplete = false;

  simpankeStorage("Buku ditandai belum dibaca");
}

function sudahDibaca(idBuku) {
  const bukuTarget = satuListBuku(idBuku);

  if (bukuTarget == null) return;

  bukuTarget.isComplete = true;

  simpankeStorage("Buku ditandai sudah dibaca");
}

function editBuku(idBuku) {
  const bukuTarget = satuListBuku(idBuku);
  let judulBaru = prompt("Masukkan judul baru untuk buku ini: ");
  let penulisBaru = prompt("Masukkan nama penulis baru untuk buku ini: ");
  let tahunBaru = prompt("Masukkan tahun terbit pengganti untuk buku ini: ");

  if (bukuTarget == null) return;

  if(judulBaru == "" || judulBaru == null){
    judulBaru = bukuTarget.title;
  }

  if(penulisBaru == "" || penulisBaru == null){
    penulisBaru = bukuTarget.author;
  }

  if(tahunBaru == "" || tahunBaru == null){
    tahunBaru = bukuTarget.year;
  }

  bukuTarget.title = judulBaru;
  bukuTarget.author = penulisBaru;
  bukuTarget.year = parseInt(tahunBaru);

  simpankeStorage("Perubahan Tersimpan");
}

function buatStruktur(listbuku) {
  const judul = document.createElement("h2");
  judul.innerText = listbuku.title;

  const penulis = document.createElement("p");
  penulis.innerText = `Penulis: ${listbuku.author}`;

  const tahun = document.createElement("p");
  tahun.innerText = `Tahun Terbit: ${listbuku.year}`;

  const bagianTeks = document.createElement("div");
  bagianTeks.append(judul, penulis, tahun);

  const kotak = document.createElement("div");
  kotak.classList.add("kotakin");
  kotak.append(bagianTeks);
  kotak.setAttribute("id", listbuku.id);

  if (!listbuku.isComplete) {
    const btnsudahDibaca = document.createElement("button");
    btnsudahDibaca.classList.add("button");
    btnsudahDibaca.innerText = "Sudah Dibaca";

    const btnDelete = document.createElement("button");
    btnDelete.classList.add("button");
    btnDelete.innerText = "Hapus";

    const btnEdit = document.createElement("button");
    btnEdit.classList.add("button");
    btnEdit.innerText = "Edit";

    btnsudahDibaca.addEventListener("click", function () {
      sudahDibaca(listbuku.id);
    });

    btnDelete.addEventListener("click", function () {
      hapusBuku(listbuku.id);
    });

    btnEdit.addEventListener("click", function () {
      editBuku(listbuku.id);
    });

    kotak.append(btnsudahDibaca, btnEdit, btnDelete);
  } else {
    const btnbelumDibaca = document.createElement("button");
    btnbelumDibaca.classList.add("button");
    btnbelumDibaca.innerText = "Belum Dibaca";

    const btnDelete = document.createElement("button");
    btnDelete.classList.add("button");
    btnDelete.innerText = "Hapus";

    const btnEdit = document.createElement("button");
    btnEdit.classList.add("button");
    btnEdit.innerText = "Edit";

    btnbelumDibaca.addEventListener("click", function () {
      belumDibaca(listbuku.id);
    });

    btnDelete.addEventListener("click", function () {
      hapusBuku(listbuku.id);
    });

    btnEdit.addEventListener("click", function () {
      editBuku(listbuku.id);
    });

    kotak.append(btnbelumDibaca, btnEdit, btnDelete);
  }

  return kotak;
}

const searchbar = document.getElementById('Search');
searchbar.addEventListener("keyup", function(){
    let infoin = document.getElementById('info');
    infoin.innerText = '';
    sesuaiPencarian.length = 0;
    const dicari = searchbar.value.toLowerCase();
    if(dicari == ""){
        document.dispatchEvent(new Event(RENDER_EVENT));
    }else{
        for (const listbuku of bukubuku) {
            if (listbuku.title.toLowerCase().includes(dicari) || listbuku.author.toLowerCase().includes(dicari) || String(listbuku.year).toLowerCase().includes(dicari)) {
                sesuaiPencarian.push(listbuku);
                cetakBukuBuku(sesuaiPencarian);
            }

            if(sesuaiPencarian.length <= 0 ){
                infoin.innerText = 'Tidak ditemukan';
                cetakBukuBuku(sesuaiPencarian);
            }else{
                infoin.innerText = 'Ditemukan ' + sesuaiPencarian.length + ' buku.';
            }
          }
          return null;
    }
})

function cetakBukuBuku(array){
    const belumSelesaibaca = document.getElementById("belum");
    belumSelesaibaca.innerHTML = "";
  
    const sudahSelesaibaca = document.getElementById("sudah");
    sudahSelesaibaca.innerHTML = "";
  
    for (const itemBuku of array) {
      const struktur = buatStruktur(itemBuku);
      if (!itemBuku.isComplete) {
        belumSelesaibaca.append(struktur);
      } else {
        sudahSelesaibaca.append(struktur);
      }
    }
}

document.addEventListener(RENDER_EVENT, function(){
    cetakBukuBuku(bukubuku)
});

document.addEventListener(SAVED_EVENT, function () {
    console.log(bukubuku);
  document.dispatchEvent(new Event(RENDER_EVENT));
});
