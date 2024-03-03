const dbConn = require("../db/mysql_connect")
const bcrypt = require("bcrypt")
const Response = require("../utils/response")




const login = async (req, res) => {
    const kullanici_adi = req.body.kullanici_adi
    const sifre = req.body.sifre
    dbConn.query("SELECT * FROM kullanicilar WHERE kullanici_adi=?",
        [kullanici_adi], (error, results) => {
            if (results.length > 0) {
                const comparePassword = bcrypt.compare(sifre, results[0].sifre)
                if (comparePassword) {
                    return new Response(results).basarili_giris(res)
                } else {
                    return res.status(203).json({
                        success: false,
                        message: "Kullanıcı veya Şifre Uyumsuz"
                    })
                }
            } else {
                return res.status(203).json({
                    success: false,
                    message: "Kullanıcı Girişi Başarısız"
                })
            }
        })
}

const register = async (req, res) => {
    const kullanici_adi = req.body.kullanici_adi
    const sifre = await bcrypt.hash(req.body.sifre, 10)
    const eposta = req.body.eposta
    const adi = req.body.adi
    const soyadi = req.body.soyadi
    const tel_no = req.body.tel_no
    const cinsiyet = req.body.cinsiyet
    const dogum_tarihi = req.body.dogum_tarihi
    dbConn.query("select * from kullanicilar where kullanici_adi=?", kullanici_adi, (err, result) => {
        if (result.length > 0) {
            return new Response(result, "Böyle bir kayıt var").duplicated(res)
        } else {
            dbConn.query("INSERT INTO kullanicilar (kullanici_adi,sifre,eposta,adi,soyadi,tel_no,cinsiyet,dogum_tarihi) VALUES (?,?,?,?,?,?,?,?)"
                , [kullanici_adi, sifre, eposta, adi, soyadi, tel_no, cinsiyet, dogum_tarihi], (err, result) => {
                    if (!err) {
                        return new Response(result, "Succesful").created(res)
                    } else {
                        console.log(err)
                    }


                })
        }
    })
}



const calisan_getir = (req, res) => {
    dbConn.query("SELECT calisan_ad,calisan_soyad,dogum_tarihi,pozisyon,bolum,ise_baslama_tarihi,maas FROM calisanlar", (error, result) => {
        if (error) {
            console.log("Sunucu yanıt vermiyor")
            return new Response().error500(res)
        } else {
            res.json({ data: result })
        }
    })
}

const egitim_getir = (req, res) => {
    dbConn.query("SELECT egitim_ad FROM egitim", (error, result) => {
        if (error) {
            console.log("Sunucu yanıt vermiyor")
            return new Response().error500(res)
        } else {
            res.json({ data: result })
        }
    })
}

const calisan_sil = (req, res) => {
    const calisan_id = req.params.calisan_id; // Parametreyi URL'den al
    dbConn.query("DELETE FROM calisanlar WHERE calisan_id = ?", [calisan_id], (error, results) => {
        if (error) {
            console.error("Silme işlemi sırasında hata oluştu:", error);
            res.status(500).send("Sunucu hatası");
        } else {
            // Başarılı silme işleminden sonra uygun bir yanıt gönderin
            res.status(200).send({ message: "Kayıt başarıyla silindi", calisan_id: calisan_id });
        }
    });
};




const calisan_ekle = async (req, res) => {
    const { calisan_ad, calisan_soyad, dogum_tarihi, pozisyon, bolum, ise_baslama_tarihi, maas } = req.body;
    const query = "INSERT INTO calisanlar (calisan_ad, calisan_soyad, dogum_tarihi, pozisyon, bolum, ise_baslama_tarihi, maas) VALUES (?, ?, ?, ?, ?, ?, ?)";

    dbConn.query(query, [calisan_ad, calisan_soyad, dogum_tarihi, pozisyon, bolum, ise_baslama_tarihi, maas], (err, result) => {
        if (err) {
            console.error("Sorguda Hata Oluştu:", err);
            res.status(500).send("Sunucu Hatası");
            return;
        }
        res.status(201).json(result);
    });
};


