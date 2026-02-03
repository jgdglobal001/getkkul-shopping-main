const fs = require('fs');
const ko = JSON.parse(fs.readFileSync('./src/locales/ko.json', 'utf8'));
const koExtended = {
    "shipping_modal": {
        "title": "무료 배송 안내",
        "subtitle": "겟꿀 쇼핑의 배송 정책을 확인하세요",
        "steps": {
            "cart": {
                "title": "1단계: 장바구니 담기",
                "description": "원하는 상품을 장바구니에 담으세요."
            },
            "threshold": {
                "title": "2단계: 금액 채우기",
                "description": "총 구매 금액이 5만원 이상이면 무료 배송 혜택이 적용됩니다."
            },
            "checkout": {
                "title": "3단계: 무료 배송 적용",
                "description": "장바구니에서 무료 배송 메시지를 확인하고 결제를 진행하세요."
            }
        },
        "benefits": {
            "title": "무료 배송 혜택",
            "items": [
                "전 상품 5만원 이상 구매 시 배송비 0원",
                "일부 상품 한정 전액 무료 배송",
                "도서 산간 지역 추가 배송비 할인"
            ]
        },
        "cta": "쇼핑 계속하기"
    },
    "checkout": {
        "title": "주문/결제",
        "checkout_process": "결제 과정",
        "billing_details": "주문자 정보",
        "shipping_info": "배송 정보",
        "payment_method": "결제 수단",
        "order_items": "주문 상품",
        "order_summary": "주문 요약",
        "place_order": "결제하기",
        "coupon_code": "쿠폰 코드",
        "apply_coupon": "적용",
        "shipping_method": "배송 방법",
        "standard_shipping": "일반 배송",
        "express_shipping": "당일 배송",
        "items_total": "상품 총액",
        "discount": "할인",
        "tax": "부가세",
        "total": "최종 결제 금액"
    },
    "account": {
        "profile": "프로필",
        "addresses": "배송지 관리",
        "orders": "주문 내역",
        "payment": "결제 수단",
        "notifications": "알림 설정",
        "settings": "계정 설정",
        "logout": "로그아웃",
        "edit_profile": "프로필 수정",
        "save_changes": "변경사항 저장"
    },
    "orders": {
        "order_number": "주문 번호",
        "order_date": "주문 일자",
        "order_status": "주문 상태",
        "order_total": "총 결제 금액",
        "view_details": "상세 보기",
        "track_shipping": "배송 조회",
        "cancel_order": "주문 취소",
        "return_item": "반품 신청"
    },
    "settings": {
        "language": "언어 설정",
        "currency": "통화 설정",
        "notifications": "알림",
        "email_notifications": "이메일 알림",
        "push_notifications": "푸시 알림",
        "theme": "테마 설정",
        "light_mode": "라이트 모드",
        "dark_mode": "다크 모드"
    },
    "wishlist": {
        "title": "관심 상품",
        "remove_item": "삭제",
        "add_to_cart": "장바구니 담기",
        "no_items": "관심 상품이 없습니다."
    }
};
const newKeys = {
    common: {
        favorite_added: '관심 상품에 추가되었습니다',
        favorite_removed: '관심 상품에서 제거되었습니다',
        login_required: '로그인이 필요합니다'
    },
    product: {
        off: '할인',
        items_left: '{{count}}개 남음!',
        view_details: '상세 보기',
        add_to_favorite: '관심 상품 추가',
        remove_from_favorite: '관심 상품 제거',
        viewers_watching: '지금 {{count}}+명이 이 상품을 보고 있습니다',
        reviews: '구매 후기',
        no_reviews: '등록된 구매 후기가 없습니다.'
    }
};

const merged = { ...ko };
for (const key in koExtended) {
    if (merged[key]) {
        merged[key] = { ...merged[key], ...koExtended[key] };
    } else {
        merged[key] = koExtended[key];
    }
}
for (const section in newKeys) {
    if (!merged[section]) merged[section] = {};
    for (const key in newKeys[section]) {
        merged[section][key] = newKeys[section][key];
    }
}
fs.writeFileSync('./src/locales/ko.json', JSON.stringify(merged, null, 2), 'utf8');
console.log('ko.json updated successfully');
