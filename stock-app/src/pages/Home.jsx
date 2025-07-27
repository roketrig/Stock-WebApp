import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import ProductForm from '../components/ProductForm'
import ProductList from '../components/ProductList'
import { db } from '../firebase'
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore'
import './Home.css'

const Home = () => {
  const { user, logout } = useAuth()
  const [products, setProducts] = useState([])

  useEffect(() => {
    // products koleksiyonunu name'e göre sırala ve dinle
    const q = query(collection(db, 'products'), orderBy('name'))

    // Gerçek zamanlı güncellemeleri dinle
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = []
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() })
      })
      setProducts(items)
    })

    return () => unsubscribe()
  }, [])

  // Yeni ürün ekleme
  const addProduct = async (product) => {
    try {
      await addDoc(collection(db, 'products'), product)
    } catch (error) {
      console.error('Ürün eklenirken hata:', error)
    }
  }

  // Ürün silme
  const removeProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id))
    } catch (error) {
      console.error('Ürün silinirken hata:', error)
    }
  }

  // Ürün güncelleme
  const updateProduct = async (id, newName, newQty) => {
    try {
      const productRef = doc(db, 'products', id)
      await updateDoc(productRef, { name: newName, quantity: newQty })
    } catch (error) {
      console.error('Ürün güncellenirken hata:', error)
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
