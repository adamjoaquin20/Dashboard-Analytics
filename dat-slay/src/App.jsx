import React from 'react'
// import backGround from './assets/WatermarkDAC.png'
import Header from "./components/Header"
import backGround from './assets/b.png'


function App() {

  return (
    <>
      <div>
        <Header />
      </div>
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500 
      bg-contain bg-no-repeat" style={{ backgroundImage: `url(${backGround})`, opacity: 0.5 }}>
      </div>
    </>
  )
}

export default App;
