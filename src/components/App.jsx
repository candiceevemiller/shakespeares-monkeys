import Header from "./Header"
import BestRecord from "./BestRecord"
import LiveAttempt from "./LiveAttempt"
import ImageWheel from "./ImageWheel"
import TargetText from "./TargetText"
import Footer from "./Footer"
import { useMonkeyEngine } from "../hooks/useMonkeyEngine.js"

function App() {
  const { current, best, attempts, target } = useMonkeyEngine()

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <BestRecord best={best} />
      <LiveAttempt current={current} attempts={attempts} />
      <ImageWheel />
      <TargetText text={target} />
      <Footer />
    </div>
  )
}

export default App
