import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminHome() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    category: '',
    description: '',
    image: '',
    sizes: '',
    colors: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null); // product id or null
  const [deleteError, setDeleteError] = useState(null);
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);
  const [deleteAllError, setDeleteAllError] = useState(null);
  const [deleteAllSuccess, setDeleteAllSuccess] = useState(null);

  // Edit product state
  const [editProduct, setEditProduct] = useState(null); // product object or null
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(null);

  // CSV upload state
  const [csvFile, setCsvFile] = useState(null);
  const [csvUploadStatus, setCsvUploadStatus] = useState('');
  const [checkedAuth, setCheckedAuth] = useState(false);

  // Redirect to login if no admin token
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    } else {
      setCheckedAuth(true);
    }
  }, [navigate]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      setProductsError(null);
      try {
        const res = await axios.get('http://localhost:3000/product');
        setProducts(res.data.products || []);
      } catch (err) {
        setProductsError('Failed to fetch products.');
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, [success]); // refetch on add success

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCsvChange = (e) => setCsvFile(e.target.files[0]);

  const handleCsvUpload = async () => {
    if (!csvFile) return;
    const formData = new FormData();
    formData.append('file', csvFile);
    const token = localStorage.getItem('adminToken');
    try {
      setCsvUploadStatus('Uploading...');
      await axios.post('http://localhost:3000/product/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setCsvUploadStatus('Upload successful!');
      setCsvFile(null);
      // Optionally, refresh product list
      const res = await axios.get('http://localhost:3000/product');
      setProducts(res.data.products || []);
    } catch (err) {
      setCsvUploadStatus('Upload failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem('adminToken');
      const data = {
        ...formData,
        sizes: formData.sizes.split(',').map(s => s.trim()),
        colors: formData.colors.split(',').map(c => c.trim()),
        price: Number(formData.price),
      };
      await axios.post('http://localhost:3000/product', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Product added successfully!');
      setFormData({ name: '', brand: '', price: '', category: '', description: '', image: '', sizes: '', colors: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setDeleteLoading(productId);
    setDeleteError(null);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:3000/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products => products.filter(p => p._id !== productId));
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete product.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL products? This cannot be undone.')) return;
    setDeleteAllLoading(true);
    setDeleteAllError(null);
    setDeleteAllSuccess(null);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete('http://localhost:3000/product/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts([]);
      setDeleteAllSuccess('All products deleted successfully!');
    } catch (err) {
      setDeleteAllError(err.response?.data?.message || 'Failed to delete all products.');
    } finally {
      setDeleteAllLoading(false);
    }
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setEditForm({
      name: product.name,
      brand: product.brand,
      price: product.price,
      category: product.category,
      description: product.description,
      image: product.image,
      sizes: product.sizes ? product.sizes.join(', ') : '',
      colors: product.colors ? product.colors.join(', ') : '',
    });
    setEditError(null);
    setEditSuccess(null);
  };

  const closeEditModal = () => {
    setEditProduct(null);
    setEditForm({});
    setEditError(null);
    setEditSuccess(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    setEditSuccess(null);
    try {
      const token = localStorage.getItem('adminToken');
      const data = {
        ...editForm,
        sizes: editForm.sizes.split(',').map(s => s.trim()),
        colors: editForm.colors.split(',').map(c => c.trim()),
        price: Number(editForm.price),
      };
      const res = await axios.put(`http://localhost:3000/product/${editProduct._id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products => products.map(p => p._id === editProduct._id ? res.data.product : p));
      setEditSuccess('Product updated successfully!');
      setTimeout(() => closeEditModal(), 1000);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update product.');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    !checkedAuth ? null : (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded shadow transition-all"
          >
            Logout
          </button>
        </header>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
          {error && <div className="bg-red-500 text-white p-3 rounded-md mb-4">{error}</div>}
          {success && <div className="bg-green-500 text-white p-3 rounded-md mb-4">{success}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required className="bg-gray-700 p-3 rounded-md outline-none focus:ring-2 focus:ring-red-500" />
            <input name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" required className="bg-gray-700 p-3 rounded-md outline-none focus:ring-2 focus:ring-red-500" />
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required className="bg-gray-700 p-3 rounded-md outline-none focus:ring-2 focus:ring-red-500" />
            <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" required className="bg-gray-700 p-3 rounded-md outline-none focus:ring-2 focus:ring-red-500" />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="md:col-span-2 bg-gray-700 p-3 rounded-md outline-none focus:ring-2 focus:ring-red-500" />
            <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" required className="md:col-span-2 bg-gray-700 p-3 rounded-md outline-none focus:ring-2 focus:ring-red-500" />
            <input name="sizes" value={formData.sizes} onChange={handleChange} placeholder="Sizes (comma-separated)" required className="bg-gray-700 p-3 rounded-md outline-none focus:ring-2 focus:ring-red-500" />
            <input name="colors" value={formData.colors} onChange={handleChange} placeholder="Colors (comma-separated)" required className="bg-gray-700 p-3 rounded-md outline-none focus:ring-2 focus:ring-red-500" />
            <button type="submit" disabled={loading} className="md:col-span-2 w-full py-3 bg-gradient-to-r from-red-600 to-red-800 rounded-lg font-bold hover:scale-105 transition-all disabled:opacity-50">
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </form>
        </div>
      </div>
      {/* CSV Upload UI */}
      <div className="max-w-4xl mx-auto mt-10 mb-6 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-2">Bulk Upload Products (CSV)</h2>
        <input type="file" accept=".csv" onChange={handleCsvChange} className="mb-2" />
        <button
          onClick={handleCsvUpload}
          disabled={!csvFile}
          className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white rounded disabled:opacity-50"
        >
          Upload CSV
        </button>
        {csvUploadStatus && <div className="mt-2 text-sm">{csvUploadStatus}</div>}
        <div className="text-xs text-gray-400 mt-2">CSV columns: name, brand, price, category, description, image, sizes, colors</div>
      </div>
      {/* Product List */}
      <div className="max-w-4xl mx-auto mt-10">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleDeleteAll}
            disabled={deleteAllLoading}
            className="px-4 py-2 bg-red-700 hover:bg-red-900 text-white rounded font-bold disabled:opacity-50"
          >
            {deleteAllLoading ? 'Deleting All...' : 'Delete All Products'}
          </button>
        </div>
        {deleteAllError && <div className="bg-red-500 text-white p-3 rounded-md mb-4">{deleteAllError}</div>}
        {deleteAllSuccess && <div className="bg-green-500 text-white p-3 rounded-md mb-4">{deleteAllSuccess}</div>}
        <h2 className="text-2xl font-bold mb-4">All Products</h2>
        {productsLoading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : productsError ? (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4">{productsError}</div>
        ) : products.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg">
              <thead>
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Brand</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="border-b border-gray-700">
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">{product.brand}</td>
                    <td className="p-3">₹{product.price}</td>
                    <td className="p-3">{product.category}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        className="bg-blue-600 hover:bg-blue-800 text-white px-3 py-1 rounded text-xs font-semibold"
                        onClick={() => openEditModal(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-800 text-white px-3 py-1 rounded text-xs font-semibold disabled:opacity-50"
                        onClick={() => handleDelete(product._id)}
                        disabled={deleteLoading === product._id}
                      >
                        {deleteLoading === product._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {deleteError && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4 mt-4">{deleteError}</div>
        )}
      </div>
      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl font-bold"
              onClick={closeEditModal}
              disabled={editLoading}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            {editError && <div className="bg-red-500 text-white p-3 rounded-md mb-4">{editError}</div>}
            {editSuccess && <div className="bg-green-500 text-white p-3 rounded-md mb-4">{editSuccess}</div>}
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4">
              <input name="name" value={editForm.name || ''} onChange={handleEditChange} placeholder="Product Name" required className="bg-gray-700 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="brand" value={editForm.brand || ''} onChange={handleEditChange} placeholder="Brand" required className="bg-gray-700 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="number" name="price" value={editForm.price || ''} onChange={handleEditChange} placeholder="Price" required className="bg-gray-700 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="category" value={editForm.category || ''} onChange={handleEditChange} placeholder="Category" required className="bg-gray-700 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500" />
              <textarea name="description" value={editForm.description || ''} onChange={handleEditChange} placeholder="Description" required className="bg-gray-700 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="image" value={editForm.image || ''} onChange={handleEditChange} placeholder="Image URL" required className="bg-gray-700 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="sizes" value={editForm.sizes || ''} onChange={handleEditChange} placeholder="Sizes (comma-separated)" required className="bg-gray-700 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="colors" value={editForm.colors || ''} onChange={handleEditChange} placeholder="Colors (comma-separated)" required className="bg-gray-700 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="submit" disabled={editLoading} className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg font-bold hover:scale-105 transition-all disabled:opacity-50">
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
    )
  );
}

export default AdminHome; 