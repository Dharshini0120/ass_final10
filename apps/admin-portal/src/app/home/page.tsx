"use client";
import React from 'react';
import { useGetQuery } from '../../../src/store/apiSlice';

interface Item {
    id?: string;
    name: string;
    description: string;
}

const HomePage = () => {
    const { data, error, isLoading } = useGetQuery('/objects');

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading items.</div>;

    const items = data as Item[];

    return (
        <div>
            <h1>Home Page</h1>
            <h2>Items from Server:</h2>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;