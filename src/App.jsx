import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import './App.css'
const URL = 'https://content.guardianapis.com/search?api-key=0f059dcc-ebab-4996-9f55-a80a7ad2e67d&page='

function App() {
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [news, setNews] = useState([])
  const [count, setCount] = useState(0)
  const loader = useRef(null)

  const getNews = useCallback(async () => {
    try {
      await setLoading(true)
      const response = await axios.get(URL + `${page}`)
      const data = response.data.response
      await setNews((prev) => [...prev, ...data.results])
      await setCount(data.pages)
      setLoading(false)
    }
    catch (error) {
      console.error(error.message)
    }
  }, [page])

  useEffect(() => {
    let ignore = false

    if (!ignore) {
      getNews()
    }


    return () => { ignore = true }
  }, [page])

  const handleObserver = useCallback((entries) => {
    const target = entries[0]
    if (target.isIntersecting) {
      setPage((prev) => prev + 1)
    }
  }, [])

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '10px',
      treshold: 0
    }
    const observer = new IntersectionObserver(handleObserver, options)
    if (loader.current) observer.observe(loader.current)
  }, [handleObserver])



  return (
    <div className="App">
      <section>
        {
          news ? news.map((element) => {
            return (<h3 key={element.id}>{element.webTitle}</h3>)
          }) : null
        }
        {loading && <p>Loading...</p>}
        {news.length === count ? <span>last</span> : null}
      </section>
      <div ref={loader}></div>
    </div>
  )
}

export default App
