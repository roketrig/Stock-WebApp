import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { 
  collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase'
import ProductForm from '../components/ProductForm'
import ProductList from '../components/ProductList'
import './Home.css'

const normalizeQuantity = (qty) => {
  const n = parseFloat(qty)
  if (isNaN(n) || n <= 0) return 1
  return n < 1 ? 1 : n
}

const Home = () => {
  const { user, logout } = useAuth()
  const [products, setProducts] = useState([])
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    // Ürünleri isme göre A-Z sırala
    const q = query(collection(db, 'products'), orderBy('name'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProducts(data)

      // Son güncelleme tarihini al (en güncel updatedAt)
      const updatedAts = data
        .map(p => p.updatedAt?.toDate?.())
        .filter(date => date instanceof Date)
      if (updatedAts.length > 0) {
        const latest = new Date(Math.max(...updatedAts.map(d => d.getTime())))
        setLastUpdate(latest)
      } else {
        setLastUpdate(null)
      }
    })

    return () => unsubscribe()
  }, [])

  // Ürün ekle
  const addProduct = async (product) => {
    try {
      await addDoc(collection(db, 'products'), {
        name: product.name,
        quantity: normalizeQuantity(product.quantity),
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Ürün eklenemedi:', error)
    }
  }

  // Ürün sil
  const removeProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id))
    } catch (error) {
      console.error('Ürün silinemedi:', error)
    }
  }

  // Ürün güncelle
  const updateProduct = async (id, newName, newQty) => {
    try {
      const productRef = doc(db, 'products', id)
      await updateDoc(productRef, {
        name: newName,
        quantity: normalizeQuantity(newQty),
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Ürün güncellenemedi:', error)
    }
  }

  // Toplam adet hesapla (küçük sayıları 1 sayar)
  const totalQuantity = products.reduce((sum, p) => {
    const qty = parseFloat(p.quantity)
    if (isNaN(qty) || qty <= 0) return sum + 1
    return sum + (qty < 1 ? 1 : qty)
  }, 0)

  return (
    <div className="home-wrapper">
      <div className="home-box">
        <h1>Hoş geldin, {user.username}</h1>
        <button className="logout-btn" onClick={logout}>Çıkış Yap</button>

        <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
          Toplam Stok Adedi: {totalQuantity} <br />
          {lastUpdate && (
            <>Son Güncelleme: {lastUpdate.toLocaleDateString()} {lastUpdate.toLocaleTimeString()}</>
          )}
        </div>

        <h2>📦 Stok Takip</h2>
        <ProductForm onAdd={addProduct} />
        <ProductList 
          products={products} 
          onRemove={removeProduct} 
          onUpdate={updateProduct} 
        />
      </div>
    </div>
  )
}

export default Home
