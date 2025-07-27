# Stok Takip Uygulaması

Bu proje, Firebase Firestore kullanan basit ve gerçek zamanlı bir stok takip uygulamasıdır. Kullanıcılar ürün ekleyebilir, silebilir, güncelleyebilir ve tüm ürünler anlık olarak Firebase üzerinden senkronize edilir. Uygulama React + Vite ile geliştirilmiştir.

---

## Özellikler

- Ürün ekleme, düzenleme ve silme
- Ürünlerin isim ve adet bilgilerini ayrı kutularda gösterme (mavi ve turuncu renklerle)
- Ürünler A-Z alfabetik olarak sıralanır
- Ürün adetleri ondalıklı sayı olabilir (örneğin 0.5, 1.25)
- Toplam stok adedi sayfanın üst kısmında gösterilir (ondalıklı değerler yukarı yuvarlanarak)
- Son güncelleme tarihi en üstte gösterilir
- Gerçek zamanlı senkronizasyon (Firebase Firestore)
- Basit kullanıcı kimlik doğrulama (AuthContext ile)

---

## Başlangıç

### Gereksinimler

- Node.js yüklü olmalı
- Firebase hesabı ve projesi
- Git

### Kurulum

1. Repo klonlayın veya indirin:

bash
git clone https://github.com/kullaniciAdi/projeAdi.git
cd projeAdi
npm install
Firebase projesini oluşturun ve src/firebase.js dosyasını kendi Firebase config bilgilerinize göre düzenleyin:

// src/firebase.js örnek
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

Çalıştırmak için: 
npm run dev
