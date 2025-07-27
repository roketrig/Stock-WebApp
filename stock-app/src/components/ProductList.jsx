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
    onUpdate(editingId, editedName, parseInt(editedQty))
    setEditingId(null)
  }

  return (
    <ul style={{ padding: 0 }}>
      {products.map((product) => (
        <li
          key={product.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
            marginTop: '10px',
            background: '#fafafa',
            padding: '10px',
            borderRadius: '6px'
          }}
        >
          {editingId === product.id ? (
            <div style={{ width: '100%', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Yeni isim"
                style={{ flex: 2, padding: '6px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              <input
                type="number"
                value={editedQty}
                onChange={(e) => setEditedQty(e.target.value)}
                placeholder="Yeni adet"
                style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              <button onClick={handleSave} style={{ padding: '6px 12px' }}>Kaydet</button>
              <button onClick={() => setEditingId(null)} style={{ padding: '6px 12px' }}>İptal</button>
            </div>
          ) : (
            <>
              <div style={{ flex: 2, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}>
                {product.name}
              </div>
              <div style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px', textAlign: 'center' }}>
                {product.quantity} adet
              </div>
              <div>
                <button onClick={() => handleEditClick(product)} style={{ marginRight: '6px' }}>Düzenle</button>
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
