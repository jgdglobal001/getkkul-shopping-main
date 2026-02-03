const fs = require('fs');

const addKeys = (lang, newSectionKeys) => {
    const path = `./src/locales/${lang}.json`;
    if (!fs.existsSync(path)) return;
    let json;
    try {
        const raw = fs.readFileSync(path);
        let content = raw.toString('utf8');
        if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
        json = JSON.parse(content);
    } catch (e) { return; }

    for (const section in newSectionKeys) {
        if (!json[section]) json[section] = {};
        for (const key in newSectionKeys[section]) {
            if (!json[section][key]) {
                json[section][key] = newSectionKeys[section][key];
            }
        }
    }
    fs.writeFileSync(path, JSON.stringify(json, null, 2), 'utf8');
};

const keys = {
    ko: {
        shipping: {
            info: "배송정보",
            method: "배송방법",
            cost: "배송비",
            bundle: "묶음배송 여부",
            period: "배송기간",
            standard: "일반배송",
            free_threshold_desc: "3,000원 (29,000원 이상 구매 시 무료)",
            available: "가능",
            delivery_window: "주문 후 1-2일 이내 배송",
            exchange_return_info: "교환/반품 안내",
            exchange_return_cost: "교환/반품 비용",
            exchange_return_deadline: "교환/반품 신청 기준일",
            exchange_return_limitations: "교환/반품 제한사항",
            clothing_limitations: "의류/잡화 제한사항",
            food_limitations: "식품/화장품 제한사항",
            electronics_limitations: "전자/가전 제한사항",
            exchange_cost_desc: "초도배송비(편도) 3000원\n반품배송비(편도) 3,000원\n*고객사유로 인한 반품 시, 왕복 반품/배송비는 초도배송비 + 반품배송비의 합계인 6,000 원 이 청구됩니다*",
            deadline_desc: "제품 수령 후 7일 이내",
            packing_unopened: "포장 개봉시 상품은 반품 불가",
            tag_removed: "테그 제거 시 반품 불가",
            fresh_food_notice: "신선/냉장/냉동 상품은 단순변심 반품 불가",
            installed_notice: "설치 후 반품 불가",
            seller_info: "판매자 정보",
            seller: "판매자",
            seller_phone: "판매자 전화번호",
            legal_notice: "법적 고지사항",
            minor_contract_notice: "미성년자가 체결한 계약은 법정 대리인이 동의하지 않는 경우 본인 또는 법정대리인이 취소할 수 있습니다."
        }
    },
    en: {
        shipping: {
            info: "Shipping Information",
            method: "Shipping Method",
            cost: "Shipping Cost",
            bundle: "Bundle Shipping",
            period: "Delivery Period",
            standard: "Standard Shipping",
            free_threshold_desc: "$3.00 (Free over $29.00)",
            available: "Available",
            delivery_window: "Within 1-2 days after order",
            exchange_return_info: "Exchange/Return Policy",
            exchange_return_cost: "Exchange/Return Fee",
            exchange_return_deadline: "Deadline for Exchange/Return",
            exchange_return_limitations: "Return Policy Limitations",
            clothing_limitations: "Clothing/Fashion Limitations",
            food_limitations: "Food/Cosmetics Limitations",
            electronics_limitations: "Electronics/Appliances Limitations",
            exchange_cost_desc: "Initial Shipping (one-way) $3.00\nReturn Shipping (one-way) $3.00\n*For returns due to customer reasons, a total of $6.00 (initial + return) will be charged*",
            deadline_desc: "Within 7 days of receipt",
            packing_unopened: "Returns not accepted once packaging is opened",
            tag_removed: "Returns not accepted if tag is removed",
            fresh_food_notice: "Fresh/Chilled/Frozen products cannot be returned for simple change of mind",
            installed_notice: "Returns not accepted after installation",
            seller_info: "Seller Information",
            seller: "Seller",
            seller_phone: "Seller Phone Number",
            legal_notice: "Legal Notice",
            minor_contract_notice: "Contracts entered into by minors may be canceled by the individual or their legal representative if the legal representative does not consent."
        }
    },
    zh: {
        shipping: {
            info: "配送信息",
            method: "配送方式",
            cost: "运费",
            bundle: "合并配送",
            period: "配送周期",
            standard: "标准配送",
            free_threshold_desc: "3,000韩元 (购物满 29,000韩元以上免运费)",
            available: "可以",
            delivery_window: "下单后 1-2 天内发货",
            exchange_return_info: "退换货说明",
            exchange_return_cost: "退换货费用",
            exchange_return_deadline: "退换货申请期限",
            exchange_return_limitations: "退换货限制",
            clothing_limitations: "服装/杂货限制",
            food_limitations: "食品/化妆品限制",
            electronics_limitations: "电子/家电限制",
            exchange_cost_desc: "初始运费(单程) 3000韩元\n退货运费(单程) 3,000韩元\n*因顾客原因退货时, 将收取 6,000韩元 (初始运费 + 退货运费)* ",
            deadline_desc: "签收后 7 天内",
            packing_unopened: "包装拆封后不支持退货",
            tag_removed: "吊牌摘除后不支持退货",
            fresh_food_notice: "生鲜/冷藏/冷冻商品不支持由于主观原因的退货",
            installed_notice: "安装后不支持退货",
            seller_info: "卖家信息",
            seller: "卖家",
            seller_phone: "卖家电话",
            legal_notice: "法律告知书",
            minor_contract_notice: "未成年人签订的合同, 如果未经法定代理人同意, 本人或者法定代理人可以撤销。"
        }
    }
};

for (const lang in keys) {
    addKeys(lang, keys[lang]);
}