const getNewEgitim = (req, res) => {
    const query = 'SELECT egitim_logs.description,egitim_logs.created_at FROM egitim_logs';
    dbConn.query(query, (err, results) => {
        if (err) {
            console.error("Sorguda Hata Oluştu:", err);
            res.status(500).send("Sunucu Hatası");
            return;

        }
        res.json(results);
    });
};

const egitim_ekle = async (req, res) => {
    const { egitim_ad, calisan_id } = req.body; // Destructuring can be done in one line
    const query = "INSERT INTO egitim (egitim_ad, calisan_id) VALUES (?, ?)";

    dbConn.query(query, [egitim_ad, calisan_id], (err, result) => {
        if (err) {
            console.error("Sorguda Hata Oluştu:", err);
            res.status(500).send("Sunucu Hatası");
            return;
        }
        res.status(201).json(result);
    });
};

const getTotalDeğerlendirme = async (req, res) => {
    const query = 'SELECT COUNT(*) as totalDegerlendirme FROM degerlendirme';
    dbConn.query(query, (err, results) => {
        if (err) {
            console.error("Sorguda Hata Oluştu:", err);
            res.status(500).send("Sunucu Hatası");
            return;

        }
        res.json(results);
    });
}

const getTotalPuan = async (req, res) => {
    const query = 'SELECT SUM(degerlendirme_puan) as totalPuan FROM degerlendirme';
    dbConn.query(query, (err, results) => {
        if (err) {
            console.error("Sorguda Hata Oluştu:", err);
            res.status(500).send("Sunucu Hatası");
            return;

        }
        res.json(results);
    });
}

const getTotalBasvuru = async (req, res) => {
    const query = 'SELECT COUNT(*) as totalBasvuru FROM ise_basvuranlar';
    dbConn.query(query, (err, results) => {
        if (err) {
            console.error("Sorguda Hata Oluştu:", err);
            res.status(500).send("Sunucu Hatası");
            return;

        }
        res.json(results);
    });
}

const basvurulanPozisyon = async (req, res) => {
    const query = 'SELECT COUNT(ise_basvuranlar.basvuran_id) as degerlendirmeSayisi, ise_basvuranlar.basvurulan_pozisyon as degerlendirmePozisyon FROM ise_basvuranlar GROUP BY ise_basvuranlar.basvurulan_pozisyon LIMIT 1 ';
    dbConn.query(query, (err, results) => {
        if (err) {
            console.error("Sorguda Hata Oluştu:", err);
            res.status(500).send("Sunucu Hatası");
            return;

        }
        res.json(results);
    });
}


const basvuran_getir = (req, res) => {
    dbConn.query("SELECT basvuran_ad,basvuran_soyad,basvuran_dogum_tarihi,basvurulan_pozisyon,basvuru_tarihi FROM ise_basvuranlar", (error, result) => {
        if (error) {
            console.log("Sunucu yanıt vermiyor")
            return new Response().error500(res)
        } else {
            res.json({ data: result })
        }
    })
}


const basariliCalisan = async (req, res) => {
    const query = 'SELECT COUNT(*) as basariliCalisan FROM degerlendirme WHERE degerlendirme_puan>=50';
    dbConn.query(query, (err, results) => {
        if (err) {
            console.error("Sorguda Hata Oluştu:", err);
            res.status(500).send("Sunucu Hatası");
            return;

        }
        res.json(results);
    });
}


const basarisizCalisan = async (req, res) => {
    const query = 'SELECT COUNT(*) as basarisizCalisan FROM degerlendirme WHERE degerlendirme_puan<=50';
    dbConn.query(query, (err, results) => {
        if (err) {
            console.error("Sorguda Hata Oluştu:", err);
            res.status(500).send("Sunucu Hatası");
            return;

        }
        res.json(results);
    });
}

// Örnek olarak, çalışanları bölümlerine göre filtrelemek için bir fonksiyon yazalım:
const getbolum = (req, res) => {
    const bolum = req.query.bolum; // Query'den bölüm bilgisini alıyoruz.

    // Veritabanından ilgili verileri çekmek için SQL sorgunuzu burada yazın:
    const query = 'SELECT calisan_id,calisan_ad,calisan_soyad,pozisyon,maas FROM calisanlar WHERE bolum = ?'; // ? parametresini güvenlik için kullanıyoruz.

    // Veritabanı sorgusu yapmak için önceden yazılmış bir fonksiyon kullanın veya burada doğrudan yapın
    dbConn.query(query, [bolum], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Veritabanı sorgusunda bir hata oluştu.' });
        } else {
            res.json(results); // Sonuçları JSON formatında gönderin.
        }
    });
};

