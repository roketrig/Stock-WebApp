import { useState } from 'react'
import ProductForm from '../components/ProductForm'
import ProductList from '../components/ProductList'

const Stock = () => {
  const [products, setProducts] = useState([])

  const addProduct = (product) => {
    setProducts([...products, product])
  }

  const removeProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  return (
    <div>
      <h1>Stok Takip</h1>
      <ProductForm onAdd={addProduct} />
      <ProductList products={products} onRemove={removeProduct} />
    </div>
  )
}

export default Stock
