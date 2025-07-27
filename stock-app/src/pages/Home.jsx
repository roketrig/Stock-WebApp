import { useEffect, useState } from 'react'
import { collection, query, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import ProductForm from '../components/ProductForm'
import ProductList from '../components/ProductList'
import { useAuth } from '../context/AuthContext'
import './Home.css'

const Home = () => {
  const { user, logout } = useAuth()
  const [products, setProducts] = useState([])
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'products'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const prods = []
      let latest = null

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        prods.push({ id: doc.id, ...data })

        // updatedAt varsa ve önceki latest'ten yeni ise güncelle
        if (data.updatedAt && (!latest || data.updatedAt.toDate() > latest.toDate())) {
          latest = data.updatedAt
        }
      })

      setProducts(prods)
      setLastUpdate(latest)
    })

    return () => unsubscribe()
  }, [])

  // lastUpdate yoksa "Veri yok" göster
  const formattedLastUpdate = lastUpdate
    ? lastUpdate.toDate().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })
    : 'Veri yok'

  const addProduct = async (product) => {
    try {
      // Firebase ekleme işlemi
    } catch (error) {
      console.error("Ürün eklenirken hata:", error)
    }
  }

  const removeProduct = async (id) => {
    try {
      // Firebase silme işlemi
    } catch (error) {
      console.error("Ürün silinirken hata:", error)
    }
  }

  const updateProduct = async (id, newName, newQty) => {
    try {
      // Firebase güncelleme işlemi
    } catch (error) {
      console.error("Ürün güncellenirken hata:", error)
    }
  }

  return (
    <div className="home-wrapper">
      <div className="home-box">
        <h1>Hoş geldin, {user.username}</h1>

        <p><strong>Son güncelleme: </strong>{formattedLastUpdate}</p>

        <button className="logout-btn" onClick={logout}>Çıkış Yap</button>

        <h2>📦 Stok Takip</h2>

        <ProductForm onAdd={addProduct} />
        <ProductList products={products} onRemove={removeProduct} onUpdate={updateProduct} />
      </div>
    </div>
  )
}

export default Home
