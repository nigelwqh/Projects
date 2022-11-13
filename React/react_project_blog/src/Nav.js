import { Link } from "react-router-dom"
import { FaHome, FaPencilAlt, FaBook } from "react-icons/fa"

const Nav = ({ searchValue, setSearchValue }) => {
    return (
        <nav>
            <form className="searchForm" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="search"></label>
                <input
                    id="search"
                    type="text"
                    placeholder="Search Posts"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </form>
            <ul className="navList">
                <li>
                    <Link to="/">
                        <div className="icons">
                            <FaHome />
                        </div>
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/post">
                        <div className="icons">
                            <FaPencilAlt />
                        </div>
                        Create Post
                    </Link>
                </li>
                <li>
                    <Link to="/about">
                        <div className="icons">
                            <FaBook />
                        </div>
                        About
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Nav
