declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      fullname: string;
      nickname: string;
      email: string;
      mobileno: string;
      gender: string;
      occupation: string | null;
      dob: string;
      profile: string;
      createdAt: Date;
      updatedAt: Date;
    };

    admin?: {
      id?: number | null;
      adminType: string;
      name: string;
      profile: string;
      email: string;
      password: string;
    };

    files?: { filename: string }[];
    images?: { Productimage: string }[];
  }
}
