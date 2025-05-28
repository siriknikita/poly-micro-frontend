import { describe, it, expect } from 'vitest';
import * as constants from '../../../../components/testing/constants';

describe('Testing Constants', () => {
  it('defines chat panel dimensions correctly', () => {
    // Check that panel dimensions are defined with proper types and values
    expect(constants.CHAT_PANEL.DEFAULT_WIDTH).toBeTypeOf('number');
    expect(constants.CHAT_PANEL.DEFAULT_WIDTH).toBeGreaterThan(0);

    expect(constants.CHAT_PANEL.MIN_WIDTH).toBeTypeOf('number');
    expect(constants.CHAT_PANEL.MIN_WIDTH).toBeGreaterThan(0);
    expect(constants.CHAT_PANEL.MIN_WIDTH).toBeLessThan(
      constants.CHAT_PANEL.DEFAULT_WIDTH,
    );

    expect(constants.CHAT_PANEL.MAX_WIDTH).toBeTypeOf('number');
    expect(constants.CHAT_PANEL.MAX_WIDTH).toBeGreaterThan(
      constants.CHAT_PANEL.DEFAULT_WIDTH,
    );
  });

  it('defines CSS classes correctly', () => {
    // Check CSS classes
    expect(constants.CSS_CLASSES.RESIZE_NO_SELECT).toBeTypeOf('string');
    expect(constants.CSS_CLASSES.RESIZE_NO_SELECT.length).toBeGreaterThan(0);

    // Check depth styles
    expect(constants.CSS_CLASSES.DEPTH_STYLES).toBeTypeOf('object');
    expect(
      Object.keys(constants.CSS_CLASSES.DEPTH_STYLES).length,
    ).toBeGreaterThan(0);
  });

  it('defines button variants correctly', () => {
    // Check button variants
    expect(constants.BUTTON_VARIANTS).toBeDefined();
    expect(Object.keys(constants.BUTTON_VARIANTS).length).toBeGreaterThan(0);

    // Ensure required variants exist
    expect(constants.BUTTON_VARIANTS.PRIMARY).toBeTypeOf('string');
    expect(constants.BUTTON_VARIANTS.OUTLINE).toBeTypeOf('string');
    expect(constants.BUTTON_VARIANTS.ACTIVE).toBeTypeOf('string');
  });

  it('defines test item types correctly', () => {
    // Check test item types
    expect(constants.TEST_ITEM_TYPES).toBeDefined();

    // Ensure required types exist
    expect(constants.TEST_ITEM_TYPES.MICROSERVICE).toBeTypeOf('string');
    expect(constants.TEST_ITEM_TYPES.FUNCTION).toBeTypeOf('string');
    expect(constants.TEST_ITEM_TYPES.TEST).toBeTypeOf('string');
  });

  it('defines default prompts correctly', () => {
    // Check default prompts
    expect(constants.DEFAULT_PROMPTS).toBeDefined();

    // Test generate test prompt function
    expect(constants.DEFAULT_PROMPTS.GENERATE_TEST).toBeTypeOf('function');

    const prompt = constants.DEFAULT_PROMPTS.GENERATE_TEST('authenticate');
    expect(prompt).toBeTypeOf('string');
    expect(prompt).toContain('authenticate');
  });
});
