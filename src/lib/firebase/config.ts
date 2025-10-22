// 임시 더미 파일 - Firebase 제거 중
// 이 파일은 기존 API들의 import 오류를 방지하기 위한 임시 파일입니다.
// 모든 Firebase 관련 코드를 Prisma로 마이그레이션한 후 제거될 예정입니다.

export const db = null;

// Firebase 함수들의 더미 구현
export const collection = () => null;
export const doc = () => null;
export const setDoc = () => Promise.resolve();
export const getDoc = () => Promise.resolve({ exists: () => false, data: () => null });
export const getDocs = () => Promise.resolve({ empty: true, docs: [] });
export const query = () => null;
export const where = () => null;
export const orderBy = () => null;
export const limit = () => null;
export const deleteDoc = () => Promise.resolve();
export const updateDoc = () => Promise.resolve();
export const writeBatch = () => ({
  delete: () => null,
  update: () => null,
  set: () => null,
  commit: () => Promise.resolve()
});
export const serverTimestamp = () => new Date();
