enum SubProducts {
  ORDERS= 1,
  COLOUR= 2,
  SIZE = 3,
  SUB_PRODUCT = 4,
  PRODUCT = 5,
  COUPONS = 6,
  USERS = 7,
  SHIPPER = 8 
}

const SubCategories: Record<string, number> = {
  'Lingerie': 1,
  'Footwear': 2,
  'Bindi': 3,
  'Home Essential': 8,
  'Cosmetics': 9
}

/**
 * Allow return for 
 * Footwear and Home Essential
 */
const AllowReturn = ['2','8'];

export {
  SubProducts,
  SubCategories,
  AllowReturn
}