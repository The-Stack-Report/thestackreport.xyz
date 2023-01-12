export const accessCardsTeztokQuery = `query StackReportAccessTokens {
    tokens(where: {fa2_address: {_eq: "KT1LaCf37XyoR4eNCzMnw6Ccp5bfPFQrKYxe"}}) {
      artifact_uri
      artist_address
      description
      display_uri
      lowest_price_listing
      lowest_sales_price
      metadata_uri
      name
      objkt_artist_collection_id
      platform
      price
      symbol
      thumbnail_uri
      updated_at
      fa2_address
      token_id
    }
  }
  `