import { ShopifyProduct, ShopifyCart } from './types';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const SHOPIFY_GRAPHQL_URL = `https://${domain}/api/2024-01/graphql.json`;

async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<{ data: T; errors?: Array<{ message: string }> }> {
  const response = await fetch(SHOPIFY_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken || '',
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }

  return response.json();
}

// Get all products
export async function getAllProducts(): Promise<ShopifyProduct[]> {
  const query = `
    query GetAllProducts {
      products(first: 100, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            title
            handle
            description
            descriptionHtml
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  priceV2 {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const { data, errors } = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> };
  }>({ query });

  if (errors) {
    console.error('Shopify GraphQL errors:', errors);
    throw new Error('Failed to fetch products');
  }

  return data.products.edges.map((edge) => edge.node);
}

// Get a single product by handle
export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    query GetProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 25) {
          edges {
            node {
              id
              title
              availableForSale
              priceV2 {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `;

  const { data, errors } = await shopifyFetch<{
    productByHandle: ShopifyProduct | null;
  }>({ query, variables: { handle } });

  if (errors) {
    console.error('Shopify GraphQL errors:', errors);
    return null;
  }

  return data.productByHandle;
}

// Create a cart
export async function createCart(): Promise<ShopifyCart> {
  const query = `
    mutation CreateCart {
      cartCreate {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const { data, errors } = await shopifyFetch<{
    cartCreate: { cart: ShopifyCart };
  }>({ query });

  if (errors) {
    console.error('Shopify GraphQL errors:', errors);
    throw new Error('Failed to create cart');
  }

  return data.cartCreate.cart;
}

// Add item to cart
export async function addToCart(
  cartId: string,
  merchandiseId: string,
  quantity: number = 1
): Promise<ShopifyCart> {
  const query = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const { data, errors } = await shopifyFetch<{
    cartLinesAdd: { cart: ShopifyCart };
  }>({
    query,
    variables: {
      cartId,
      lines: [{ merchandiseId, quantity }],
    },
  });

  if (errors) {
    console.error('Shopify GraphQL errors:', errors);
    throw new Error('Failed to add item to cart');
  }

  return data.cartLinesAdd.cart;
}

// Get a page by handle
export async function getPageByHandle(handle: string) {
  const query = `
    query GetPage($handle: String!) {
      page(handle: $handle) {
        id
        title
        body
        bodySummary
        seo {
          title
          description
        }
      }
    }
  `;

  const { data, errors } = await shopifyFetch<{
    page: {
      id: string;
      title: string;
      body: string;
      bodySummary: string;
      seo: {
        title: string | null;
        description: string | null;
      };
    } | null;
  }>({ query, variables: { handle } });

  if (errors) {
    console.error('Shopify GraphQL errors when fetching page:', JSON.stringify(errors, null, 2));
    return null;
  }

  if (!data.page) {
    console.error(`Page with handle "${handle}" not found in Shopify`);
  }

  return data.page;
}

