import Header from "./Header"
import SearchItem from "./SearchItem"
import AddItem from "./AddItem"
import Content from "./Content"
import Footer from "./Footer"
import { useState, useEffect } from "react"
import apiRequest from "./apiRequest"

function App() {
    const API_URL = "http://localhost:3500/items"

    // States
    const [items, setItems] = useState([])
    const [newItem, setNewItem] = useState("")
    const [search, setSearch] = useState("")
    const [fetchError, setFetchError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Only ran once - fetch items using API
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(API_URL)
                if (!response.ok) throw Error("Did not receive expected data")
                const listItems = await response.json()
                setItems(listItems)
                setFetchError(null)
            } catch (err) {
                setFetchError(err.message)
            } finally {
                setIsLoading(false)
            }
        }
        setTimeout(() => {
            ;(async () => await fetchItems())()
        }, 2000)
    }, [])

    // Function used to add items to the list and maintain the list state
    const addItem = async (item) => {
        const id = items.length ? items[items.length - 1].id + 1 : 1
        const myNewItem = {
            id: id,
            checked: false,
            item: item,
        }
        const listItems = [...items, myNewItem]
        setItems(listItems)

        // send POST request to upload new item to the database through the API
        const postOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(myNewItem),
        }
        const result = await apiRequest(API_URL, postOptions)
        if (result) {
            setFetchError(result)
        }
    }

    // Function used to handle the state of the check box
    const handleCheck = async (id) => {
        const listItems = items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
        )
        setItems(listItems)

        // send UPDATE request to update existing item in the database through the API
        const myItem = listItems.filter((item) => item.id === id)
        const updateOptions = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ checked: myItem[0].checked }),
        }
        const reqUrl = `${API_URL}/${id}`
        const result = await apiRequest(reqUrl, updateOptions)
        if (result) {
            setFetchError(result)
        }
    }

    // Function used to delete items from the list and maintain the list state
    const handleDelete = async (id) => {
        const listItems = items.filter((item) => item.id !== id)
        setItems(listItems)

        // send DELETE request to delete existing item in the database through the API
        const deleteOptions = {
            method: "DELETE",
        }
        const reqUrl = `${API_URL}/${id}`
        const result = await apiRequest(reqUrl, deleteOptions)
        if (result) {
            setFetchError(result)
        }
    }

    // Function used to submit the items to add to the list
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!newItem) return
        // add item
        addItem(newItem)
        setNewItem("")
    }

    // main JSX contents
    return (
        <div className="App">
            <Header title="Grocery List" />
            <AddItem newItem={newItem} setNewItem={setNewItem} handleSubmit={handleSubmit} />
            <SearchItem search={search} setSearch={setSearch} />
            <main>
                {isLoading && <p>Loading Items...</p>}
                {fetchError && <p style={{ color: "red" }}>{`Error: ${fetchError}`}</p>}
                {!fetchError && !isLoading && (
                    <Content
                        items={items.filter((item) =>
                            item.item.toLowerCase().includes(search.toLowerCase())
                        )}
                        handleCheck={handleCheck}
                        handleDelete={handleDelete}
                    />
                )}
            </main>
            <Footer length={items.length} />
        </div>
    )
}

export default App
