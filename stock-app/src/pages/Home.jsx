import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import ProductForm from '../components/ProductForm'
import ProductList from '../components/ProductList'
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  deleteDoc, 
  updateDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore'
import { db } from '../firebase'
import './Home.css'

const Home = () => {
  const { user, logout } = useAuth()
  const [products, setProducts] = useState([])
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    const productsRef = collection(db, 'products')
    const q = query(productsRef, orderBy('updatedAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProducts(productsData)

      if (productsData.length > 0) {
        setLastUpdate(productsData[0].updatedAt)
      } else {
        setLastUpdate(null)
      }
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

  return (
    <div className="home-wrapper">
      <div className="home-box">
        <h1>Hoş geldin, {user.username}</h1>
        <button className="logout-btn" onClick={logout}>Çıkış Yap</button>

        {/* Son güncelleme tarihini göster */}
        <div style={{ marginBottom: '1rem', fontWeight: '600', color: '#333' }}>
          {lastUpdate 
            ? `Son değişiklik: ${new Date(lastUpdate.seconds * 1000).toLocaleString()}`
            : 'Henüz değişiklik yok'}
        </div>

        <h2>📦 Stok Takip</h2>
        <ProductForm onAdd={addProduct} />
        <ProductList 
          products={products} 
          onRemove={removeProduct} 
          onUpdate={updateProduct} 
          lastUpdate={lastUpdate}
        />
      </div>
    </div>
  )
}

export default Home
