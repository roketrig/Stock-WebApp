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

  useEffect(() => {
    // Firestore sorgusu: ürünleri isme göre A-Z sırala
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

  // Ürün ekle
  const addProduct = async (product) => {
    try {
      await addDoc(collection(db, 'products'), {
        name: product.name,
        quantity: product.quantity
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
        quantity: newQty
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
