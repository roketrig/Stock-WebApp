import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const success = login(username, password)
    if (success) {
      navigate('/')
    } else {
      setError('Hatalı kullanıcı adı veya şifre')
    }
  }

  return (
    <div>
      <h2>Giriş Yap</h2>
      <form onSubmit={handleSubmit}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Kullanıcı Adı" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Şifre" />
        <button type="submit">Giriş</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  )
}

export default Login
