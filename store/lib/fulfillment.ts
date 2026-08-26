/**
 * Auto-fulfillment system
 * When a customer orders on our store, this automatically places
 * the order on the supplier's website with the customer's shipping info
 */

import { Order } from './types';

export interface FulfillmentResult {
  success: boolean;
  message: string;
  orderConfirmation?: string;
  logs: string[];
}

export async function fulfillOrder(order: Order, supplierUrl: string): Promise<FulfillmentResult> {
  const logs: string[] = [];

  try {
    // Dynamic import of playwright to avoid issues at build time
    const { chromium } = await import('playwright');

    logs.push(`[${new Date().toISOString()}] Starting fulfillment for order ${order.order_number}`);
    logs.push(`[${new Date().toISOString()}] Supplier URL: ${supplierUrl}`);

    const browser = await chromium.launch({
      headless: true,
      executablePath: process.env.PLAYWRIGHT_BROWSERS_PATH
        ? `${process.env.PLAYWRIGHT_BROWSERS_PATH}/chromium`
        : undefined,
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    });

    const page = await context.newPage();

    logs.push(`[${new Date().toISOString()}] Browser launched, navigating to supplier...`);

    await page.goto(supplierUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    logs.push(`[${new Date().toISOString()}] Page loaded: ${page.url()}`);

    // Try to add to cart (common patterns)
    const addToCartSelectors = [
      '[data-testid="add-to-cart"]',
      '.add-to-cart',
      '#add-to-cart',
      'button:has-text("Add to cart")',
      'button:has-text("Ajouter au panier")',
      'button:has-text("Acheter")',
      '.btn-add-to-cart',
      '[class*="addToCart"]',
      '[class*="add_to_cart"]',
    ];

    let addedToCart = false;
    for (const selector of addToCartSelectors) {
      try {
        const btn = page.locator(selector).first();
        if (await btn.isVisible({ timeout: 2000 })) {
          await btn.click();
          addedToCart = true;
          logs.push(`[${new Date().toISOString()}] Added to cart using selector: ${selector}`);
          break;
        }
      } catch { /* continue */ }
    }

    if (!addedToCart) {
      logs.push(`[${new Date().toISOString()}] Could not find add-to-cart button, manual review needed`);
    }

    await page.waitForTimeout(2000);

    // Try to go to checkout
    const checkoutSelectors = [
      'a:has-text("Checkout")',
      'a:has-text("Passer commande")',
      'button:has-text("Checkout")',
      '[href*="checkout"]',
      '.checkout-btn',
    ];

    let wentToCheckout = false;
    for (const selector of checkoutSelectors) {
      try {
        const btn = page.locator(selector).first();
        if (await btn.isVisible({ timeout: 2000 })) {
          await btn.click();
          wentToCheckout = true;
          logs.push(`[${new Date().toISOString()}] Navigated to checkout`);
          break;
        }
      } catch { /* continue */ }
    }

    if (!wentToCheckout) {
      // Try direct checkout URL patterns
      const currentUrl = page.url();
      const baseUrl = new URL(currentUrl).origin;
      const checkoutUrls = [
        `${baseUrl}/checkout`,
        `${baseUrl}/cart`,
        `${baseUrl}/panier`,
      ];

      for (const url of checkoutUrls) {
        try {
          await page.goto(url, { timeout: 10000 });
          logs.push(`[${new Date().toISOString()}] Navigated directly to: ${url}`);
          break;
        } catch { /* continue */ }
      }
    }

    await page.waitForTimeout(2000);

    // Fill in customer shipping information
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    const [firstName, ...lastNameParts] = order.customer_name.split(' ');
    const lastName = lastNameParts.join(' ');

    const fieldMappings: Array<{ selectors: string[]; value: string }> = [
      {
        selectors: ['[name="first_name"]', '[name="firstname"]', '[id*="first"]', '[placeholder*="prénom" i]', '[placeholder*="first" i]'],
        value: firstName,
      },
      {
        selectors: ['[name="last_name"]', '[name="lastname"]', '[id*="last"]', '[placeholder*="nom" i]', '[placeholder*="last" i]'],
        value: lastName || firstName,
      },
      {
        selectors: ['[name="email"]', '[type="email"]', '[id*="email"]', '[placeholder*="email" i]'],
        value: order.customer_email,
      },
      {
        selectors: ['[name="phone"]', '[type="tel"]', '[id*="phone"]', '[placeholder*="téléphone" i]', '[placeholder*="phone" i]'],
        value: order.customer_phone || '',
      },
      {
        selectors: ['[name="address1"]', '[name="address"]', '[id*="address"]', '[placeholder*="adresse" i]', '[placeholder*="address" i]'],
        value: order.shipping_address,
      },
      {
        selectors: ['[name="city"]', '[id*="city"]', '[placeholder*="ville" i]', '[placeholder*="city" i]'],
        value: order.shipping_city,
      },
      {
        selectors: ['[name="zip"]', '[name="postal"]', '[id*="zip"]', '[id*="postal"]', '[placeholder*="code postal" i]'],
        value: order.shipping_postal,
      },
    ];

    let filledFields = 0;
    for (const { selectors, value } of fieldMappings) {
      if (!value) continue;
      for (const selector of selectors) {
        try {
          const field = page.locator(selector).first();
          if (await field.isVisible({ timeout: 1000 })) {
            await field.fill(value);
            filledFields++;
            logs.push(`[${new Date().toISOString()}] Filled field ${selector} with value`);
            break;
          }
        } catch { /* continue */ }
      }
    }

    logs.push(`[${new Date().toISOString()}] Filled ${filledFields}/${fieldMappings.length} fields`);

    // Take a screenshot for review
    const screenshotPath = `/tmp/fulfillment_${order.order_number}_${Date.now()}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    logs.push(`[${new Date().toISOString()}] Screenshot saved: ${screenshotPath}`);

    await browser.close();

    return {
      success: filledFields > 0,
      message: filledFields > 0
        ? `Fulfillment partially completed: ${filledFields} fields filled. Manual payment required.`
        : 'Could not fill shipping info automatically. Manual fulfillment required.',
      logs,
    };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logs.push(`[${new Date().toISOString()}] ERROR: ${errMsg}`);

    return {
      success: false,
      message: `Fulfillment failed: ${errMsg}`,
      logs,
    };
  }
}
