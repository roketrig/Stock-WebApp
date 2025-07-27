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
    <ul style={{ padding: 0, listStyle: 'none' }}>
      {products.map((product) => (
        <li key={product.id} style={{
          marginTop: '10px',
          background: '#fafafa',
          padding: '10px',
          borderRadius: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {editingId === product.id ? (
            <div style={{ width: '100%', display: 'flex', gap: '10px' }}>
              <input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Yeni isim"
                style={{ flex: 2, padding: '5px' }}
              />
              <input
                type="number"
                value={editedQty}
                onChange={(e) => setEditedQty(e.target.value)}
                placeholder="Yeni adet"
                style={{ flex: 1, padding: '5px' }}
              />
              <button onClick={handleSave} style={{ padding: '5px 10px' }}>Kaydet</button>
              <button onClick={() => setEditingId(null)} style={{ padding: '5px 10px' }}>İptal</button>
            </div>
          ) : (
            <>
              <div style={{
                flex: 2,
                backgroundColor: '#0077cc',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px',
                marginRight: '10px',
                textAlign: 'center'
              }}>
                {product.name}
              </div>
              <div style={{
                flex: 1,
                backgroundColor: '#ff7f50',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                {product.quantity} adet
              </div>
              <div>
                <button onClick={() => handleEditClick(product)} style={{ marginRight: '5px' }}>Düzenle</button>
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
