import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchSingleNewProduct,
  updateNewProduct,
  // logoutUser,
} from "../http/api.js";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { LoaderCircle, Save, X, ImageIcon } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

// Schema for update - all fields optional except those that are always required
const productUpdateSchema = z.object({
  productImage: z.instanceof(FileList).optional(),
  productName: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Product name cannot exceed 200 characters"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  discountPercentage: z.coerce
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%"),
  mrp: z.coerce.number().positive("MRP must be greater than 0"),
  rate: z.coerce.number().positive("Rate must be greater than 0"),
  category: z.string().min(1, "At least one category is required"),
  stockQuantity: z.coerce
    .number()
    .int()
    .nonnegative("Stock must be non-negative"),
  hsnNumber: z.coerce.number().int().positive("HSN number is required"),
  gstPercentage: z.coerce
    .number()
    .min(0, "GST cannot be negative")
    .max(100, "GST cannot exceed 100%"),
  quantityBasedPricing: z.string().optional(),
  packSizes: z.string().optional(),
});

const UpdateProduct = () => {
  const [preview, setPreview] = useState(null);
  const [oldImg, setOldImg] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  if (!id) {
    throw new Error("Product ID is missing");
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(productUpdateSchema),
    defaultValues: {
      productName: "",
      brand: "",
      category: "",
      description: "",
      discountPercentage: 0,
      mrp: 0,
      rate: 0,
      stockQuantity: 0,
      hsnNumber: 0,
      gstPercentage: 0,
      quantityBasedPricing: "",
      packSizes: "",
    },
  });

  // Fetch product data
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["singleProduct", id],
    queryFn: () => fetchSingleNewProduct(id),
    enabled: !!id,
  });

  // Update mutation
  const mutation = useMutation({
    mutationFn: (values) => {
      const formData = new FormData();

      // Handle image if provided
      if (values.productImage && values.productImage.length > 0) {
        formData.append("productImage", values.productImage[0]);
      }

      // Append all form values
      formData.append("productName", values.productName);
      formData.append("brand", values.brand);
      formData.append("category", values.category);
      formData.append("description", values.description);
      formData.append("discountPercentage", String(values.discountPercentage));
      formData.append("mrp", String(values.mrp));
      formData.append("rate", String(values.rate));
      formData.append("stockQuantity", String(values.stockQuantity));
      formData.append("hsnNumber", String(values.hsnNumber));
      formData.append("gstPercentage", String(values.gstPercentage));

      if (values.quantityBasedPricing) {
        formData.append("quantityBasedPricing", values.quantityBasedPricing);
      }
      if (values.packSizes) {
        formData.append("packSizes", values.packSizes);
      }

      return updateNewProduct(id, formData);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["singleProduct", id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully", { position: "top-right" });

      const { isAccessTokenExp, accessToken } = response.data;
      if (isAccessTokenExp) {
        const userSessionData = JSON.parse(
          sessionStorage.getItem("user") || "{}"
        );
        userSessionData.accessToken = accessToken;
        sessionStorage.removeItem("user");
        sessionStorage.setItem("user", JSON.stringify(userSessionData));
      }

      setTimeout(() => {
        navigate("/dashboard/product/allProducts");
      }, 1500);
    },
    onError: async (err) => {
      const message =
        err.response?.data?.message || "Error while updating product";

      console.error("Update error:", err);
      setErrorMessage(message);
      toast.error(message, { position: "top-right" });

      // Logout user if token expired
      if (err.response?.status === 401) {
        sessionStorage.clear();
        // await logoutUser();
        navigate("/dashboard/auth/login");
      }
    },
  });

  // Populate form with fetched data
  useEffect(() => {
    if (data?.data?.product) {
      const product = data.data.product;
      setOldImg(product.productImage);

      // Handle category - convert array to comma-separated string
      const categoryValue = Array.isArray(product.category)
        ? product.category.join(",")
        : product.category;

      // Set all form values
      setValue("productName", product.productName);
      setValue("brand", product.brand);
      setValue("category", categoryValue);
      setValue("description", product.description);
      setValue("discountPercentage", product.discountPercentage || 0);
      setValue("mrp", product.mrp);
      setValue("rate", product.rate);
      setValue("stockQuantity", product.stockQuantity);
      setValue("hsnNumber", product.hsnNumber);
      setValue("gstPercentage", product.gstPercentage);

      // Handle JSON fields
      if (
        product.quantityBasedPricing &&
        product.quantityBasedPricing.length > 0
      ) {
        setValue(
          "quantityBasedPricing",
          JSON.stringify(product.quantityBasedPricing, null, 2)
        );
      }
      if (product.packSizes && product.packSizes.length > 0) {
        setValue("packSizes", JSON.stringify(product.packSizes, null, 2));
      }
    }
  }, [data, setValue]);

  // Handle image preview
  const productImage = watch("productImage");
  useEffect(() => {
    if (productImage?.length) {
      const file = productImage[0];
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      return () => URL.revokeObjectURL(imageUrl);
    }
  }, [productImage]);

  const onSubmit = (values) => {
    mutation.mutate(values);
  };

  const clearPreview = () => {
    setPreview(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  if (isError) {
    const axiosError = error;
    const errorMessage =
      axiosError.response?.data?.message || "Error loading product";
    return (
      <div className="container p-4 mx-auto sm:p-6 lg:p-8">
        <div className="max-w-5xl p-6 mx-auto text-center bg-red-50 rounded-xl">
          <p className="text-2xl font-bold text-red-600">{errorMessage}</p>
          <button
            onClick={() => navigate("/dashboard/product/allProducts")}
            className="px-6 py-2 mt-4 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoaderCircle
            size={48}
            className="mx-auto mb-4 text-blue-600 animate-spin"
          />
          <p className="text-lg text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container min-h-screen p-4 mx-auto bg-gray-50 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="p-6 bg-white shadow-lg rounded-xl sm:p-8">
          {/* Header */}
          <div className="pb-6 mb-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Update Product
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Modify product details and save changes
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-start gap-2 p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-lg">
              <span className="font-medium">Error:</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload Section */}
            <div className="p-6 border-2 border-gray-200 border-dashed rounded-lg bg-gray-50">
              <label className="block">
                <span className="block mb-3 text-sm font-semibold text-gray-700">
                  Product Image (Optional)
                </span>
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
                      {...register("productImage")}
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Leave empty to keep current image. Accepted: JPEG, PNG,
                      WebP (Max 4MB)
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {/* New Preview */}
                    {preview && (
                      <div className="relative">
                        <div className="mb-2 text-xs font-medium text-gray-600">
                          New Image:
                        </div>
                        <img
                          src={preview}
                          alt="New preview"
                          className="object-cover border-2 border-green-400 rounded-lg w-28 h-28 sm:w-32 sm:h-32"
                        />
                        <button
                          type="button"
                          onClick={clearPreview}
                          className="absolute top-6 right-0 p-1 text-white transition-colors bg-red-500 rounded-full hover:bg-red-600 -mt-2 -mr-2"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}

                    {/* Current Image */}
                    {oldImg && (
                      <div>
                        <div className="mb-2 text-xs font-medium text-gray-600">
                          Current Image:
                        </div>
                        <img
                          src={oldImg}
                          alt="Current product"
                          className="object-cover border-2 border-gray-200 rounded-lg w-28 h-28 sm:w-32 sm:h-32"
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiBkeT0iLjNlbSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {errors.productImage && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.productImage.message}
                  </p>
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
                    {...register("productName")}
                  />
                  {errors.productName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.productName.message}
                    </p>
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
                    {...register("brand")}
                  />
                  {errors.brand && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.brand.message}
                    </p>
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
                    {...register("category")}
                  />
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.category.message}
                    </p>
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
                    {...register("mrp")}
                  />
                  {errors.mrp && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.mrp.message}
                    </p>
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
                    {...register("rate")}
                  />
                  {errors.rate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.rate.message}
                    </p>
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
                    {...register("discountPercentage")}
                  />
                  {errors.discountPercentage && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.discountPercentage.message}
                    </p>
                  )}
                </label>
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="block">
                  <span className="block mb-2 text-sm font-medium text-gray-700">
                    Stock Quantity <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="number"
                    className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="0"
                    {...register("stockQuantity")}
                  />
                  {errors.stockQuantity && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.stockQuantity.message}
                    </p>
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
                    {...register("hsnNumber")}
                  />
                  {errors.hsnNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.hsnNumber.message}
                    </p>
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
                    {...register("gstPercentage")}
                  />
                  {errors.gstPercentage && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.gstPercentage.message}
                    </p>
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
                    {...register("description")}
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </label>
              </div>

              {/* Quantity Based Pricing */}
              <div className="md:col-span-2">
                <label className="block">
                  <span className="block mb-2 text-sm font-medium text-gray-700">
                    Quantity Based Pricing (Optional JSON)
                  </span>
                  <textarea
                    rows={3}
                    className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono text-xs resize-none"
                    placeholder='[{"minQuantity": 10, "maxQuantity": 50, "discountPercentage": 5}]'
                    {...register("quantityBasedPricing")}
                  ></textarea>
                  {errors.quantityBasedPricing && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.quantityBasedPricing.message}
                    </p>
                  )}
                </label>
              </div>

              {/* Pack Sizes */}
              <div className="md:col-span-2">
                <label className="block">
                  <span className="block mb-2 text-sm font-medium text-gray-700">
                    Pack Sizes (Optional JSON)
                  </span>
                  <textarea
                    rows={3}
                    className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono text-xs resize-none"
                    placeholder='[{"name": "Pack of 2", "multiplier": 2}]'
                    {...register("packSizes")}
                  ></textarea>
                  {errors.packSizes && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.packSizes.message}
                    </p>
                  )}
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse gap-3 pt-6 border-t border-gray-200 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/dashboard/product/allProducts")}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isDirty || isSubmitting || mutation.isPending}
                className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {mutation.isPending ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateProduct;
