enum SubProducts {
  COLOUR= 1,
  SIZE = 2,
  SUB_PRODUCT = 3,
  PRODUCT = 4,
  COUPONS = 5,
  USERS = 6 
}

const SubCategories: Record<string, number> = {
  'Bindi': 1,
  'Footwear': 2,
  'HomeDecore': 3,
  'Handicraft': 4
}

export {
  SubProducts,
  SubCategories
}