import { useEffect, useState } from 'react'
import { collection, query, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'
import ProductForm from '../components/ProductForm'
import ProductList from '../components/ProductList'
import { useAuth } from '../context/AuthContext'
import './Home.css'

const Home = () => {
  const { user, logout } = useAuth()
  const [products, setProducts] = useState([])
  const [lastUpdate, setLastUpdate] = useState(null)
  const [showTodayChanges, setShowTodayChanges] = useState(false)

  useEffect(() => {
    const q = query(collection(db, 'products'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const prods = []
      let latest = null
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        prods.push({ id: doc.id, ...data })

        // En son güncelleme zamanını bul
        if (!latest || (data.updatedAt && data.updatedAt.toDate() > latest.toDate())) {
          latest = data.updatedAt
        }
      })
      setProducts(prods)
      setLastUpdate(latest)
    })
    return () => unsubscribe()
  }, [])

  const addProduct = async (product) => {
    // ... ürün ekleme kodunuz buraya ...
  }

  const removeProduct = async (id) => {
    // ... ürün silme kodunuz buraya ...
  }

  const updateProduct = async (id, newName, newQty) => {
    // ... ürün güncelleme kodunuz buraya ...
  }

  // Bugün güncellenmiş ürünleri filtrele
  const filteredProducts = showTodayChanges
    ? products.filter(product => {
        if (!product.updatedAt) return false
        const updatedDate = product.updatedAt.toDate()
        const today = new Date()
        return (
          updatedDate.getDate() === today.getDate() &&
          updatedDate.getMonth() === today.getMonth() &&
          updatedDate.getFullYear() === today.getFullYear()
        )
      })
    : products

  return (
    <div className="home-wrapper">
      <div className="home-box">
        <h1>Hoş geldin, {user.username}</h1>
        <button className="logout-btn" onClick={logout}>Çıkış Yap</button>

        <h2>📦 Stok Takip</h2>

        <button
          style={{ marginBottom: '1rem' }}
          onClick={() => setShowTodayChanges(!showTodayChanges)}
        >
          {showTodayChanges ? 'Tüm Ürünler' : 'Bugün Güncellenenler'}
        </button>

        <ProductForm onAdd={addProduct} />
        <ProductList
          products={filteredProducts}
          onRemove={removeProduct}
          onUpdate={updateProduct}
          lastUpdate={lastUpdate}
        />
      </div>
    </div>
  )
}

export default Home
