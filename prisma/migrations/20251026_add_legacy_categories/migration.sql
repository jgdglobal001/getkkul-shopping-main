-- Insert legacy PRODUCT_CATEGORIES items (from templates.ts)
INSERT INTO "categories" ("id", "name", "slug", "order", "isActive", "createdAt", "updatedAt") VALUES
  ('legacy-001', '스마트폰', 'smartphones-kr', 25, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('legacy-002', '노트북', 'notebooks-kr', 26, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('legacy-003', '태블릿', 'tablets-kr', 27, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('legacy-004', '헤드폰', 'headphones-kr', 28, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('legacy-005', '스마트워치', 'smartwatches-kr', 29, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('legacy-006', '카메라', 'cameras-kr', 30, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('legacy-007', '게임', 'games-kr', 31, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('legacy-008', '홈&가든', 'home-garden-kr', 32, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('legacy-009', '스포츠', 'sports-kr', 33, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('legacy-010', '뷰티', 'beauty-kr', 34, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('legacy-011', '자동차', 'automotive-kr', 35, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('legacy-012', '의류', 'clothing-kr', 36, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('legacy-013', '신발', 'shoes-kr', 37, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('legacy-014', '가전제품', 'appliances-kr', 38, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('legacy-015', '도서', 'books-kr', 39, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('legacy-016', '음악', 'music-kr', 40, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('legacy-017', '영화', 'movies-kr', 41, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('legacy-018', '완구', 'toys-kr', 42, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('legacy-019', '반려동물', 'pets-kr', 43, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('legacy-020', '기타', 'others-kr', 44, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO NOTHING;