const getDurum = (req, res) => {

    const calisan_id = req.query.calisan_id;
    const query = `
    SELECT 
    calisanlar.calisan_ad,calisanlar.calisan_soyad,degerlendirme.degerlendirme_puan AS puan,degerlendirme.aciklama AS aciklama
FROM 
    calisanlar
INNER JOIN calisan_kayitlari ON calisanlar.calisan_id=calisan_kayitlari.calisan_id
INNER JOIN degerlendirme ON calisan_kayitlari.degerlendirme_id=degerlendirme.degerlendirme_id
    WHERE
        calisanlar.calisan_id = ?
      `;

    dbConn.query(query, [calisan_id], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Veritabanı sorgusunda bir hata oluştu.' });
        } else {
            res.json(results); // Sonuçları JSON formatında gönderin.
        }
    });
};





const calisanGraf = (req, res) => {
    const query = `SELECT CONCAT(calisanlar.calisan_ad," ",calisanlar.calisan_soyad) AS calisan, FLOOR(DATEDIFF(CURDATE(),calisanlar.dogum_tarihi) / 365) AS yas FROM calisanlar GROUP BY calisan`;
    dbConn.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query: ' + error.stack);
            return;
        }
        const labels = results.map((row) => row.calisan);
        const data = results.map((row) => row.yas);

        const responseData = {
            labels: labels,
            datasets: [{
                label: "Çalışanlar Yaş Dağılımı",
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        }
        res.json(responseData)
    })
}

const maasGraf = (req, res) => {
    const query = `SELECT CONCAT(calisanlar.calisan_ad," ",calisanlar.calisan_soyad) AS calisan,calisanlar.maas AS maas FROM calisanlar`;
    dbConn.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query: ' + error.stack);
            return;
        }
        const labels = results.map((row) => row.calisan);
        const data = results.map((row) => row.maas);

        const responseData = {
            labels: labels,
            datasets: [{
                label: "Maaş Dağılımı",
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        }
        res.json(responseData)
    })
}


const bolumGraf = (req, res) => {
    const query = `SELECT calisanlar.bolum AS bolum, COUNT(calisanlar.calisan_id) AS sayi FROM calisanlar GROUP BY bolum;`;
    dbConn.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query: ' + error.stack);
            return;
        }
        const labels = results.map((row) => row.bolum);
        const data = results.map((row) => row.sayi);

        const responseData = {
            labels: labels,
            datasets: [{
                label: "Departman Çalışan Sayısı",
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        }
        res.json(responseData)
    })
}

const puanGraf = (req, res) => {
    const query = `SELECT concat(calisanlar.calisan_ad," ",calisanlar.calisan_soyad) AS calisan_bilgisi,degerlendirme.degerlendirme_puan AS puan
    FROM calisanlar
    INNER JOIN calisan_kayitlari ON calisanlar.calisan_id=calisan_kayitlari.calisan_id
    INNER JOIN degerlendirme ON calisan_kayitlari.degerlendirme_id=degerlendirme.degerlendirme_id
    GROUP BY calisan_bilgisi`;
    dbConn.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query: ' + error.stack);
            return;
        }
        const labels = results.map((row) => row.calisan_bilgisi);
        const data = results.map((row) => row.puan);

        const responseData = {
            labels: labels,
            datasets: [{
                label: "Çalışanların Puan Durumu",
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        }
        res.json(responseData)
    })
}







module.exports = { puanGraf, bolumGraf, maasGraf, calisanGraf, getDurum, login, register, calisan_getir, egitim_getir, calisan_ekle, calisan_sil, getNewEgitim, egitim_ekle, getTotalDeğerlendirme, getTotalPuan, getTotalBasvuru, basvurulanPozisyon, basvuran_getir, basariliCalisan, basarisizCalisan, getbolum }




