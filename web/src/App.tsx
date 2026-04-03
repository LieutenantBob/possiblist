import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { SessionProvider } from './hooks/useSession'
import { AuthProvider } from './hooks/useAuth'
import { Home } from './pages/Home'
import { Article } from './pages/Article'
import { Score } from './pages/Score'
import { Subscribe } from './pages/Subscribe'
import { SubscribeSuccess } from './pages/SubscribeSuccess'
import { Research } from './pages/Research'
import { About } from './pages/About'
import { Login } from './pages/Login'
import { MyPossiblist } from './pages/MyPossiblist'

export function App() {
  return (
    <AuthProvider>
      <SessionProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/q/:slug" element={<Home />} />
            <Route path="/article/:slug" element={<Article />} />
            <Route path="/score" element={<Score />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/subscribe/success" element={<SubscribeSuccess />} />
            <Route path="/research" element={<Research />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my-possiblist" element={<MyPossiblist />} />
            <Route path="/:slug" element={<RedirectToQuiz />} />
          </Route>
        </Routes>
      </SessionProvider>
    </AuthProvider>
  )
}

function RedirectToQuiz() {
  const { slug } = useParams<{ slug: string }>()
  return <Navigate to={`/q/${slug}`} replace />
}
