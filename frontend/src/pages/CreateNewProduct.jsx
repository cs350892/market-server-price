import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LoaderCircle, Upload, X, Plus, Trash2 } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'

// Schema matching your backend model
const productSchema = z.object({
  productImage: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, { message: 'Product image is required' })
    .refine(
      (files) => {
        const file = files[0]
        return ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file?.type)
      },
      { message: 'Only JPEG, PNG and WebP images are allowed' }
    )
    .refine((files) => files[0]?.size <= 4 * 1024 * 1024, {
      message: 'Image size must be less than 4MB'
    }),
  productName: z.string().min(1, 'Product name is required').max(200, 'Product name cannot exceed 200 characters'),
  brand: z.string().min(1, 'Brand is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  discountPercentage: z.coerce.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100%').default(0),
  mrp: z.coerce.number().positive('MRP must be greater than 0'),
  rate: z.coerce.number().positive('Rate must be greater than 0'),
  category: z.string().min(1, 'At least one category is required'),
  stockQuantity: z.coerce.number().int().nonnegative('Stock must be non-negative').default(0),
  hsnNumber: z.coerce.number().int().positive('HSN number is required'),
  gstPercentage: z.coerce.number().min(0, 'GST cannot be negative').max(100, 'GST cannot exceed 100%')
})

