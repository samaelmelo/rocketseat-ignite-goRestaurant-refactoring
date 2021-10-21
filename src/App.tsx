import GlobalStyles from "./styles/global"
import { BrowserRouter as Router } from 'react-router-dom';
import {Routes} from "./routes"



function App() {

  return (
   <>
    <GlobalStyles/>

    <Router>
      <Routes/>
    </Router>
   </>
  )
}

export default App
