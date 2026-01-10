import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery, useCreateProductMutation, useUpdateProductMutation } from '../../app/store/api/productsApi';
import { useGetUserByIdQuery, useCreateUserMutation, useUpdateUserMutation } from '../../app/store/api/usersApi';
import { useGetOrderByIdQuery, useCreateOrderMutation, useUpdateOrderMutation } from '../../app/store/api/ordersApi';
import Loader from '../loader/Loader';
import { useAppSelector } from '../../app/store/hooks';

type FeatureType = 'product' | 'user' | 'order';

interface CollectionEditorProps {
  id?: string;
  mode: 'edit' | 'create';
  featureType: FeatureType;
}

const CollectionEditor: React.FC<CollectionEditorProps> = ({ id, mode, featureType }) => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: productData, isLoading: productLoading } = useGetProductByIdQuery(id || '', {
    skip: featureType !== 'product' || mode !== 'edit' || !id,
  });
  const [createProduct, { isLoading: creatingProduct }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updatingProduct }] = useUpdateProductMutation();

  const { data: userData, isLoading: userLoading } = useGetUserByIdQuery(id || '', {
    skip: featureType !== 'user' || mode !== 'edit' || !id,
  });
  const [createUser, { isLoading: creatingUser }] = useCreateUserMutation();
  const [updateUser, { isLoading: updatingUser }] = useUpdateUserMutation();

  const { data: orderData, isLoading: orderLoading } = useGetOrderByIdQuery(id || '', {
    skip: featureType !== 'order' || mode !== 'edit' || !id,
  });
  const [createOrder, { isLoading: creatingOrder }] = useCreateOrderMutation();
  const [updateOrder, { isLoading: updatingOrder }] = useUpdateOrderMutation();

  const isLoading = productLoading || userLoading || orderLoading;
  const isSaving = creatingProduct || updatingProduct || creatingUser || updatingUser || creatingOrder || updatingOrder;

  useEffect(() => {
    if (mode === 'edit') {
      if (featureType === 'product' && productData) {
        setFormData(productData);
      } else if (featureType === 'user' && userData) {
        setFormData(userData);
      } else if (featureType === 'order' && orderData) {
        setFormData(orderData);
      }
    } else {
      if (featureType === 'product') {
        setFormData({ product_name: '', product_category: '', product_price: 0 });
      } else if (featureType === 'user') {
        setFormData({ firstName: '', lastName: '', email: '', password: '', type: 'user' });
      } else if (featureType === 'order') {
        setFormData({
          order_user_id: '',
          order_item_count: 0,
          order_items: [],
          order_item_subtotal: 0,
          order_item_tax: 0,
          order_item_shipping: 0,
          order_item_total: 0,
          order_paid: false,
          order_status: 'pending',
        });
      }
    }
  }, [mode, featureType, productData, userData, orderData]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (featureType === 'product') {
      if (!formData.product_name?.trim()) newErrors.product_name = 'Product name is required';
      if (!formData.product_category?.trim()) newErrors.product_category = 'Category is required';
      if (formData.product_price <= 0) newErrors.product_price = 'Price must be greater than 0';
    } else if (featureType === 'user') {
      if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email?.trim()) newErrors.email = 'Email is required';
      if (mode === 'create' && !formData.password?.trim()) newErrors.password = 'Password is required';
    } else if (featureType === 'order') {
      if (!formData.order_user_id?.trim()) newErrors.order_user_id = 'User ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (featureType === 'product') {
        if (mode === 'create') {
          await createProduct(formData).unwrap();
        } else if (id) {
          await updateProduct({ id, data: formData }).unwrap();
        }
      } else if (featureType === 'user') {
        if (mode === 'create') {
          await createUser(formData).unwrap();
        } else if (id) {
          await updateUser({ id, data: formData }).unwrap();
        }
      } else if (featureType === 'order') {
        if (mode === 'create') {
          await createOrder(formData).unwrap();
        } else if (id) {
          await updateOrder({ id, userId: formData.order_user_id, data: formData }).unwrap();
        }
      }
      navigate(`/admin-${featureType}`);
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleCancel = () => {
    navigate(`/admin-${featureType}`);
  };

  if (isLoading) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-neutral relative z-0 p-6 flex flex-col flex-8 overflow-y-auto"
    >
      <div className="max-w-4xl w-full mx-auto">
        <h1 className="text-3xl font-bold text-neutral-contrast font-primary mb-6">
          {mode === 'create' ? 'Create' : 'Edit'} {featureType.charAt(0).toUpperCase() + featureType.slice(1)}
        </h1>

        <div className="space-y-6 bg-neutral3 p-6 rounded-lg">
          {featureType === 'product' && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-contrast mb-2">Product Name *</label>
                <input
                  type="text"
                  value={formData.product_name || ''}
                  onChange={(e) => handleChange('product_name', e.target.value)}
                  className="w-full input-primary"
                />
                {errors.product_name && <p className="text-red-500 text-sm mt-1">{errors.product_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-contrast mb-2">Category *</label>
                <input
                  type="text"
                  value={formData.product_category || ''}
                  onChange={(e) => handleChange('product_category', e.target.value)}
                  className="w-full input-primary"
                />
                {errors.product_category && <p className="text-red-500 text-sm mt-1">{errors.product_category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-contrast mb-2">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.product_price || 0}
                  onChange={(e) => handleChange('product_price', parseFloat(e.target.value))}
                  className="w-full input-primary"
                />
                {errors.product_price && <p className="text-red-500 text-sm mt-1">{errors.product_price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-contrast mb-2">Description</label>
                <textarea
                  value={formData.product_description || ''}
                  onChange={(e) => handleChange('product_description', e.target.value)}
                  rows={4}
                  className="w-full input-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-contrast mb-2">Image URL</label>
                <input
                  type="text"
                  value={formData.product_image || ''}
                  onChange={(e) => handleChange('product_image', e.target.value)}
                  className="w-full input-primary"
                />
              </div>
            </>
          )}

          {featureType === 'user' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-contrast mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full input-primary"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-contrast mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full input-primary"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-contrast mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full input-primary"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {mode === 'create' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-contrast mb-2">Password *</label>
                  <input
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full input-primary"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-contrast mb-2">User Type</label>
                <select
                  value={formData.type || 'user'}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className={`w-full ${user?.type !== 'admin' ? "input-disabled" : "input-primary"}`}
                  disabled={user?.type !== 'admin'}
                >
                  <option value="user">User</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-contrast mb-2">Profile Image URL</label>
                <input
                  type="text"
                  value={formData.profileImage || ''}
                  onChange={(e) => handleChange('profileImage', e.target.value)}
                  className="w-full input-primary"
                />
              </div>
            </>
          )}

          {featureType === 'order' && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-contrast mb-2">User ID *</label>
                <input
                  type="text"
                  value={formData.order_user_id || ''}
                  disabled
                  onChange={(e) => handleChange('order_user_id', e.target.value)}
                  className="w-full input-disabled"
                />
                {errors.order_user_id && <p className="text-red-500 text-sm mt-1">{errors.order_user_id}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-contrast mb-2">Item Count</label>
                  <input
                    type="number"
                    value={formData.order_item_count || 0}
                    onChange={(e) => handleChange('order_item_count', parseInt(e.target.value))}
                    disabled
                    className="w-full input-disabled"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-contrast mb-2">Status</label>
                  <select
                    value={formData.order_status || 'pending'}
                    onChange={(e) => handleChange('order_status', e.target.value)}
                    className="w-full input-primary"
                  >
                    <option value="pending">Pending</option>
                    <option value="purchased">Purchased</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-contrast mb-2">Subtotal</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.order_item_subtotal || 0}
                    onChange={(e) => handleChange('order_item_subtotal', parseFloat(e.target.value))}
                    disabled
                    className="w-full input-disabled"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-contrast mb-2">Tax</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.order_item_tax || 0}
                    onChange={(e) => handleChange('order_item_tax', parseFloat(e.target.value))}
                    className="w-full input-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-contrast mb-2">Shipping</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.order_item_shipping || 0}
                    onChange={(e) => handleChange('order_item_shipping', parseFloat(e.target.value))}
                    className="w-full input-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-contrast mb-2">Total</label>
                  <input
                    type="number"
                    step="0.01"
                    value={(formData.order_item_subtotal + formData.order_item_tax + formData.order_item_shipping).toFixed(2)}
                    onChange={(e) => handleChange('order_item_total', parseFloat(e.target.value))}
                    disabled
                    className="w-full input-disabled"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.order_paid || false}
                    onChange={(e) => handleChange('order_paid', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-gray-300">Paid</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.order_shipped || false}
                    onChange={(e) => handleChange('order_shipped', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-gray-300">Shipped</span>
                </label>
              </div>
            </>
          )}

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleCancel}
              className="btn-gray"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="btn-primary"
            >
              {isSaving ? 'Saving...' : mode === 'create' ? 'Create' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CollectionEditor;