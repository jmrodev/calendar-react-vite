import { useState } from 'react'
import { Header } from './src/components/header'
import { Main } from './src/components/main'
import { Footer } from './src/components/footer'
import { Aside } from './src/components/aside'
import './App.css'

function App() {

  return (
    <div className='container'>
      <Header />
      <Aside />
      <Main />
      <Footer />
    </div>
  )
}

export default App
