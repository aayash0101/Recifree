import React from 'react';

export default function SearchBar({ value, onChange, onSubmit }) {
    return (
        <form className='search-bar' onSubmit={onSubmit}>
            <input
                type="text"
                placeholder='Search Recipes...'
                value={value}
                onChange={onChange}
                className='search-input'
                />
                <button type="submit" className='search-btn'>Search</button>
        </form>
    );
}