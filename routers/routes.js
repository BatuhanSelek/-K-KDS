const router = require('express').Router()
const { login, register, calisan_getir, calisan_sil, calisan_ekle, egitim_getir, getNewEgitim, egitim_ekle, getTotalDeğerlendirme, getTotalPuan, getTotalBasvuru, basvurulanPozisyon, basvuran_getir, basariliCalisan, basarisizCalisan, getbolum, getDurum, calisanGraf, maasGraf, bolumGraf, puanGraf } = require('../controllers/controller')
router.post("/login", login)
router.post("/register", register)
router.get("/calisan_getir", calisan_getir)
router.delete("/calisan_sil/:calisan_id", calisan_sil)
router.post("/calisan_ekle", calisan_ekle)
router.get("/egitim_getir", egitim_getir)
router.get('/egitim-list', getNewEgitim);
router.post("/egitim_ekle", egitim_ekle)
router.get('/totalDegerlendirme', getTotalDeğerlendirme)
router.get('/totalPuan', getTotalPuan)
router.get('/totalBasvuru', getTotalBasvuru)
router.get('/basvurulanPozisyon', basvurulanPozisyon)
router.get("/basvuran_getir", basvuran_getir)
router.get('/basariliCalisan', basariliCalisan)
router.get('/basarisizCalisan', basarisizCalisan)
router.get('/getbolum', getbolum)
router.get('/getDurum', getDurum)
router.get("/calisanGraf", calisanGraf)
router.get("/maasGraf", maasGraf)
router.get("/bolumGraf", bolumGraf)
router.get("/puanGraf", puanGraf)




module.exports = router
