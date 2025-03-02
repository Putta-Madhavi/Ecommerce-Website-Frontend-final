import { useState, useEffect } from 'react';
import axios from 'axios';
import './Products.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo from '../user/image.png';

const Mobiles = () => {
    const [mobiles, setMobiles] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const [cart, setCart] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(""); 
    const [sortOption, setSortOption] = useState("");
    const [showSortOptions, setShowSortOptions] = useState(false); 
    const navigate = useNavigate();
    const getMobiles = async () => {
        try {
            const res = await axios.get("http://localhost:9090/user/mobiles", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setMobiles(res.data); 
            setError(null);
        } catch (error) {
            console.error("Error fetching mobiles:", error);
            setError("Failed to load mobiles. Please try again."); 
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        getMobiles(); 
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); 
    };

    const filteredMobiles = mobiles.filter((mobile) => {
        const mobileName = mobile.name.toLowerCase();
        const term = searchTerm.toLowerCase();
        return mobileName.startsWith(term); 
    });
    const sortedMobiles = [...filteredMobiles].sort((a, b) => {
        if (sortOption === "name-asc") {
            return a.name.localeCompare(b.name);
        } else if (sortOption === "name-desc") {
            return b.name.localeCompare(a.name); 
        } else if (sortOption === "price-asc") {
            return a.price - b.price;
        } else if (sortOption === "price-desc") {
            return b.price - a.price; 
        }
        return 0;
    });
    const handleAddToCart = (mobile) => {
        const existingMobile = cart.find((cartItem) => cartItem.id === mobile.id);
        if (existingMobile) {
            setCart(cart.map((cartItem) =>
                cartItem.id === mobile.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            ));
        } else {
            setCart([...cart, { ...mobile, quantity: 1 }]); 
        }
    };
    const handleQuantityChange = (itemId, change) => {
        setCart(cart.map((cartItem) =>
            cartItem.id === itemId
                ? { ...cartItem, quantity: Math.max(1, cartItem.quantity + change) }
                : cartItem
        ));
    };
    const displaySingleItem = (item) => {
        navigate("/mobiledetails", { state: { item } });
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value); 
        setShowSortOptions(false); 
    };

    return (
        <>
            <div className="shopping-app">
                <div className="app-header">
                    <div className="logo">
                        <img src={logo} width={200} height={100} alt="Logo" />
                    </div>
                    <div>
                        <input
                            type="search"
                            placeholder="Search products"
                            className="search-bar"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="filter-container">
                        <button className="filter-btn" onClick={() => setShowSortOptions(!showSortOptions)}>
                            Filter
                        </button>
                        {showSortOptions && (
                            <div className="sort-options">
                                <select className="sort-dropdown" value={sortOption} onChange={handleSortChange}>
                                    <option value="">Sort by</option>
                                    <option value="name-asc">Name: A-Z</option>
                                    <option value="name-desc">Name: Z-A</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="cartlogin">
                        <Link to="/" >
                            <img
                                src="https://www.shutterstock.com/image-vector/logout-button-260nw-312305171.jpg"
                                width={50}
                                height={50}
                                className="login"
                                alt="Logout"
                            />
                        </Link>
                        <Link to="/cart">
                            <img
                                src="https://static.vecteezy.com/system/resources/previews/004/798/846/original/shopping-cart-logo-or-icon-design-vector.jpg"
                                width={100}
                                height={100}
                                className="login"
                                alt="Cart"
                            />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="product-container">
                {loading ? (
                    <div className="loading-message">Loading mobiles...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : sortedMobiles.length > 0 ? (
                    sortedMobiles.map((item) => {
                        const cartItem = cart.find(cartItem => cartItem.id === item.id);
                        return (
                            <div key={item.id} className="product-card" onClick={() => displaySingleItem(item)}>
                                <img src={item.image} alt={item.name} className="product-image" />
                                <div className="name">{item.name}</div>
                                <div className="description">{item.description}</div>
                                <div className="price">Price: ₹{item.price}</div>

                                <div className="add-to-cart-container">
                                    <button
                                        className="add-to-cart-btn"
                                        onClick={() => handleAddToCart(item)}
                                    >
                                        Add to Cart
                                    </button>

                                    {cartItem && (
                                        <div className="quantity-controls">
                                            <button
                                                className="quantity-btn"
                                                onClick={() => handleQuantityChange(item.id, -1)}
                                            >
                                                -
                                            </button>
                                            <span className="quantity">{cartItem.quantity}</span>
                                            <button
                                                className="quantity-btn"
                                                onClick={() => handleQuantityChange(item.id, 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="no-data-message">No mobiles available.</div>
                )}
            </div>
        </>
    );
};

export default Mobiles;
