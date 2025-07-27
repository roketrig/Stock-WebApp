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
    onUpdate(editingId, editedName, editedQty)
    setEditingId(null)
  }

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingId === product.id ? (
            <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
              <input
                style={{ flex: 2 }}
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Yeni isim"
              />
              <input
                style={{ flex: 1 }}
                type="number"
                step="0.1"
                value={editedQty}
                onChange={(e) => setEditedQty(e.target.value)}
                placeholder="Yeni adet"
              />
              <button onClick={handleSave}>Kaydet</button>
              <button onClick={() => setEditingId(null)}>İptal</button>
            </div>
          ) : (
            <>
              <span style={{ flex: 2 }}>{product.name}</span>
              <span style={{ flex: 1, textAlign: 'right' }}>{product.quantity} adet</span>
              <div style={{ marginLeft: '1rem' }}>
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
