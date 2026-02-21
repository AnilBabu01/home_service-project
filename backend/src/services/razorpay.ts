import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export const createOrder = async (data: { amount: number; receiptId: string }) => {
    try {
        const options: any = {
            amount: data.amount * 100, // Amount in paise
            currency: 'INR',
            receipt: data.receiptId,
        };

        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        throw error;
    }
};
