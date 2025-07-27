import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { 
  collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase'
import ProductForm from '../components/ProductForm'
import ProductList from '../components/ProductList'
import './Home.css'

// Tarih formatlayıcı
const formatDate = (date) => {
  if (!date) return ''
  return date.toLocaleString('tr-TR', { hour12: false })
}

const Home = () => {
  const { user, logout } = useAuth()
  const [products, setProducts] = useState([])

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('name'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        updatedAt: doc.data().updatedAt ? doc.data().updatedAt.toDate() : null
      }))
      setProducts(data)
    })

    return () => unsubscribe()
  }, [])

  const addProduct = async (product) => {
    try {
      await addDoc(collection(db, 'products'), {
        name: product.name,
        quantity: product.quantity,
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
        quantity: newQty,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Ürün güncellenemedi:', error)
    }
  }

  // Toplam adet hesapla
  const totalQuantity = products.reduce((total, p) => total + (p.quantity || 0), 0)

  // Son güncellenen tarih
  const lastUpdated = products.reduce((latest, product) => {
    if (!product.updatedAt) return latest
    return !latest || product.updatedAt > latest ? product.updatedAt : latest
  }, null)

  return (
    <div className="home-wrapper">
      <div className="home-box">
        <h1>Hoş geldin, {user.username}</h1>
        <button className="logout-btn" onClick={logout}>Çıkış Yap</button>

        <h2>📦 Stok Takip</h2>

        <p style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.3rem' }}>
          Toplam ürün adeti: {totalQuantity}
        </p>

        {lastUpdated && (
          <p style={{ fontSize: '0.85rem', color: '#555', marginTop: 0 }}>
            Son değişiklik: {formatDate(lastUpdated)}
          </p>
        )}

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
