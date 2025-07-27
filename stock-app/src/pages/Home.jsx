import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { 
  collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc 
} from 'firebase/firestore'
import { db } from '../firebase'
import ProductForm from '../components/ProductForm'
import ProductList from '../components/ProductList'
import './Home.css'

const Home = () => {
  const { user, logout } = useAuth()
  const [products, setProducts] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [lastUpdatedBy, setLastUpdatedBy] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'products')) // orderBy('name') kaldırıldı
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // Türkçe karakter duyarlı sıralama (A-Z)
      data.sort((a, b) => a.name.localeCompare(b.name, 'tr'))

      setProducts(data)

      // En son güncelleme yapan kullanıcı ve zaman
      const updatedEntries = data
        .map(p => ({
          time: p.updatedAt?.toDate?.() || null,
          user: p.updatedBy || 'Bilinmiyor'
        }))
        .filter(entry => entry.time)

      if (updatedEntries.length > 0) {
        const latest = updatedEntries.reduce((a, b) => a.time > b.time ? a : b)
        setLastUpdated(latest.time)
        setLastUpdatedBy(latest.user)
      } else {
        setLastUpdated(null)
        setLastUpdatedBy(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const addProduct = async (product) => {
    try {
      await addDoc(collection(db, 'products'), {
        name: product.name,
        quantity: parseFloat(product.quantity),
        updatedAt: new Date(),
        updatedBy: user.username // Güncelleyen kullanıcı
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
        quantity: parseFloat(newQty),
        updatedAt: new Date(),
        updatedBy: user.username // Güncelleyen kullanıcı
      })
    } catch (error) {
      console.error('Ürün güncellenemedi:', error)
    }
  }

  // Toplam adet (0.5 ve üzeri yukarı yuvarlanır)
  const totalQuantity = products.reduce(
    (acc, p) => acc + Math.ceil(parseFloat(p.quantity) || 0),
    0
  )

  return (
    <div className="home-wrapper">
      <div className="home-box">
        <h1>Hoş geldin, {user.username}</h1>
        <button className="logout-btn" onClick={logout}>Çıkış Yap</button>

        <h3>Toplam Stok Adeti: {totalQuantity}</h3>
        {lastUpdated && (
          <p>
            Son Güncelleme: {lastUpdated.toLocaleString()}<br />
            Güncelleyen: {lastUpdatedBy}
          </p>
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
