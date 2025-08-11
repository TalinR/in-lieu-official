import imageFragment from './image';
import seoFragment from './seo';

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt

    # NEW: per-product content
    careInstructions: metafield(namespace: "custom", key: "care_instructions") {
      type
      value
    }
    longDescription: metafield(namespace: "custom", key: "long_description") {
      type
      value
    }
    sizeChart: metafield(namespace: "custom", key: "size_chart") {
      type
      value
      reference {
        # If you use a Metaobject-backed chart:
        ... on Metaobject {
          type
          fields {
            key
            type
            value
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                  width
                  height
                }
              }
              ... on GenericFile {
                url
              }
            }
          }
        }
        # If you use a File reference directly on the product:
        ... on MediaImage {
          image {
            url
            altText
            width
            height
          }
        }
        ... on GenericFile {
          url
        }
      }
    }
  }
  ${imageFragment}
  ${seoFragment}
`;

export default productFragment;
