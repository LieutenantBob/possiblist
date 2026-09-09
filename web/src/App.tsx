import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { SessionProvider } from './hooks/useSession'
import { AuthProvider } from './hooks/useAuth'
import { Home } from './pages/Home'
import { Quiz } from './pages/Quiz'
import { Article } from './pages/Article'
import { Score } from './pages/Score'
import { Subscribe } from './pages/Subscribe'
import { SubscribeSuccess } from './pages/SubscribeSuccess'
import { Research } from './pages/Research'
import { About } from './pages/About'
import { Login } from './pages/Login'
import { MyPossiblist } from './pages/MyPossiblist'
import { Manifesto } from './pages/Manifesto'
import { Explore } from './pages/Explore'

export function App() {
  return (
    <AuthProvider>
      <SessionProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/q/:slug" element={<Quiz />} />
            <Route path="/article/:slug" element={<Article />} />
            <Route path="/score" element={<Score />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/subscribe/success" element={<SubscribeSuccess />} />
            <Route path="/research" element={<Research />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my-possiblist" element={<MyPossiblist />} />
            <Route path="/manifesto" element={<Manifesto />} />
            <Route path="/explore" element={<Explore />} />
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
