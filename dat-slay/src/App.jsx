import React from 'react'
// import backGround from './assets/WatermarkDAC.png'
import Header from "./components/Header"
import KPIGrid from "./components/KPIGrid"
import backGround from './assets/b.png'


function App() {

  return (
    <>
      <div>
        <Header />
      </div>
      <div className="min-h-screen bg-contain bg-no-repeat" style={{ backgroundImage: `url(${backGround})` }}>
        <KPIGrid />
      </div>
    </>
  )
}

export default App;
