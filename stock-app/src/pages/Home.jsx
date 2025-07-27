import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import ProductForm from '../components/ProductForm'
import ProductList from '../components/ProductList'
import './Home.css'

import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'

const Home = () => {
  const { user, logout } = useAuth()
  const [products, setProducts] = useState([])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setProducts(data)
    })

    return () => unsubscribe()
  }, [])

  const addProduct = async (product) => {
    try {
      await addDoc(collection(db, 'products'), {
        name: String(product.name),
        quantity: Number(product.quantity) || 0,
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
    console.log('updateProduct çağrıldı:', { id, newName, newQty, nameType: typeof newName, qtyType: typeof newQty })
    try {
      const productRef = doc(db, 'products', id)
      await updateDoc(productRef, {
        name: String(newName),
        quantity: Number(newQty) || 0,
      })
      console.log('Güncelleme başarılı')
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
