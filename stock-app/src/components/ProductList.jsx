import { useState } from 'react'

const ProductList = ({ products, onRemove, onUpdate, lastUpdate }) => {
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

  // En son güncellenen ürün mü kontrolü
  const isLatest = (product) => {
    if (!product.updatedAt || !lastUpdate) return false
    return product.updatedAt.seconds === lastUpdate.seconds && product.updatedAt.nanoseconds === lastUpdate.nanoseconds
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
          alignItems: 'center',
          gap: '10px'
        }}>
          {editingId === product.id ? (
            <>
              <input
                style={{ flex: 2, padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Yeni isim"
              />
              <input
                type="number"
                style={{ width: '80px', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                value={editedQty}
                onChange={(e) => setEditedQty(e.target.value)}
                placeholder="Yeni adet"
              />
              <button onClick={handleSave}>Kaydet</button>
              <button onClick={() => setEditingId(null)}>İptal</button>
            </>
          ) : (
            <>
              <span style={{ fontWeight: '600' }}>
                {product.name}
                {isLatest(product) && (
                  <span title="Son değişiklik" style={{ color: 'green', marginLeft: '6px' }}>🔄</span>
                )}
              </span>
              <span>{product.quantity} adet</span>
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
