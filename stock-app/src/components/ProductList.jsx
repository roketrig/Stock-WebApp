import { useState } from 'react'

const ProductList = ({ products, onRemove, onUpdate }) => {
  const [editingId, setEditingId] = useState(null)
  const [editedName, setEditedName] = useState('')
  const [editedQty, setEditedQty] = useState('')

  const handleEditClick = (product) => {
    setEditingId(product.id)
    setEditedName(product.name)
    setEditedQty(product.quantity)
  }

  const handleSave = () => {
    if (!editedName.trim() || !editedQty || isNaN(editedQty)) {
      alert('Lütfen geçerli isim ve adet girin.')
      return
    }
    onUpdate(editingId, editedName.trim(), parseInt(editedQty))
    setEditingId(null)
  }

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingId === product.id ? (
            <div style={{ width: '100%', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Yeni isim"
              />
              <input
                type="number"
                value={editedQty}
                onChange={(e) => setEditedQty(e.target.value)}
                placeholder="Yeni adet"
                min="0"
              />
              <button onClick={handleSave}>Kaydet</button>
              <button onClick={() => setEditingId(null)}>İptal</button>
            </div>
          ) : (
            <>
              <span style={{ flexGrow: 1 }}>{product.name} - {product.quantity} adet</span>
              <div>
                <button onClick={() => handleEditClick(product)}>Düzenle</button>
                <button onClick={() => onRemove(product.id)}>Sil</button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  )
}

export default ProductList
