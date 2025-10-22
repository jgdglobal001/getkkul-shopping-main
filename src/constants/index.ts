import { bannerImageOne } from "@/assets";

export const navigation = [
  { title: "홈", href: "/" },
  { title: "상품", href: "/products" },
  { title: "카테고리", href: "/categories" },
  { title: "특가", href: "/offers" },
];
export const InfoNavigation = [
  { title: "회사소개", href: "/" },
  { title: "문의하기", href: "/" },
  { title: "고객센터", href: "/" },
  { title: "자주 묻는 질문", href: "/" },
];

export const banner = {
  _id: 1001,
  priceText: "999,900원부터 시작",
  title: "2024 최고의 태블릿 컬렉션",
  textOne: "독점 특가",
  offerPrice: "-30%",
  textTwo: "이번 주 할인",
  buttonLink: "/products",
  image: { src: bannerImageOne },
};
