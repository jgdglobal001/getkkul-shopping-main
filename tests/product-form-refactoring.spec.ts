import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Product Form Refactoring - Code Structure Verification', () => {
  // Test that refactored files exist and have correct structure
  
  test('should have types.ts file with ProductFormData interface', () => {
    const typesPath = path.join(__dirname, '../src/components/admin/types.ts');
    expect(fs.existsSync(typesPath)).toBeTruthy();
    
    const content = fs.readFileSync(typesPath, 'utf-8');
    expect(content).toContain('export interface ProductFormData');
    expect(content).toContain('title:');
    expect(content).toContain('description:');
    expect(content).toContain('price:');
  });

  test('should have constants.ts file with category templates', () => {
    const constantsPath = path.join(__dirname, '../src/components/admin/constants.ts');
    expect(fs.existsSync(constantsPath)).toBeTruthy();
    
    const content = fs.readFileSync(constantsPath, 'utf-8');
    expect(content).toContain('export const CATEGORY_TEMPLATES');
    expect(content).toContain('export const CATEGORIES');
    expect(content).toContain('export const SHIPPING_METHODS');
  });

  test('should have ProductFormClient.tsx importing from separated files', () => {
    const componentPath = path.join(__dirname, '../src/components/admin/ProductFormClient.tsx');
    expect(fs.existsSync(componentPath)).toBeTruthy();
    
    const content = fs.readFileSync(componentPath, 'utf-8');
    
    // Check that imports use separated files
    expect(content).toContain('import { ProductFormData, ProductFormClientProps }');
    expect(content).toContain('from "./utils/product-types"');
    expect(content).toContain('import { CATEGORY_TEMPLATES }');
    expect(content).toContain('from "./utils/templates"');
  });

  test('should not have duplicate type definitions in ProductFormClient', () => {
    const componentPath = path.join(__dirname, '../src/components/admin/ProductFormClient.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');
    
    // Should not have interface definitions at top level
    const interfaceCount = (content.match(/^export interface/gm) || []).length;
    expect(interfaceCount).toBe(0);
  });

  test('should not have hardcoded categories array in ProductFormClient', () => {
    const componentPath = path.join(__dirname, '../src/components/admin/ProductFormClient.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');
    
    // Should not have categories array definition
    expect(content).not.toContain('const categories = [');
    expect(content).not.toContain('const CATEGORIES = [');
  });

  test('types.ts should export all required interfaces', () => {
    const typesPath = path.join(__dirname, '../src/components/admin/types.ts');
    const content = fs.readFileSync(typesPath, 'utf-8');
    
    const requiredInterfaces = [
      'ProductFormData',
      'ProductFormClientProps',
      'ProductSubmitData',
      'TemplateData'
    ];
    
    requiredInterfaces.forEach(iface => {
      expect(content).toContain(`export interface ${iface}`);
    });
  });

  test('constants.ts should have all required exports', () => {
    const constantsPath = path.join(__dirname, '../src/components/admin/constants.ts');
    const content = fs.readFileSync(constantsPath, 'utf-8');
    
    const requiredConstants = [
      'export const CATEGORY_TEMPLATES',
      'export const CATEGORIES',
      'export const SHIPPING_METHODS',
      'export const BUNDLE_SHIPPING_OPTIONS',
      'export const AVAILABILITY_STATUS_OPTIONS'
    ];
    
    requiredConstants.forEach(constant => {
      expect(content).toContain(constant);
    });
  });

  test('should have at least 5 category templates defined', () => {
    const constantsPath = path.join(__dirname, '../src/components/admin/constants.ts');
    const content = fs.readFileSync(constantsPath, 'utf-8');
    
    // Count template categories (should have entries for main categories)
    const templateCount = (content.match(/name:/g) || []).length;
    expect(templateCount).toBeGreaterThan(5);
  });

  test('CATEGORIES array should have multiple options', () => {
    const constantsPath = path.join(__dirname, '../src/components/admin/constants.ts');
    const content = fs.readFileSync(constantsPath, 'utf-8');
    
    // Should have category options
    expect(content).toContain('스마트폰');
    expect(content).toContain('의류');
    expect(content).toContain('식품');
    expect(content).toContain('전자제품');
    expect(content).toContain('책');
  });

  test('SHIPPING_METHODS should have standard options', () => {
    const constantsPath = path.join(__dirname, '../src/components/admin/constants.ts');
    const content = fs.readFileSync(constantsPath, 'utf-8');
    
    // Should have shipping method options
    expect(content).toContain('일반배송');
    expect(content).toContain('신선배송');
  });

  test('ProductFormClient should have required section components', () => {
    const componentPath = path.join(__dirname, '../src/components/admin/ProductFormClient.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');
    
    const requiredComponents = [
      'BasicInfo',
      'ImagesManager',
      'TagsManager',
      'DisclosureInfo',
      'ShippingInfo',
      'ExchangeReturnInfo',
      'SellerInfo'
    ];
    
    requiredComponents.forEach(component => {
      expect(content).toContain(`import { ${component} }`);
    });
  });

  test('ProductFormClient should use template application handlers', () => {
    const componentPath = path.join(__dirname, '../src/components/admin/ProductFormClient.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');
    
    // Should have template-related functions
    expect(content).toContain('handleCategoryChange');
    expect(content).toContain('applyTemplate');
    expect(content).toContain('setSelectedTemplate');
  });

  test('should maintain original form functionality after refactoring', () => {
    const componentPath = path.join(__dirname, '../src/components/admin/ProductFormClient.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');
    
    // Should still have core form handlers
    expect(content).toContain('const handleSubmit');
    expect(content).toContain('const addTag');
    expect(content).toContain('const removeTag');
    expect(content).toContain('const addImage');
    expect(content).toContain('const removeImage');
    expect(content).toContain('const generateSKU');
  });

  test('should have proper state management for form data', () => {
    const componentPath = path.join(__dirname, '../src/components/admin/ProductFormClient.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');
    
    // Should have useState for form data
    expect(content).toContain('useState<ProductFormData>');
    expect(content).toContain('setFormData');
    expect(content).toContain('handleInputChange');
  });

  test('types and constants should have no circular dependencies', () => {
    const typesPath = path.join(__dirname, '../src/components/admin/types.ts');
    const constantsPath = path.join(__dirname, '../src/components/admin/constants.ts');
    
    const typesContent = fs.readFileSync(typesPath, 'utf-8');
    const constantsContent = fs.readFileSync(constantsPath, 'utf-8');
    
    // types.ts should not import from constants.ts
    expect(typesContent).not.toContain('from "./constants"');
    expect(typesContent).not.toContain('from "../constants"');
  });

  test('should have validation for required fields', () => {
    const componentPath = path.join(__dirname, '../src/components/admin/ProductFormClient.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');
    
    // Should have validation logic for required fields
    expect(content).toContain('필수 필드');
    expect(content).toContain('!formData.title');
    expect(content).toContain('!formData.description');
    expect(content).toContain('!formData.price');
  });

  test('should preserve SKU generation logic', () => {
    const componentPath = path.join(__dirname, '../src/components/admin/ProductFormClient.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');
    
    // Should have SKU generation function
    expect(content).toContain('generateSKU');
    expect(content).toContain('substring(0, 3)');
    expect(content).toContain('Date.now()');
  });
});