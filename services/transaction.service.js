import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { Transaction } from 'models';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { logger } from '../config/logger';
import { getObjectByProductId } from './product.service';
import { sendEmail } from './email.service';

const razorpayClient = new Razorpay({
  key_id: 'YOUR_KEY_ID',
  key_secret: 'YOUR_KEY_SECRET',
});

export async function getTransactionById(id, options) {
  const transaction = await Transaction.findById(id, options);
  return transaction;
}

export async function getOne(query, options) {
  const transaction = await Transaction.findOne(query, options);
  return transaction;
}

export async function getTransactionList(filter, options) {
  const transaction = await Transaction.find(filter, options);
  return transaction;
}

export async function getTransactionListWithPagination(filter, options) {
  const transaction = await Transaction.paginate(filter, options);
  return transaction;
}

export async function updateTransaction(filter, body, options) {
  try {
    const transaction = Transaction.findOneAndUpdate(filter, body, options);
    return transaction;
  } catch (error) {
    logger.error('error in creating Transaction:', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are trying to create duplicate entry!');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  }
}

export async function createOrder(transaction) {
  const data = {
    amount: transaction.price * 100,
    currency: 'INR',
    receipt: transaction.id,
    notes: {
      buyer: transaction.buyer,
      size: transaction.size,
      slug: transaction.slug,
      phone: transaction.phone_number,
      name: `${transaction.first_name} ${transaction.last_name}`,
    },
  };
  const payment = await razorpayClient.orders.create(data);
  return payment;
}

export async function createTransaction(body) {
  try {
    // const transaction = Transaction.create(body);
    // return transaction;
    const order = await createOrder(body);
    body.razorpay_order_id = order.payment.id;
    await Transaction.create(body);
    logger.info(`Transaction created: ${order.payment.id}`);
    return { order_id: order.payment.id };
  } catch (error) {
    logger.error('error in creating Transaction:', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are trying to create duplicate entry!');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  }
}

async function verifyPayment(body) {
  const keySecret = 'YOUR_KEY_SECRET';
  const hmac = crypto.createHmac('sha256', keySecret);
  hmac.update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`);
  const generatedSignature = hmac.digest('hex');

  return body.razorpay_signature === generatedSignature;
}

export async function verifyTransaction(body) {
  const verifyPaymentSignature = await verifyPayment(body);
  if (verifyPaymentSignature) {
    const filter = { razorpay_order_id: body.razorpay_order_id };
    const order = await updateTransaction(filter, { success: true }, { new: true });
    // const emailBody = `Thank you for purchasing a product on SoleSearch.<br>We have succesfully recieved your payment and will now process your order.<br>
    //             <p>Product: {order.name}</p>
    //         <p>Size: {order.size}</p>
    //         <p>Price: {order.price}</p>`;
    // subject, body, button_text, button_link, receiver_mail, receiver_name="Customer"
    // todo: send_email_with_template('Order Summary', email_body, "View Order", f"{Config.BASE_URL}/seller/orders", order.buyer)

    const to = 'support@solesearchindia.zohodesk.in';
    const subject = 'Transaction/Order Ticket';
    const ticketBody = `1. Name: ${order.first_name} +${order.last_name}\n2. Email address: ${order.buyer}\n3. Phone number: ${order.phone_number}\n4. Razorpay Order Id: ${order.razorpay_order_id}\n6.Product ID: ${order.product_id}\n7. Product Name: ${order.name}\n8. Size: ${order.size}\n9. Discount: ${order.discount}\n10. Building Name: ${order.building_name}\n11. House Number: ${order.house_flat_number}\n12. Street Name: ${order.street_name}\n13. Landmark: ${order.landmark}\n14. City: ${order.city_village}\n15. State: ${order.state}\n16. Country: ${order.country}\n17. Zip Code: ${order.zip}`;
    await sendEmail({ to, subject, ticketBody });
    await getObjectByProductId(order.product_id);
    logger.info(`Transaction verified: ${order.razorpay_order_id}`);
    // todo: send order info to interakt
    return { product_id: order.product_id, error: false };
  }

  return { message: 'error in verifyTransaction', error: true };

  // if not verify verify_payment_signature : 'Payment Failed'
}

export async function updateManyTransaction(filter, body, options) {
  try {
    const transaction = await Transaction.updateMany(filter, body, options);
    return transaction;
  } catch (error) {
    logger.error('error in creating Transaction:', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are trying to create duplicate entry!');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  }
}

export async function removeTransaction(filter) {
  const transaction = await Transaction.findOneAndRemove(filter);
  return transaction;
}

export async function removeManyTransaction(filter) {
  const transaction = await Transaction.deleteMany(filter);
  return transaction;
}
export async function getRecentlySoldOrders() {
  const aggregate = [
    {
      $match: { success: true },
    },
    {
      $sort: { ordered_at: -1 },
    },
    {
      $limit: 50,
    },
    {
      $project: { slug: 1, name: 1 },
    },
  ];
  const soldProducts = await Transaction.aggregate(aggregate);
  return soldProducts;
}
