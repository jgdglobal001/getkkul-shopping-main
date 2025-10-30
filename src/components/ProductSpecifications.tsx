import { ProductType } from "../../type";
import { FiTruck, FiShield, FiInfo } from "react-icons/fi";
import Image from "next/image";

interface ProductSpecificationsProps {
  product: ProductType;
}

const ProductSpecifications = ({ product }: ProductSpecificationsProps) => {
  const specifications = [
    {
      icon: <FiTruck className="w-5 h-5 text-green-600" />,
      label: "Shipping Info",
      value: product?.shippingInformation || "Standard shipping available",
    },
    {
      icon: <FiShield className="w-5 h-5 text-purple-600" />,
      label: "Warranty",
      value: product?.warrantyInformation || "Standard warranty",
    },
    {
      icon: <FiInfo className="w-5 h-5 text-orange-600" />,
      label: "Return Policy",
      value: product?.returnPolicy || "30-day return policy",
    },
  ];

  const additionalSpecs = [
    { label: "SKU", value: product?.sku || "N/A" },
    { label: "Availability", value: product?.availabilityStatus || "In Stock" },
    {
      label: "Minimum Order",
      value: `${product?.minimumOrderQuantity || 1} unit(s)`,
    },
    { label: "Stock", value: `${product?.stock || 0} available` },
  ];

  return (
    <div className="py-8 bg-white border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Product Specifications
      </h3>

      {/* Key Specifications with Icons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {specifications.map((spec, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex-shrink-0 mt-1">{spec.icon}</div>
            <div>
              <h4 className="font-semibold text-gray-900">{spec.label}</h4>
              <p className="text-sm text-gray-600 mt-1">{spec.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Specifications Table */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Additional Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {additionalSpecs.map((spec, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
            >
              <span className="font-medium text-gray-700">{spec.label}:</span>
              <span className="text-gray-600">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>



      {/* Detail Images if available */}
      {product?.detailImages && product.detailImages.length > 0 && (
        <div className="mt-6 bg-purple-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">상세 이미지</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {product.detailImages.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={image}
                  alt={`상세 이미지 ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSpecifications;
