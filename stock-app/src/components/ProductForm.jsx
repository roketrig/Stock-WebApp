import { useState } from 'react'

const ProductForm = ({ onAdd }) => {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !quantity) return

    onAdd({
      id: Date.now(),
      name,
      quantity: parseInt(quantity),
    })

    setName('')
    setQuantity('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Ürün Adı"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Adet"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button type="submit">Ekle</button>
    </form>
  )
}

export default ProductForm
