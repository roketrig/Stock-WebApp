import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { 
  collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase'
import ProductForm from '../components/ProductForm'
import ProductList from '../components/ProductList'
import './Home.css'

const Home = () => {
  const { user, logout } = useAuth()
  const [products, setProducts] = useState([])

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('name'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProducts(data)
    })

    return () => unsubscribe()
  }, [])

  // Adet normalizasyon fonksiyonu
  const normalizeQuantity = (qty) => {
    const n = parseFloat(qty)
    if (isNaN(n) || n <= 0) return 1
    return n < 1 ? 1 : n
  }

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

  const removeProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id))
    } catch (error) {
      console.error('Ürün silinemedi:', error)
    }
  }

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

  // Toplam adet hesapla
  const totalQuantity = products.reduce((acc, p) => acc + (parseFloat(p.quantity) || 0), 0)

  // Son güncelleme tarihi (en büyük updatedAt)
  const lastUpdated = products.reduce((latest, p) => {
    if (!p.updatedAt) return latest
    const date = p.updatedAt.toDate ? p.updatedAt.toDate() : new Date(p.updatedAt)
    return (!latest || date > latest) ? date : latest
  }, null)

  return (
    <div className="home-wrapper">
      <div className="home-box">
        <h1>Hoş geldin, {user.username}</h1>
        <button className="logout-btn" onClick={logout}>Çıkış Yap</button>

        <h3 style={{ marginBottom: '10px' }}>
          Toplam Stok Adedi: <strong>{Math.round(totalQuantity)}</strong>
        </h3>
        {lastUpdated && (
          <h4 style={{ marginTop: 0, marginBottom: '1.5rem', fontWeight: 'normal', color: '#666' }}>
            Son Güncelleme: {lastUpdated.toLocaleString()}
          </h4>
        )}

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
