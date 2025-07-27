import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { 
  collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc 
} from 'firebase/firestore'
import { db } from '../firebase'
import ProductForm from '../components/ProductForm'
import ProductList from '../components/ProductList'
import './Home.css'

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

      // Son güncelleme tarihini bul
      let latest = null
      data.forEach(product => {
        if (product.updatedAt) {
          const updatedDate = product.updatedAt.toDate()
          if (!latest || updatedDate > latest) {
            latest = updatedDate
          }
        }
      })
      setLastUpdate(latest)
    })

    return () => unsubscribe()
  }, [])

  // Ürün ekle
  const addProduct = async (product) => {
    try {
      await addDoc(collection(db, 'products'), {
        name: product.name,
        quantity: product.quantity,
        updatedAt: new Date()
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
        quantity: newQty,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('Ürün güncellenemedi:', error)
    }
  }

  // Son güncelleme tarihini stringe çevir
  const formattedLastUpdate = lastUpdate
    ? lastUpdate.toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })
    : 'Veri yok'

  return (
    <div className="home-wrapper">
      <div className="home-box">
        <h1>Hoş geldin, {user.username}</h1>
        <p><strong>Son güncelleme: </strong>{formattedLastUpdate}</p>
        <button className="logout-btn" onClick={logout}>Çıkış Yap</button>

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
