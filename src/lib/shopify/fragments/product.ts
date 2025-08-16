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
    deliveryAndReturns: metafield(namespace: "custom", key: "delivery_and_returns") {
    type
    value
    }
    productCardPhoto: metafield(namespace: "custom", key: "product_card_photo") {
      type
      value
            reference {                    # include this for file_reference image URLs
        ... on MediaImage {
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
    exploreTheRestImage: metafield(namespace: "custom", key: "explore_the_rest_image") {
    type
      value
            reference {                    # include this for file_reference image URLs
        ... on MediaImage {
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
    sizeChartImage: metafield(namespace: "custom", key: "size_chart_image") {
    type
      value
            reference {                    # include this for file_reference image URLs
        ... on MediaImage {
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
    productAdditionalPhotosAtBottom: metafield(namespace: "custom", key: "product_additional_photos_at_bottom") {
      type
      value
      references(first: 50) {
        edges {
          node {
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
    }
    lookBookPhotosUseAvril: metafield(namespace: "custom", key: "lookbook_photos_use_avril") {
      type
      value
      references(first: 50) {
        edges {
          node {
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
    # measurement values (JSON, cm)
    sizeChartValues: metafield(namespace: "custom", key: "size_chart_values") {
      type
      value
    }
  }
  ${imageFragment}
  ${seoFragment}
`;

export default productFragment;
