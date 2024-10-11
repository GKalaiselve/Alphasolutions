"use client"; // This marks the component as a client component

import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const ProductList = ({ products, searchTerm, selectedCategory, handleDelete, handleEdit }) => {
  const filteredProducts = products.filter(product => {
    const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearchTerm && matchesCategory;
  });

  const sortedProducts = filteredProducts.sort((a, b) => a.price - b.price);

  return (
    <div className={styles.productList}>
      {sortedProducts.map((product, index) => (
        <div key={index} className={styles.card}>
          <h3>{product.name}</h3>
          <p>Price: ${product.price}</p>
          <p>Stock: {product.quantity}</p>
          <p>Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
          <button onClick={() => handleDelete(index)} className={styles.buttonDelete}>
            Delete
          </button>
          <button onClick={() => handleEdit(index)} className={styles.buttonEdit}>
               Edit    </button>
        </div>
      ))}
    </div>
  );
};

const AddProductForm = ({ newProduct, setNewProduct, handleSubmit }) => (
  <form onSubmit={handleSubmit} className={styles.form}>
    <input
      type="text"
      name="name"
      placeholder="Product Name"
      value={newProduct.name}
      onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))} 
      className={styles.input}
    />
    <input
      type="number"
      name="price"
      placeholder="Price"
      value={newProduct.price}
      onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))} 
      className={styles.input}
    />
    <input
      type="number"
      name="quantity"
      placeholder="Quantity"
      value={newProduct.quantity}
      onChange={(e) => setNewProduct((prev) => ({ ...prev, quantity: e.target.value }))} 
      className={styles.input}
    />
    <select
      name="category"
      value={newProduct.category}
      onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value }))} 
      className={styles.select}
    >
      <option value="">Select Category</option>
      <option value="eyes">Eyes</option>
      <option value="skin">Skin</option>
      <option value="hands">Hands</option>
      <option value="legs">Legs</option>
      <option value="lips">Lips</option>
      <option value="hair">Hair</option>
      <option value="eyebrows">Eyebrows</option>
    </select>
    <button type="submit" className={styles.button}>
      {newProduct.index !== undefined ? 'Update Product' : 'Add Product'}
    </button>
  </form>
);

export default function Home() {
  const [products, setProducts] = useState([
    { name: 'Lipstick', price: 15.99, quantity: 50, category: 'lips' },
    { name: 'Eyeliner', price: 10.99, quantity: 30, category: 'eyes' },
    { name: 'Moisturizer', price: 20.99, quantity: 25, category: 'skin' },
    { name: 'Nail Polish', price: 7.99, quantity: 40, category: 'hands' },
  ]);

  const [newProduct, setNewProduct] = useState({ name: '', price: '', quantity: '', category: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeComponent, setActiveComponent] = useState('productList');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.quantity || !newProduct.category) {
      alert('Please fill out all fields');
      return;
    }

    if (newProduct.index !== undefined) {
      // Update the existing product
      const updatedProducts = products.map((product, index) =>
        index === newProduct.index
          ? { ...product, name: newProduct.name, price: parseFloat(newProduct.price), quantity: parseInt(newProduct.quantity, 10), category: newProduct.category }
          : product
      );
      setProducts(updatedProducts);
      setNewProduct({ name: '', price: '', quantity: '', category: '' }); // Reset the form after update
    } else {
      // Add a new product
      setProducts((prevProducts) => [
        ...prevProducts,
        {
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          quantity: parseInt(newProduct.quantity, 10),
          category: newProduct.category,
        },
      ]);
    }

    setActiveComponent('productList');
  };

  const handleDelete = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const handleEdit = (index) => {
    setNewProduct({ ...products[index], index }); // include index for updates
    setActiveComponent('addProduct');
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Makeup Product List</title>
        <meta name="description" content="A simple makeup product list with price and stock quantity" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Makeup Product List</h1>

        <nav className={styles.nav}>
          <button onClick={() => setActiveComponent('productList')} className={styles.navButton}>
            Product List
          </button>
          <button onClick={() => setActiveComponent('addProduct')} className={styles.navButton}>
            Add New Product
          </button>
        </nav>

        {activeComponent === 'productList' && (
          <>
            <div className={styles.filters}>
              <input
                type="text"
                placeholder="Search Products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.input}
              />
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={styles.select}>
                <option value="">All Categories</option>
                <option value="eyes">Eyes</option>
                <option value="skin">Skin</option>
                <option value="hands">Hands</option>
                <option value="legs">Legs</option>
                <option value="lips">Lips</option>
                <option value="hair">Hair</option>
                <option value="eyebrows">Eyebrows</option>
              </select>
            </div>

            <ProductList
              products={products}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          </>
        )}

        {activeComponent === 'addProduct' && (
          <AddProductForm newProduct={newProduct} setNewProduct={setNewProduct} handleSubmit={handleSubmit} />
        )}
      </main>
    </div>
  );
}

