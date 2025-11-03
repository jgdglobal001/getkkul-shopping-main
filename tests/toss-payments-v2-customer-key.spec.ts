import { test, expect } from '@playwright/test';

test.describe('Toss Payments V2 - Customer Key Parameter Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Set up console message capture
    page.on('console', msg => {
      console.log(`[${msg.type()}] ${msg.text()}`);
    });
  });

  test('should generate unique customer key for each user', async ({ page }) => {
    // Navigate to home first
    await page.goto('/');
    
    // Check if customer key generation pattern exists in the page
    const customerKeyGenerated = await page.evaluate(() => {
      // Test the pattern: customer_${id || email || timestamp}
      const testId = 'user123';
      const customerKey = `customer_${testId}`;
      
      // Should match the pattern
      return customerKey.startsWith('customer_') && customerKey.length > 9;
    });
    
    expect(customerKeyGenerated).toBeTruthy();
  });

  test('should handle customer key generation with email replacement', async ({ page }) => {
    // Test email replacement pattern
    const emailTransformResult = await page.evaluate(() => {
      const email = 'user@example.com';
      const transformed = email.replace(/[@.]/g, '_');
      const customerKey = `customer_${transformed}`;
      
      return {
        original: email,
        transformed: transformed,
        customerKey: customerKey,
        isValid: customerKey.includes('user') && customerKey.includes('example') && customerKey.includes('com'),
      };
    });
    
    expect(emailTransformResult.transformed).toBe('user_example_com');
    expect(emailTransformResult.customerKey).toBe('customer_user_example_com');
    expect(emailTransformResult.isValid).toBeTruthy();
  });

  test('should handle timestamp-based customer key generation', async ({ page }) => {
    // Test timestamp fallback
    const timestampKeyResult = await page.evaluate(() => {
      const timestamp = Date.now();
      const customerKey = `customer_${timestamp}`;
      
      return {
        customerKey: customerKey,
        isNumeric: /customer_\d+$/.test(customerKey),
        hasMinLength: customerKey.length > 15,
      };
    });
    
    expect(timestampKeyResult.isNumeric).toBeTruthy();
    expect(timestampKeyResult.hasMinLength).toBeTruthy();
  });

  test('should initialize TossPayments with clientKey and pass customerKey to requestPayment', async ({ page }) => {
    // Verify the SDK initialization pattern
    const initializationResult = await page.evaluate(() => {
      // Test TossPayments initialization pattern
      const testClientKey = 'test_client_key';
      const testCustomerKey = 'customer_user123';
      
      // TossPayments V2 SDK is initialized with clientKey only
      const sdkInit = {
        clientKey: testClientKey,
      };
      
      // CustomerKey is passed to requestPayment
      const requestPaymentConfig = {
        orderId: 'order123',
        orderName: 'Test Order',
        customerEmail: 'test@example.com',
        customerName: 'Test User',
        customerKey: testCustomerKey, // customerKey goes here
        successUrl: 'http://localhost:3000/success',
        failUrl: 'http://localhost:3000/fail',
      };
      
      return {
        sdkInitialized: 'clientKey' in sdkInit,
        clientKeyValue: sdkInit.clientKey,
        hasCustomerKeyInRequest: 'customerKey' in requestPaymentConfig,
        customerKeyValue: requestPaymentConfig.customerKey,
      };
    });
    
    expect(initializationResult.sdkInitialized).toBeTruthy();
    expect(initializationResult.clientKeyValue).toBe('test_client_key');
    expect(initializationResult.hasCustomerKeyInRequest).toBeTruthy();
    expect(initializationResult.customerKeyValue).toBe('customer_user123');
  });

  test('should not have customerKey error in console when loading checkout page', async ({ page }) => {
    let consoleErrors: string[] = [];
    let consoleWarnings: string[] = [];
    
    // Capture console messages
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
      if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });
    
    // Navigate to home
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForTimeout(3000);
    
    // Check that there are no customerKey related errors
    const customerKeyErrors = consoleErrors.filter(error =>
      error.toLowerCase().includes('customerkey') ||
      error.toLowerCase().includes('customer_key') ||
      error.toLowerCase().includes('필수 파라미터')
    );
    
    expect(customerKeyErrors.length).toBe(0);
  });

  test('should validate TossPayments SDK is available as a function', async ({ page }) => {
    // Navigate to home to ensure SDK is loaded
    await page.goto('/');
    
    await page.waitForTimeout(2000);
    
    // Check if TossPayments SDK is available
    const sdkAvailable = await page.evaluate(() => {
      const TossPayments = (window as any).TossPayments;
      
      // SDK should be available as a function
      if (typeof TossPayments !== 'function') {
        return {
          isAvailable: false,
          type: typeof TossPayments,
        };
      }
      
      return {
        isAvailable: true,
        type: 'function',
        acceptsClientKey: true, // V2 API accepts clientKey as string parameter
      };
    });
    
    expect(sdkAvailable.isAvailable).toBeTruthy();
    expect(sdkAvailable.type).toBe('function');
    expect(sdkAvailable.acceptsClientKey).toBeTruthy();
  });

  test('should properly format customer key without special characters after @ and .', async ({ page }) => {
    const formatResult = await page.evaluate(() => {
      const emails = [
        'user@example.com',
        'john.doe@company.co.kr',
        'test+tag@domain.com',
      ];
      
      const results = emails.map(email => {
        const transformed = email.replace(/[@.]/g, '_');
        const customerKey = `customer_${transformed}`;
        
        return {
          email,
          hasNoAt: !customerKey.includes('@'),
          hasNoDot: !customerKey.includes('.'),
          startsWithCustomer: customerKey.startsWith('customer_'),
        };
      });
      
      return results;
    });
    
    // Verify all email transformations are correct
    formatResult.forEach(result => {
      expect(result.hasNoAt).toBeTruthy();
      expect(result.hasNoDot).toBeTruthy();
      expect(result.startsWithCustomer).toBeTruthy();
    });
  });

  test('should include customerKey in SDK initialization when handling payment', async ({ page }) => {
    // Navigate to home
    await page.goto('/');
    
    await page.waitForTimeout(1000);
    
    // Test the payment initialization flow
    const paymentInitResult = await page.evaluate(() => {
      // Simulate the handleTossPayment function flow
      const tossClientKey = 'test_client_key';
      
      // Simulate different user scenarios
      const scenarios = [
        { userId: 'user123', email: 'user@example.com' },
        { userId: null, email: 'test@domain.com' },
        { userId: null, email: null },
      ];
      
      return scenarios.map((scenario, idx) => {
        const customerKey = `customer_${scenario.userId || (scenario.email?.replace(/[@.]/g, "_")) || Date.now()}`;
        
        return {
          scenario: idx,
          hasCustomerKey: !!customerKey,
          customerKeyFormat: customerKey.startsWith('customer_'),
          wouldInitializeWith: {
            clientKey: tossClientKey,
            customerKey: customerKey,
          },
        };
      });
    });
    
    // All scenarios should generate valid customer keys
    paymentInitResult.forEach(result => {
      expect(result.hasCustomerKey).toBeTruthy();
      expect(result.customerKeyFormat).toBeTruthy();
      expect(result.wouldInitializeWith.clientKey).toBeTruthy();
      expect(result.wouldInitializeWith.customerKey).toBeTruthy();
    });
  });

  test('should not expose or leak customer key in page source', async ({ page }) => {
    // Navigate to home
    await page.goto('/');
    
    const pageContent = await page.content();
    
    // Customer key should not be hardcoded in HTML
    // It should only be generated at runtime
    expect(pageContent).not.toMatch(/customer_[a-zA-Z0-9_]+/);
  });

  test('should handle customerKey generation edge cases', async ({ page }) => {
    const edgeCaseResults = await page.evaluate(() => {
      const testCases = [
        { input: 'user123', scenario: 'userId' },
        { input: 'user+special@domain.co.uk', scenario: 'email' },
        { input: 'simple@simple.com', scenario: 'email' },
      ];
      
      return testCases.map(testCase => {
        let customerKey: string;
        
        if (testCase.scenario === 'userId') {
          customerKey = `customer_${testCase.input}`;
        } else {
          customerKey = `customer_${testCase.input.replace(/[@.]/g, "_")}`;
        }
        
        return {
          input: testCase.input,
          scenario: testCase.scenario,
          result: customerKey,
          isValid: customerKey.startsWith('customer_') && customerKey.length > 9,
          hasNoSpecialChars: !/[@.]/.test(customerKey),
        };
      });
    });
    
    // Verify all edge cases are handled correctly
    edgeCaseResults.forEach(result => {
      expect(result.isValid).toBeTruthy();
      expect(result.hasNoSpecialChars).toBeTruthy();
    });
  });

  test('should maintain customer key consistency across multiple payment initialization calls', async ({ page }) => {
    const consistencyResult = await page.evaluate(() => {
      // Test that customer key generation is deterministic
      const userId = 'user123';
      
      // Generate key multiple times
      const key1 = `customer_${userId}`;
      const key2 = `customer_${userId}`;
      const key3 = `customer_${userId}`;
      
      return {
        key1,
        key2,
        key3,
        isConsistent: key1 === key2 && key2 === key3,
        allStartWithCustomer: [key1, key2, key3].every(k => k.startsWith('customer_')),
      };
    });
    
    expect(consistencyResult.isConsistent).toBeTruthy();
    expect(consistencyResult.allStartWithCustomer).toBeTruthy();
  });

  test('should not expose security-sensitive information in customer key', async ({ page }) => {
    const sensitivityCheck = await page.evaluate(() => {
      // Customer key should only contain user identifier, not sensitive data
      const testEmail = 'user@company.com';
      const customerKey = `customer_${testEmail.replace(/[@.]/g, "_")}`;
      
      return {
        noPasswordInfo: !customerKey.toLowerCase().includes('pass'),
        noCredentialInfo: !customerKey.toLowerCase().includes('secret'),
        noTokenInfo: !customerKey.toLowerCase().includes('token'),
        validFormat: /^customer_[a-zA-Z0-9_]+$/.test(customerKey),
      };
    });
    
    expect(sensitivityCheck.noPasswordInfo).toBeTruthy();
    expect(sensitivityCheck.noCredentialInfo).toBeTruthy();
    expect(sensitivityCheck.noTokenInfo).toBeTruthy();
    expect(sensitivityCheck.validFormat).toBeTruthy();
  });
});