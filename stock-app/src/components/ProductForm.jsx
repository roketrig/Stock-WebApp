import { useState } from 'react'

const ProductForm = ({ onAdd }) => {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !quantity) return

    onAdd({ name: name.trim(), quantity: quantity })
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
        required
      />
      <input
        type="number"
        step="0.1"
        placeholder="Adet"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
        min="0.1"
      />
      <button type="submit">Ekle</button>
    </form>
  )
}

export default ProductForm
