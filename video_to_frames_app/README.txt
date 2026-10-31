Video'dan rasm (frame) chiqaradigan va avtomatik odam belgilaydigan web ilova
==============================================================================

Ichida:
  - video_to_dataset_app.py  -> asosiy ilova (Gradio)
  - best.pt                  -> YOLO26n odam aniqlash modeli (mAP50-95=0.785)
  - requirements.txt         -> kerakli python paketlari

O'rnatish
---------
    pip install -r requirements.txt

Ishga tushirish
----------------
    python video_to_dataset_app.py

So'ng brauzerda oching: http://localhost:7862

Ishlatish
---------
1. Video yuklang, "Frame ajratish va auto-label" tugmasini bosing.
   - Belgilangan intervalda frame'lar (rasmlar) ajratiladi.
   - Har bir frame'da odamlar avtomatik model bilan belgilanadi.
2. Ko'rib chiqish bo'limida har bir frame'ni ko'rasiz:
   - Xato belgini o'chirish uchun ro'yxatdan "Box N" tanlab, "Tanlangan
     box(lar)ni o'chirish" tugmasini bosing.
   - Yangi belgi chizish uchun rasmda avval yuqori-chap, keyin pastki-o'ng
     nuqtaga bosing, so'ng "Yangi box qo'shish".
   - Butunlay kerak bo'lmagan frame'ni "Bu frameni butunlay o'chirish"
     tugmasi bilan olib tashlang.
   - "Oldingi / Keyingi" bilan frame'lar orasida yuring.
3. "Zip qilib yuklab olish" -> train/valid/test papkali (YOLO formatidagi)
   dataset zip bo'lib tushadi.

Eslatma
-------
- MODEL_PATH avtomatik shu papkadagi best.pt ni topadi (portable).
- Bo'lish (train/valid/test) video ichidagi ketma-ketlik bo'yicha qilinadi,
  tasodifiy emas -- shu bilan bir-biriga yaqin kadrlarning turli splitlarga
  tushib, natijalarni sun'iy shishirishining oldi olinadi.
