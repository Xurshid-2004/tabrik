# Mustaqillik Ekspressi 🇺🇿 — React versiya

Temiryo'lchilar uchun Mustaqillik bayrami tabrigi. React + TypeScript + Vite'da yozilgan.

## Ishga tushirish

```bash
npm install        # birinchi marta
npm run dev        # http://localhost:5173 da ochiladi
```

## Production build

```bash
npm run build      # natija dist/ papkaga tushadi
npm run preview    # build'ni lokal ko'rish
```

## Tuzilishi

```
public/
  train.mp4              — haqiqiy lokomotiv videosi (sahna markazida)
  train-favicon.svg      — brauzer yorlig'i belgisi
src/
  App.tsx                — asosiy sahna (header, hero, oy, zarrachalar)
  App.css                — sahna uslublari
  components/
    TrainScene.tsx       — poyezd videosi (autoplay himoyasi, reduced-motion)
    WelcomeShower.tsx    — ochilishda 4 soniyalik zar-gul yomg'iri
    Stars.tsx            — miltillovchi yulduzlar
    GreetingModal.tsx    — "Tabrikni ochish" oynasi
    ConfettiBurst.tsx    — tabrik ochilganda konfeti
_keraksiz/               — eski Vite shablonidan qolgan fayllar (bemalol o'chirsa bo'ladi)
```
