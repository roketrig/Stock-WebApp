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
    // parseFloat ile onUpdate'a float gönderiyoruz
    onUpdate(editingId, editedName, parseFloat(editedQty))
    setEditingId(null)
  }

  return (
    <ul style={{ padding: 0, listStyle: 'none' }}>
      {products.map((product) => (
        <li
          key={product.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '10px',
          }}
        >
          {editingId === product.id ? (
            <div style={{ width: '100%', display: 'flex', gap: '10px' }}>
              <input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Yeni isim"
                style={{ flex: 2, padding: '6px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              <input
                type="number"
                step="0.01"
                value={editedQty}
                onChange={(e) => setEditedQty(e.target.value)}
                placeholder="Yeni adet"
                style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              <button onClick={handleSave} style={{ cursor: 'pointer' }}>
                Kaydet
              </button>
              <button onClick={() => setEditingId(null)} style={{ cursor: 'pointer' }}>
                İptal
              </button>
            </div>
          ) : (
            <>
              <div
                style={{
                  flex: 2,
                  backgroundColor: '#0077cc',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '6px',
                }}
              >
                {product.name}
              </div>
              <div
                style={{
                  flex: 1,
                  backgroundColor: '#ff6600',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  textAlign: 'center',
                  marginLeft: '10px',
                }}
              >
                {product.quantity}
              </div>
              <div style={{ marginLeft: '10px' }}>
                <button onClick={() => handleEditClick(product)} style={{ marginRight: '5px', cursor: 'pointer' }}>
                  Düzenle
                </button>
                <button onClick={() => onRemove(product.id)} style={{ cursor: 'pointer' }}>
                  Sil
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  )
}

export default ProductList
