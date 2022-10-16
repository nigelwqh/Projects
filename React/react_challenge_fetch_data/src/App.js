import Form from "./Form.js"
// import List from "./List.js"
import Table from "./Table.js"
import { useState, useEffect } from "react"

function App() {
    const API_URL = "https://jsonplaceholder.typicodes.com/"

    const [reqType, setReqType] = useState("users")
    const [items, setItems] = useState([])
    const [errMsg, setErrMsg] = useState("")

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`${API_URL}${reqType}`)
                const data = await response.json()
                setItems(data)
            } catch (err) {
                setErrMsg(err.message)
            }
        }

        fetchItems()
    }, [reqType])

    return (
        <div className="App">
            <Form reqType={reqType} setReqType={setReqType} />
            {/* <List items={items} /> */}
            <Table items={items} errMsg={errMsg} />
        </div>
    )
}

export default App
