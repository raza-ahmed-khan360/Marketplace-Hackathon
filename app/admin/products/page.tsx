'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { client } from '../../../lib/sanity';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: {
    _id: string;
    title: string;
  };
  inventory: number;
  status: 'In Stock' | 'Out of Stock' | 'Low Stock';
}

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inventory: number;
  status: 'In Stock' | 'Out of Stock' | 'Low Stock';
}

interface Category {
  _id: string;
  title: string;
}

export default function AdminProducts() {
  const { user: currentUser } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    minPrice: '',
    maxPrice: '',
  });

  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    inventory: 0,
    status: 'In Stock',
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, filters, products]);

  const fetchCategories = async () => {
    try {
      const result = await client.fetch(`
        *[_type == "category"] | order(title asc) {
          _id,
          title
        }
      `);
      setCategories(result);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        product =>
          product.title.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category._id === filters.category);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(product => product.status === filters.status);
    }

    // Price range filter
    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= Number(filters.maxPrice));
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      return;
    }

    try {
      await Promise.all(selectedProducts.map(id => client.delete(id)));
      toast.success('Products deleted successfully');
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Failed to delete products');
    }
  };

  const handleBulkStatusUpdate = async (status: Product['status']) => {
    try {
      await Promise.all(
        selectedProducts.map(id =>
          client.patch(id).set({ status }).commit()
        )
      );
      toast.success('Products updated successfully');
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      console.error('Error updating products:', error);
      toast.error('Failed to update products');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(filteredProducts.map(p => p._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const fetchProducts = async () => {
    try {
      const result = await client.fetch(`
        *[_type == "product"] | order(title asc) {
          _id,
          title,
          description,
          price,
          image,
          category->{
            _id,
            title
          },
          inventory,
          status
        }
      `);
      setProducts(result);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'inventory' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        _type: 'product',
        title: formData.title,
        description: formData.description,
        price: formData.price,
        image: formData.image,
        category: {
          _type: 'reference',
          _ref: formData.category,
        },
        inventory: formData.inventory,
        status: formData.status,
      };

      if (editingProduct) {
        await client
          .patch(editingProduct._id)
          .set(productData)
          .commit();
        toast.success('Product updated successfully');
      } else {
        await client.create(productData);
        toast.success('Product created successfully');
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({
        title: '',
        description: '',
        price: 0,
        image: '',
        category: '',
        inventory: 0,
        status: 'In Stock',
      });
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category._id,
      inventory: product.inventory,
      status: product.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await client.delete(productId);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-scales-off-white flex items-center justify-center">
        <p className="text-xl text-gray-scales-dark-gray">Access Denied</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-scales-off-white py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-scales-black">Products</h1>
          <button
            onClick={() => {
              setEditingProduct(null);
              setFormData({
                title: '',
                description: '',
                price: 0,
                image: '',
                category: '',
                inventory: 0,
                status: 'In Stock',
              });
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-accents-accents text-white rounded-3xs hover:bg-accents-dark-accents"
          >
            Add Product
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-scales-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-3xs border-gray-scales-light-gray focus:ring-accents-accents focus:border-accents-accents"
              />
            </div>
            <div>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full rounded-3xs border-gray-scales-light-gray focus:ring-accents-accents focus:border-accents-accents"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full rounded-3xs border-gray-scales-light-gray focus:ring-accents-accents focus:border-accents-accents"
              >
                <option value="">All Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Low Stock">Low Stock</option>
              </select>
            </div>
            <div>
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="w-full rounded-3xs border-gray-scales-light-gray focus:ring-accents-accents focus:border-accents-accents"
              />
            </div>
            <div>
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-full rounded-3xs border-gray-scales-light-gray focus:ring-accents-accents focus:border-accents-accents"
              />
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="bg-gray-scales-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-scales-dark-gray">
                {selectedProducts.length} products selected
              </span>
              <div className="space-x-4">
                <button
                  onClick={() => handleBulkStatusUpdate('In Stock')}
                  className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full hover:bg-green-200"
                >
                  Mark In Stock
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('Out of Stock')}
                  className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full hover:bg-red-200"
                >
                  Mark Out of Stock
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('Low Stock')}
                  className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200"
                >
                  Mark Low Stock
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded-full hover:bg-red-700"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center">
            <p className="text-gray-scales-dark-gray">Loading...</p>
          </div>
        ) : (
          <div className="bg-gray-scales-white shadow-sm rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-scales-light-gray">
              <thead className="bg-gray-scales-off-white">
                <tr>
                  <th className="w-4 px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-scales-light-gray text-accents-accents focus:ring-accents-accents"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                    Inventory
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-scales-white divide-y divide-gray-scales-light-gray">
                {filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="w-4 px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                        className="rounded border-gray-scales-light-gray text-accents-accents focus:ring-accents-accents"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={product.image}
                            alt={product.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-scales-black">
                            {product.title}
                          </div>
                          <div className="text-sm text-gray-scales-dark-gray">
                            {product.description.length > 50
                              ? `${product.description.substring(0, 50)}...`
                              : product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-scales-dark-gray">
                        {product.category.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-scales-dark-gray">
                        ${product.price.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-scales-dark-gray">
                        {product.inventory}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.status === 'In Stock'
                          ? 'bg-green-100 text-green-800'
                          : product.status === 'Out of Stock'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-accents-accents hover:text-accents-dark-accents mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-scales-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-scales-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-scales-black mb-6">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-scales-dark-gray">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full rounded-3xs border-gray-scales-light-gray focus:ring-accents-accents focus:border-accents-accents"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-scales-dark-gray">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="mt-1 w-full rounded-3xs border-gray-scales-light-gray focus:ring-accents-accents focus:border-accents-accents"
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-scales-dark-gray">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 w-full rounded-3xs border-gray-scales-light-gray focus:ring-accents-accents focus:border-accents-accents"
                  />
                </div>
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-scales-dark-gray">
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full rounded-3xs border-gray-scales-light-gray focus:ring-accents-accents focus:border-accents-accents"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-scales-dark-gray">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full rounded-3xs border-gray-scales-light-gray focus:ring-accents-accents focus:border-accents-accents"
                  >
                    <option value="">Select a category</option>
                    <option value="category1">Category 1</option>
                    <option value="category2">Category 2</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="inventory" className="block text-sm font-medium text-gray-scales-dark-gray">
                    Inventory
                  </label>
                  <input
                    type="number"
                    id="inventory"
                    name="inventory"
                    value={formData.inventory}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="mt-1 w-full rounded-3xs border-gray-scales-light-gray focus:ring-accents-accents focus:border-accents-accents"
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-scales-dark-gray">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full rounded-3xs border-gray-scales-light-gray focus:ring-accents-accents focus:border-accents-accents"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Low Stock">Low Stock</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-scales-dark-gray hover:text-gray-scales-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 bg-accents-accents text-white rounded-3xs hover:bg-accents-dark-accents ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 