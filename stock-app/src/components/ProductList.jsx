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
    onUpdate(editingId, editedName, parseFloat(editedQty))
    setEditingId(null)
  }

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingId === product.id ? (
            <div style={{ width: '100%', display: 'flex', gap: '10px' }}>
              <input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Yeni isim"
                style={{ flex: 2, padding: '6px' }}
              />
              <input
                type="number"
                value={editedQty}
                onChange={(e) => setEditedQty(e.target.value)}
                placeholder="Yeni adet"
                style={{ flex: 1, padding: '6px' }}
              />
              <button onClick={handleSave}>Kaydet</button>
              <button onClick={() => setEditingId(null)}>İptal</button>
            </div>
          ) : (
            <>
              <div style={{ flex: 2, backgroundColor: '#0077cc', color: 'white', padding: '6px 12px', borderRadius: '6px' }}>
                {product.name}
              </div>
              <div style={{ flex: 1, backgroundColor: '#ff6600', color: 'white', padding: '6px 12px', borderRadius: '6px', textAlign: 'center', marginLeft: '10px' }}>
                {product.quantity}
              </div>
              <div style={{ marginLeft: '10px' }}>
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
