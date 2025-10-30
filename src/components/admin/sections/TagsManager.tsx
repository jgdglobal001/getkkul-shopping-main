"use client";

import { ProductFormData } from "../utils/product-types";
import { FiTag, FiX } from "react-icons/fi";

interface TagsManagerProps {
  formData: ProductFormData;
  newTag: string;
  onNewTagChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

export const TagsManager = ({
  formData,
  newTag,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
}: TagsManagerProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center gap-2 mb-6">
        <FiTag className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">태그 관리</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          태그 추가 (#으로 구분)
        </label>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTag}
            onChange={(e) => onNewTagChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onAddTag()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: #신상품 #할인 #인기"
          />
          <button
            type="button"
            onClick={onAddTag}
            className="bg-theme-color text-white px-4 py-2 rounded-lg hover:bg-theme-color/80 transition-colors"
          >
            추가
          </button>
        </div>

        {/* 태그 목록 */}
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              #{tag}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="text-blue-700 hover:text-red-600 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>

        {formData.tags.length === 0 && (
          <p className="text-gray-500 text-sm">태그가 없습니다</p>
        )}
      </div>
    </div>
  );
};