import Container from "./Container"
import Form from "./Form"
import { useState } from "react"

function App() {
    const [bgColor, setBgColor] = useState("")
    const [bgHex, setBgHex] = useState("")
    const [isDarkText, setIsDarkText] = useState(true)

    return (
        <div className="App">
            <Container bgColor={bgColor} bgHex={bgHex} isDarkText={isDarkText} />
            <Form
                bgColor={bgColor}
                setBgColor={setBgColor}
                setBgHex={setBgHex}
                isDarkText={isDarkText}
                setIsDarkText={setIsDarkText}
            />
        </div>
    )
}

export default App
