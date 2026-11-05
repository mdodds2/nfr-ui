import { describe, it, expect } from 'vitest';
import { findCategoryBySubCategoryId, findSubCategory, buildCartItems } from './report-cart.js';

describe('report-cart', () => {

  const categories = [
  {
    id: 1,
    name: 'test category 1',
    subCategories: [{
        id: 10,
        name: 'test subCategory'
    }]
  },
    {
        id: 2,
        name: 'test category 2',
        subCategories: [{
            id: 20,
            name: 'test subCategory'
        }]
    }
  ];

  const subCategories = [
    {
      id: 20,
      name: 'Performance'
    },
    {
      id: 21,
      name: 'Security'
    },
    {
      id: 22,
      name: 'Usability'
    }
  ];

  it('find category', () => {
    const cat = findCategoryBySubCategoryId(categories, 20);
    expect(cat.id).toBe(2);
  });

  it('category not found', () => {
    const cat = findCategoryBySubCategoryId(categories, 99);
    expect(cat).toBeUndefined();
  });

  it('find subCategory', () => {
    const subCat = findSubCategory(subCategories, 21);
    expect(subCat.id).toBe(21);
    expect(subCat.name).toBe('Security');
  });

  it('subCategory not found', () => {
    const subCat = findSubCategory(subCategories, 99);
    expect(subCat).toBe(null);
  });

  it('build cart items', () => {
    const report = {id: 1, name: 'report name', requirements: [{id: 100, subCategoryId: 20,name: 'requirement1'}], measurements: [{id: 200, name: 'measurement1', requirementId: 100, targetValue: '2s' }] };
    const cartItems = buildCartItems(report, categories);
    expect(cartItems[0].requirement.id).toBe(100);
    expect(cartItems[0].category.id).toBe(2);
    expect(cartItems[0].subCategory.id).toBe(20);
    expect(cartItems[0].id).toBe(200);
    expect(cartItems[0].targetValue).toBe('2s');
  });

  it('build cart items, subCategoryId not found', () => {
    const report = {id: 1, name: 'report name', requirements: [{id: 100, subCategoryId: 99,name: 'requirement1'}], measurements: [{id: 200, name: 'measurement1'}] };
    const cartItems = buildCartItems(report, categories);
    expect(cartItems[0].subCategory).toBeNull();
  });

  it('build cart items, requirements are missing', () => {
    const report = {id: 1, name: 'report name', measurements: [{id: 200, name: 'measurement1'}] };
    const cartItems = buildCartItems(report, categories);
    expect(cartItems).toHaveLength(0);
  });

  it('build cart items, measurements are missing', () => {
    const report = {id: 1, name: 'report name', requirements: [{id: 100, subCategoryId: 20,name: 'requirement1'}] };
    const cartItems = buildCartItems(report, categories);
    expect(cartItems).toHaveLength(0);
  });

});