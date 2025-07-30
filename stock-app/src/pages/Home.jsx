import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { 
  collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc 
} from 'firebase/firestore'
import { db } from '../firebase'
import ProductForm from '../components/ProductForm'
import ProductList from '../components/ProductList'
import './Home.css'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const Home = () => {
  const { user, logout } = useAuth()
  const [products, setProducts] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [lastUpdatedBy, setLastUpdatedBy] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'products'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      data.sort((a, b) => a.name.localeCompare(b.name, 'tr'))
      setProducts(data)

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
        updatedBy: user.username
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
        updatedBy: user.username
      })
    } catch (error) {
      console.error('Ürün güncellenemedi:', error)
    }
  }

  const exportToPDF = () => {
    const filtered = products.filter(p => parseFloat(p.quantity) > 0)
    const doc = new jsPDF()
    doc.text('Stok Listesi', 14, 16)

    const tableData = filtered.map(p => [
      p.name,
      p.quantity.toString(),
      p.updatedBy || 'Bilinmiyor',
      p.updatedAt?.toDate?.().toLocaleString() || 'Yok'
    ])

    autoTable(doc, {
      head: [['Ürün Adı', 'Adet', 'Güncelleyen', 'Güncelleme Zamanı']],
      body: tableData,
      startY: 20,
    })

    doc.save('stok_listesi.pdf')
  }

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

        <button onClick={exportToPDF} style={{ marginTop: '10px' }}>
          PDF Olarak Dışa Aktar
        </button>

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