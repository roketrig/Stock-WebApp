import { useState } from 'react'

const ProductForm = ({ onAdd }) => {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !quantity) return
    onAdd({ name, quantity: parseFloat(quantity) })
    setName('')
    setQuantity('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Ürün adı"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '60%', marginRight: '10px'}}
      />
      <input
        type="number"
        step="0.1"
        placeholder="Adet"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        style={{padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '30%', marginRight: '10px'}}
      />
      <button type="submit" style={{padding: '0.5rem 1rem', backgroundColor: '#0077cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>
        Ekle
      </button>
    </form>
  )
}

export default ProductForm
