import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import ProductForm from '../components/ProductForm'
import ProductList from '../components/ProductList'
import './Home.css'

const Home = () => {
  const { user, logout } = useAuth()
  const [products, setProducts] = useState([])

  const addProduct = (product) => {
    setProducts([...products, product])
  }

  const removeProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const updateProduct = (id, newName, newQty) => {
    setProducts(products.map((p) =>
      p.id === id ? { ...p, name: newName, quantity: newQty } : p
    ))
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
