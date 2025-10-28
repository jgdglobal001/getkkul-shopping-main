"use client";

import { useState, useEffect } from "react";
import Container from "@/components/Container";
import { FiPlus, FiEdit, FiTrash2, FiX, FiCheck, FiDownload, FiAlertTriangle } from "react-icons/fi";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesManagementClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [migrating, setMigrating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    icon: "",
    order: 0,
  });

  // 자동 마이그레이션
  const handleAutoMigrate = async () => {
    try {
      setMigrating(true);
      const response = await fetch("/api/admin/categories/migrate", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("자동 마이그레이션 실패:", err);
    } finally {
      setMigrating(false);
    }
  };

  // 카테고리 목록 조회
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/categories");
      if (!response.ok) throw new Error("카테고리를 조회하는 중 오류가 발생했습니다");
      const data = await response.json();
      setCategories(data);
      setError(null);

      // 카테고리가 없으면 자동 마이그레이션 시도
      if (data.length === 0) {
        await handleAutoMigrate();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      image: "",
      icon: "",
      order: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  // 카테고리 추가/수정
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      alert("카테고리 이름과 슬러그는 필수입니다");
      return;
    }

    try {
      const url = editingId
        ? `/api/admin/categories/${editingId}`
        : "/api/admin/categories";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "오류가 발생했습니다");
      }

      await fetchCategories();
      resetForm();
      alert(editingId ? "카테고리가 수정되었습니다" : "카테고리가 추가되었습니다");
    } catch (err) {
      alert(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다");
    }
  };

  // 카테고리 수정
  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image: category.image || "",
      icon: category.icon || "",
      order: category.order,
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  // 카테고리 삭제 (1단계: 확인 모달 표시)
  const handleDeleteClick = (id: string, name: string) => {
    setDeleteConfirm({ id, name });
  };

  // 카테고리 삭제 (2단계: 최종 삭제)
  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      const response = await fetch(`/api/admin/categories/${deleteConfirm.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("카테고리 삭제에 실패했습니다");

      await fetchCategories();
      setDeleteConfirm(null);
      alert("카테고리가 삭제되었습니다");
    } catch (err) {
      alert(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다");
    }
  };

  return (
    <Container className="py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">카테고리 관리</h1>
            <p className="text-gray-600">카테고리를 추가, 수정, 삭제하고 관리하세요</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-theme-color text-white px-6 py-3 rounded-lg hover:bg-theme-color/80 transition-colors flex items-center gap-2 mt-4 md:mt-0"
          >
            <FiPlus className="w-5 h-5" />
            새 카테고리 추가
          </button>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* 마이그레이션 중 로딩 */}
      {migrating && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="animate-spin">
              <FiDownload className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-blue-700 font-medium">카테고리 마이그레이션 중...</p>
          </div>
        </div>
      )}

      {/* 폼 */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {editingId ? "카테고리 수정" : "새 카테고리 추가"}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리 이름 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                  placeholder="예: 스마트폰"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  슬러그 *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                  placeholder="예: smartphones"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="카테고리 설명을 입력하세요"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지 URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  아이콘 (이모지 또는 URL)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                  placeholder="📱"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                순서
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="bg-theme-color text-white px-6 py-2 rounded-lg hover:bg-theme-color/80 transition-colors flex items-center gap-2"
              >
                <FiCheck className="w-4 h-4" />
                {editingId ? "수정" : "추가"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 카테고리 목록 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-theme-color"></div>
          <p className="text-gray-600 mt-4">카테고리를 로드하는 중...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">등록된 카테고리가 없습니다</p>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-theme-color text-white px-6 py-2 rounded-lg hover:bg-theme-color/80 transition-colors inline-flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            첫 카테고리 추가
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    슬러그
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    설명
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    순서
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {category.icon && <span className="mr-2">{category.icon}</span>}
                      {category.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {category.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {category.order}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          category.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {category.isActive ? "활성" : "비활성"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
                        >
                          <FiEdit className="w-4 h-4" />
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteClick(category.id, category.name)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2단계 삭제 확인 모달 */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-in">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <FiAlertTriangle className="w-6 h-6 text-red-600" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              카테고리 삭제 확인
            </h3>

            <p className="text-gray-600 text-center mb-6">
              정말로 <span className="font-semibold text-gray-900">&quot;{deleteConfirm.name}&quot;</span> 카테고리를 삭제하시겠습니까?
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-red-700">
                ⚠️ 이 작업은 취소할 수 없습니다. 신중하게 선택해주세요.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                취소
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <FiTrash2 className="w-4 h-4" />
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

