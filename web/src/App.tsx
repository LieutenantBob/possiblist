import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { Article } from './pages/Article'
import { Score } from './pages/Score'
import { Subscribe } from './pages/Subscribe'
import { SubscribeSuccess } from './pages/SubscribeSuccess'
import { Research } from './pages/Research'
import { About } from './pages/About'

export function App() {
  return (
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
        <Route path="/:slug" element={<RedirectToQuiz />} />
      </Route>
    </Routes>
  )
}

function RedirectToQuiz() {
  const slug = window.location.pathname.slice(1)
  return <Navigate to={`/q/${slug}`} replace />
}
