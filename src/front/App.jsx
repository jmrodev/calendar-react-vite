import { useState } from 'react'
import { Header } from './src/components/header/header'
import { Footer } from './src/components/footer/footer'
import './App.css'
import Content  from './src/components/container/Content'

function App() {

  return (
    <div className='container'>
      <Header />
      <Content />
      <Footer />
    </div>
  )
}

export default App
