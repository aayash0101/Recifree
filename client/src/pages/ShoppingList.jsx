import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';

export default function ShoppingList() {
    const { user, token } = useAuth();
    const [items, setItems] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        if (user) {
            fetch(`/ingredients/${user.id}`)
                .then(res => res.json())
                .then(data => setItems(data.items || []));
        }
    }, [user]);

 const refreshList = () => {
        fetch(`/ingredients/${user.id}`)
            .then(res => res.json())
            .then(data => setItems(data.items || []));
    };

    const addItem = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        await fetch(`/ingredients/${user.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ name: input })
        });
        setInput('');
        refreshList();
    };

    const toggleDone = async (idx) => {
        await fetch(`/ingredients/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ itemIndex: idx, done: !items[idx].done })
        });
        refreshList();
    };

    const removeItem = async (idx) => {
        await fetch(`/ingredients/${user.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ itemIndex: idx })
        });
        refreshList();
    };

    if (!user) return <div>Please login to manage your shopping list.</div>;

    return (
        <>
            <NavBar />
            <div className="container">
                <h2>My Ingredient Shopping List</h2>
                <form onSubmit={addItem} className="ingredient-form">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Add ingredient..."
                    />
                    <button type="submit">Add</button>
                </form>
                <ul className="ingredient-list">
                    {items.map((item, idx) => (
                        <li key={idx} className={item.done ? 'done' : ''}>
                            <input type="checkbox" checked={item.done} onChange={() => toggleDone(idx)} />
                            {item.name}
                            <button className="del-btn" onClick={() => removeItem(idx)}>x</button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );   
}