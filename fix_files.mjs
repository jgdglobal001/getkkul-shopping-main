import fs from 'fs';

// Fix layout.tsx - add PartnerRefTracker
const layoutPath = './src/app/layout.tsx';
let layoutContent = fs.readFileSync(layoutPath, 'utf-8');

if (!layoutContent.includes('PartnerRefTracker')) {
  layoutContent = layoutContent.replace(
    'import NavbarWrapper from "@/components/NavbarWrapper";',
    `import NavbarWrapper from "@/components/NavbarWrapper";
import PartnerRefTracker from "@/components/PartnerRefTracker";`
  );
  
  layoutContent = layoutContent.replace(
    '<NavbarWrapper />',
    `<NavbarWrapper />
            <PartnerRefTracker />`
  );
  
  fs.writeFileSync(layoutPath, layoutContent, 'utf-8');
  console.log('layout.tsx updated');
} else {
  console.log('layout.tsx already has PartnerRefTracker');
}

// Fix schema.ts - add partner columns to orders
const schemaPath = './src/lib/db/schema.ts';
let schemaContent = fs.readFileSync(schemaPath, 'utf-8');

if (!schemaContent.includes('partnerRef')) {
  const ordersMatch = schemaContent.match(/lastTossAttempt:[^,]+,?\n\}\);/);
  if (ordersMatch) {
    const replacement = `lastTossAttempt: timestamp('lastTossAttempt', { mode: 'date' }),
  // 파트너 정보 (지급대행용)
  partnerRef: text('partnerRef'),
  partnerSellerId: text('partnerSellerId'),
  partnerLinkId: text('partnerLinkId'),
});`;
    schemaContent = schemaContent.replace(ordersMatch[0], replacement);
    fs.writeFileSync(schemaPath, schemaContent, 'utf-8');
    console.log('schema.ts updated with partner columns');
  }
}

console.log('Done!');
