const fs = require('fs');

const addKeys = (lang, newSectionKeys) => {
    const path = `./src/locales/${lang}.json`;
    if (!fs.existsSync(path)) {
        console.log(`${path} does not exist`);
        return;
    }
    let json;
    try {
        const raw = fs.readFileSync(path);
        // BOM 제거 (UTF-8)
        let content = raw.toString('utf8');
        if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
        }
        json = JSON.parse(content);
    } catch (e) {
        console.log(`Failed to parse ${path}: `, e.message);
        return;
    }

    for (const section in newSectionKeys) {
        if (!json[section]) json[section] = {};
        for (const key in newSectionKeys[section]) {
            if (!json[section][key]) {
                json[section][key] = newSectionKeys[section][key];
            }
        }
    }
    fs.writeFileSync(path, JSON.stringify(json, null, 2), 'utf8');
    console.log(`${path} updated successfully`);
};

const enKeys = {
    common: {
        favorite_added: 'Added to favorites',
        favorite_removed: 'Removed from favorites',
        login_required: 'Login required'
    },
    product: {
        off: 'OFF',
        items_left: '{{count}} left!',
        view_details: 'View details',
        add_to_favorite: 'Add to favorites',
        remove_from_favorite: 'Remove from favorites',
        viewers_watching: 'Over {{count}} people are watching this item right now',
        reviews: 'Customer Reviews',
        no_reviews: 'No reviews registered yet.'
    }
};

const zhKeys = {
    common: {
        favorite_added: '已添加到收藏',
        favorite_removed: '已从收藏中移除',
        login_required: '需要登录'
    },
    product: {
        off: '折扣',
        items_left: '剩余 {{count}} 件!',
        view_details: '查看详情',
        add_to_favorite: '添加到收藏',
        remove_from_favorite: '从收藏中移除',
        viewers_watching: '现在有超过 {{count}} 位用户正在查看此商品',
        reviews: '用户评价',
        no_reviews: '暂无评价。'
    }
};

addKeys('en', enKeys);
addKeys('zh', zhKeys);
