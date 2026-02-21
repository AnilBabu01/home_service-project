// Auth types define here
export type LoginResponse = {
  status: boolean;
  token: string;
  msg: string;
  user: {
    id?: number | null;
    adminType: string;
    name: string;
    profile: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type ProfileResponse = {
  status: boolean;
  token: string;
  msg: string;
  user: {
    id?: number | null;
    adminType: string;
    name: string;
    profile: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
  };
};

// Service category types defines here

export type ServiceCategoryResponse = {
  status: boolean;
  token: string;
  msg: string;
  data: {
    id: number;
    name: string;
    icon: string;
    bgColor: string;
    block: boolean;
    inputType: string;
    numberings: any;
    createdAt: string;
    updatedAt: string;
  };
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
};

export type ServiceCategoryType = {
  id: number;
  name: string;
  icon: string;
  bgColor: string;
  block: boolean;
  inputType: string;
  numberings: any;
  createdAt: string;
  updatedAt: string;
};

export type InputType = {
  id?: string;
  keyName?: string;
  amount?: string;
  onDiscount?: string;
  value?: string;
};

// Service types defined here

export type ServiceResponse = {
  status: boolean;
  token: string;
  msg: string;
  data: {
    id: number;
    name: string;
    image: string;
    block: boolean;
    description: string;
    address: string;
    price: number;
    isOnDiscount: number;
    oldPrice: number;
    hoursPrice: number;
    category_id: number;
    provider_id: number;
    createdAt: string;
    updatedAt: string;
    category: {
      id: number;
      name: string;
      icon: string;
      bgColor: string;
      inputType: string;
      numberingKeys: string;
      block: boolean;
    };
    provider: {
      id: number;
      name: string;
      email: string;
      experience: string;
      profile: string;
      createdAt: string;
    };
    reviews: {
      id: number;
      rating: number;
      review: string;
      createdAt: string;
      user: {
        id: number;
        email: string;
        profile: string;
        fullname: string;
      };
      reviewLike: {
        id: number;
        islike: boolean;
        createdAt: string;
        user: {
          id: number;
          email: string;
          profile: string;
          fullname: string;
        };
      }[];
    }[];
    favourites: any[];
  };
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
};

export type ServiceType = {
  id: number;
  name: string;
  image: string;
  block: boolean;
  description: string;
  address: string;
  price: number;
  isOnDiscount: number;
  oldPrice: number;
  hoursPrice: number;
  category_id: number;
  provider_id: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
    icon: string;
    bgColor: string;
    inputType: string;
    numberingKeys: string;
    block: boolean;
  };
  provider: {
    id: number;
    name: string;
    email: string;
    experience: string;
    mobile_no?: string;
    profile: string;
    createdAt: string;
  };
  reviews: {
    id: number;
    rating: number;
    review: string;
    createdAt: string;
    user: {
      id: number;
      email: string;
      profile: string;
      fullname: string;
    };
    reviewLike: {
      id: number;
      islike: boolean;
      createdAt: string;
      user: {
        id: number;
        email: string;
        profile: string;
        fullname: string;
      };
    }[];
  }[];
  favourites: any[];
};

// notification

export type NotificationType = {
  status: boolean;
  msg: string;
  data: {
    id: number;
    message: string;
    type: string;
    updatedAt: string;
    createdAt: string;
  }[];
};

// Faq

export type FaqResponse = {
  status: boolean;
  msg: string;
  data: {
    id: number;
    question: string;
    block: boolean;
    answer: string;
    category_id: string;
    createdAt: string;
    updatedAt: string;
    faqCategory: {
      id: number;
      name: string;
      block: boolean;
    };
  };
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
};

export type FaqType = {
  id: number;
  question: string;
  block: boolean;
  category_id: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  faqCategory: {
    id: number;
    name: string;
    block: boolean;
  };
};

// Setting

export type SettingType = {
  id: number;
  privacyPolicy: string;
  whatsapp: string;
  customerServices: string;
  Website: string;
  advanceAmountPercentage: any;
  facebook: string;
  twitter: string;
  instagram: string;
  createdAt: string;
  updatedAt: string;
};

export type SettingResponse = {
  status: true;
  msg: string;
  data: SettingType[];
};

export type FaqCategoryType = {
  id: number;
  name: string;
  block: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FaqCategoryResponse = {
  status: true;
  msg: string;
  data: FaqCategoryType[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
};