const CreateNewProduct = () => {
  const [preview, setPreview] = useState(null)
  const [displayMessage, setDisplayMessage] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Quantity-based pricing state
  const [quantityPricing, setQuantityPricing] = useState([])

  // Pack sizes state
  const [packSizes, setPackSizes] = useState([])

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      discountPercentage: 0,
      stockQuantity: 0
    }
  })

  const mutation = useMutation({
    mutationKey: ['createProduct'],
    mutationFn: async (data) => {
      // Your API call here - replace with actual import
      const response = await fetch('/api/v1/products/create', {
        method: 'POST',
        body: data
      })
      return response.json()
    },
    onError: async (err) => {
      console.error('Error:', err)
      const errorMessage = err.response?.data?.message || 'Unable to upload product. Please try again!'
      setDisplayMessage(errorMessage)
      toast.error(errorMessage, { position: 'top-right' })

      if (err.response?.status === 401) {
        sessionStorage.clear()
        navigate('/dashboard/auth/login')
      }
    },
    onSuccess: async (response) => {
      console.log('Success:', response)
      toast.success('Product created successfully', { position: 'top-right' })

      if (response.isAccessTokenExp) {
        const userSessionData = JSON.parse(sessionStorage.getItem('user') || '{}')
        userSessionData.accessToken = response.accessToken
        sessionStorage.setItem('user', JSON.stringify(userSessionData))
      }

      setDisplayMessage(response.message)
      await queryClient.refetchQueries({ queryKey: ['products'] })
      
      reset()
      setPreview(null)
      setQuantityPricing([])
      setPackSizes([])
      
      setTimeout(() => {
        navigate('/dashboard/product/allProducts')
      }, 1500)
    }
  })

  const productImage = watch('productImage')

  useEffect(() => {
    if (productImage?.length) {
      const file = productImage[0]
      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl)
      return () => URL.revokeObjectURL(imageUrl)
    }
  }, [productImage])

  // Quantity pricing handlers
  const addQuantityPricing = () => {
    setQuantityPricing([...quantityPricing, { minQuantity: '', maxQuantity: '', discountPercentage: '' }])
  }

  const removeQuantityPricing = (index) => {
    setQuantityPricing(quantityPricing.filter((_, i) => i !== index))
  }

  const updateQuantityPricing = (index, field, value) => {
    const updated = [...quantityPricing]
    updated[index][field] = value
    setQuantityPricing(updated)
  }

  // Pack sizes handlers
  const addPackSize = () => {
    setPackSizes([...packSizes, { name: '', multiplier: '' }])
  }

  const removePackSize = (index) => {
    setPackSizes(packSizes.filter((_, i) => i !== index))
  }

  const updatePackSize = (index, field, value) => {
    const updated = [...packSizes]
    updated[index][field] = value
    setPackSizes(updated)
  }

  const onSubmit = (data) => {
    console.log('Product form data:', data)
    
    const formData = new FormData()
    formData.append('productImage', data.productImage[0])
    formData.append('productName', data.productName)
    formData.append('brand', data.brand)
    formData.append('description', data.description)
    formData.append('category', data.category)
    formData.append('discountPercentage', String(data.discountPercentage))
    formData.append('mrp', String(data.mrp))
    formData.append('rate', String(data.rate))
    formData.append('stockQuantity', String(data.stockQuantity))
    formData.append('hsnNumber', String(data.hsnNumber))
    formData.append('gstPercentage', String(data.gstPercentage))
    
    // Add quantity pricing if exists
    if (quantityPricing.length > 0) {
      const validPricing = quantityPricing.filter(p => 
        p.minQuantity && p.discountPercentage
      ).map(p => ({
        minQuantity: Number(p.minQuantity),
        maxQuantity: p.maxQuantity ? Number(p.maxQuantity) : null,
        discountPercentage: Number(p.discountPercentage)
      }))
      
      if (validPricing.length > 0) {
        formData.append('quantityBasedPricing', JSON.stringify(validPricing))
      }
    }

    // Add pack sizes if exists
    if (packSizes.length > 0) {
      const validPackSizes = packSizes.filter(p => 
        p.name && p.multiplier
      ).map(p => ({
        name: p.name,
        multiplier: Number(p.multiplier)
      }))
      
      if (validPackSizes.length > 0) {
        formData.append('packSizes', JSON.stringify(validPackSizes))
      }
    }

    mutation.mutate(formData)
  }

  const clearPreview = () => {
    setPreview(null)
    const fileInput = document.querySelector('input[type="file"]') 
    if (fileInput) {
      fileInput.value = ''
    }
  }

  return (
    <div className="container min-h-screen p-4 mx-auto sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="p-6 bg-white shadow-lg rounded-xl sm:p-8">
          {/* Header */}
          <div className="pb-6 mb-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Create New Product</h1>
            <p className="mt-2 text-sm text-gray-600">Add a new product to your inventory</p>
          </div>

          {/* Status Messages */}
          {mutation.isError && (
            <div className="flex items-start gap-2 p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-lg">
              <span className="font-medium">Error:</span>
              <span>{displayMessage || 'Unable to upload product. Please try again!'}</span>
            </div>
          )}

          {mutation.isSuccess && (
            <div className="flex items-start gap-2 p-4 mb-6 text-sm text-green-700 bg-green-50 rounded-lg">
              <span className="font-medium">Success:</span>
              <span>{displayMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload Section */}
            <div className="p-6 border-2 border-gray-200 border-dashed rounded-lg bg-gray-50">
              <label className="block">
                <span className="block mb-3 text-sm font-semibold text-gray-700">
                  Product Image <span className="text-red-500">*</span>
                </span>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
                      {...register('productImage')}
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Accepted formats: JPEG, PNG, WebP (Max 4MB)
                    </p>
                  </div>
                  {preview && (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="object-cover border-2 border-gray-200 rounded-lg w-28 h-28 sm:w-32 sm:h-32"
                      />
                      <button
                        type="button"
                        onClick={clearPreview}
                        className="absolute top-0 right-0 p-1 text-white transition-colors bg-red-500 rounded-full hover:bg-red-600 -mt-2 -mr-2"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
                {errors.productImage && (
                  <p className="mt-2 text-sm text-red-600">{errors.productImage.message}</p>
                )}
              </label>
            </div>

            {/* Grid Layout for Form Fields */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Product Name */}
              <div className="md:col-span-2">
                <label className="block">
                  <span className="block mb-2 text-sm font-medium text-gray-700">
                    Product Name <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="text"
                    className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter product name"
                    {...register('productName')}
                  />
                  {errors.productName && (
                    <p className="mt-1 text-sm text-red-600">{errors.productName.message}</p>
                  )}
                </label>
              </div>

              {/* Brand */}
              <div>
                <label className="block">
                  <span className="block mb-2 text-sm font-medium text-gray-700">
                    Brand <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="text"
                    className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter brand name"
                    {...register('brand')}
                  />
                  {errors.brand && (
                    <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
                  )}
                </label>
              </div>

              {/* Category */}
              <div>
                <label className="block">
                  <span className="block mb-2 text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="text"
                    className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="e.g., electronics, furniture"
                    {...register('category')}
                  />
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </label>
              </div>

              {/* MRP */}
              <div>
                <label className="block">
                  <span className="block mb-2 text-sm font-medium text-gray-700">
                    MRP (₹) <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Maximum Retail Price"
                    {...register('mrp')}
                  />
                  {errors.mrp && (
                    <p className="mt-1 text-sm text-red-600">{errors.mrp.message}</p>
                  )}
                </label>
              </div>

              {/* Rate */}
              <div>
                <label className="block">
                  <span className="block mb-2 text-sm font-medium text-gray-700">
                    Rate (₹) <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Selling rate"
                    {...register('rate')}
                  />
                  {errors.rate && (
                    <p className="mt-1 text-sm text-red-600">{errors.rate.message}</p>
                  )}
                </label>
              </div>

              {/* Discount Percentage */}
              <div>
                <label className="block">
                  <span className="block mb-2 text-sm font-medium text-gray-700">
                    Discount (%)
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="0"
                    {...register('discountPercentage')}
                  />
                  {errors.discountPercentage && (
                    <p className="mt-1 text-sm text-red-600">{errors.discountPercentage.message}</p>
                  )}
                </label>
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="block">
                  <span className="block mb-2 text-sm font-medium text-gray-700">
                    Stock Quantity
                  </span>
                  <input
                    type="number"
                    className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="0"
                    {...register('stockQuantity')}
                  />
                  {errors.stockQuantity && (
                    <p className="mt-1 text-sm text-red-600">{errors.stockQuantity.message}</p>
                  )}
                </label>
              </div>

              {/* HSN Number */}
              <div>
                <label className="block">
                  <span className="block mb-2 text-sm font-medium text-gray-700">
                    HSN Number <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="number"
                    className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter HSN code"
                    {...register('hsnNumber')}
                  />
                  {errors.hsnNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.hsnNumber.message}</p>
                  )}
                </label>
              </div>

              {/* GST Percentage */}
              <div>
                <label className="block">
                  <span className="block mb-2 text-sm font-medium text-gray-700">
                    GST (%) <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="e.g., 18"
                    {...register('gstPercentage')}
                  />
                  {errors.gstPercentage && (
                    <p className="mt-1 text-sm text-red-600">{errors.gstPercentage.message}</p>
                  )}
                </label>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block">
                  <span className="block mb-2 text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </span>
                  <textarea
                    rows={4}
                    className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                    placeholder="Enter detailed product description..."
                    {...register('description')}
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </label>
              </div>
            </div>

            {/* Quantity Based Pricing Section */}
            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Quantity Based Pricing</h3>
                  <p className="text-sm text-gray-600">Set discounts based on order quantity (Optional)</p>
                </div>
                <button
                  type="button"
                  onClick={addQuantityPricing}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                >
                  <Plus size={16} />
                  Add Tier
                </button>
              </div>

              {quantityPricing.length > 0 && (
                <div className="space-y-4">
                  {quantityPricing.map((pricing, index) => (
                    <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Tier {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeQuantityPricing(index)}
                          className="text-red-600 hover:text-red-700 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                          <label className="block mb-2 text-xs font-medium text-gray-700">
                            Min Quantity *
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={pricing.minQuantity}
                            onChange={(e) => updateQuantityPricing(index, 'minQuantity', e.target.value)}
                            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="e.g., 10"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-xs font-medium text-gray-700">
                            Max Quantity (Optional)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={pricing.maxQuantity}
                            onChange={(e) => updateQuantityPricing(index, 'maxQuantity', e.target.value)}
                            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="e.g., 50"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-xs font-medium text-gray-700">
                            Discount % *
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={pricing.discountPercentage}
                            onChange={(e) => updateQuantityPricing(index, 'discountPercentage', e.target.value)}
                            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="e.g., 5"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {quantityPricing.length === 0 && (
                <p className="text-sm text-center text-gray-500 py-8">
                  No pricing tiers added yet. Click "Add Tier" to create quantity-based discounts.
                </p>
              )}
            </div>

            {/* Pack Sizes Section */}
            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Pack Sizes</h3>
                  <p className="text-sm text-gray-600">Define different pack size options (Optional)</p>
                </div>
                <button
                  type="button"
                  onClick={addPackSize}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                >
                  <Plus size={16} />
                  Add Pack
                </button>
              </div>

              {packSizes.length > 0 && (
                <div className="space-y-4">
                  {packSizes.map((pack, index) => (
                    <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Pack {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removePackSize(index)}
                          className="text-red-600 hover:text-red-700 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block mb-2 text-xs font-medium text-gray-700">
                            Pack Name *
                          </label>
                          <input
                            type="text"
                            value={pack.name}
                            onChange={(e) => updatePackSize(index, 'name', e.target.value)}
                            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="e.g., Pack of 2, 200ml, 1 ltr"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-xs font-medium text-gray-700">
                            Multiplier *
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={pack.multiplier}
                            onChange={(e) => updatePackSize(index, 'multiplier', e.target.value)}
                            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="e.g., 2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {packSizes.length === 0 && (
                <p className="text-sm text-center text-gray-500 py-8">
                  No pack sizes added yet. Click "Add Pack" to define different pack size options.
                </p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse gap-3 pt-6 border-t border-gray-200 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate('/dashboard/product/allProducts')}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending || isSubmitting}
                className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {mutation.isPending ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    <span>Create Product</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default CreateNewProduct