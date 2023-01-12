import { getBidsList } from '../../../services/bids.service';
import { Bids } from 'models';

const { transactionService } = require('../../../services');
const { Transaction } = require('../../../models');
const { getIdentityCheck } = require('../../../config/authentication');

function convertTransaction(transaction) {
  return {
    createdBy: transaction.createdBy,
    updatedBy: transaction.updatedBy,
    buyer: transaction.buyer,
    success: transaction.success,
    isBid: transaction.isBid,
    size: transaction.size,
    gst: transaction.gst,
    discount: transaction.discount,
    slug: transaction.slug,
    name: transaction.name,
    price: transaction.price,
    email: transaction.email,
    landmark: transaction.landmark,
    state: transaction.state,
    country: transaction.country,
    zip: transaction.zip,
    ...(transaction.razorpay_order_id && {
      razorpayOrderId: transaction.razorpay_order_id,
    }),
    ...(transaction.ordered_at && {
      orderedAt: transaction.ordered_at,
    }),
    ...(transaction.product_id && {
      productId: transaction.product_id,
    }),
    ...(transaction.last_name && {
      lastName: transaction.last_name,
    }),
    ...(transaction.first_name && {
      firstName: transaction.first_name,
    }),
    ...(transaction.phone_number && {
      phoneNumber: transaction.phone_number,
    }),
    ...(transaction.building_name && {
      buildingName: transaction.building_name,
    }),
    ...(transaction.house_flat_number && {
      houseFlatNumber: transaction.house_flat_number,
    }),
    ...(transaction.street_name && {
      streetName: transaction.street_name,
    }),
    ...(transaction.city_village && {
      cityVillage: transaction.city_village,
    }),
  };
}

function convertBids(bid) {
  return {
    createdBy: bid.createdBy,
    updatedBy: bid.updatedBy,
    slug: bid.slug,
    name: bid.name,
    price: bid.price,
    size: bid.size,
    buyer: bid.buyer,
    active: bid.active,
    accepted: bid.accepted,
    expiry: bid.expiry,
    seller: bid.seller,
    completed: bid.completed,
    ...(bid.order_id && {
      orderId: bid.order_id,
    }),
    ...(bid.seller_notified && {
      sellerNotified: bid.seller_notified,
    }),
    ...(bid.buyer_notified && {
      buyerNotified: bid.buyer_notified,
    }),
    ...(bid.payment_deadline && {
      paymentDeadline: bid.payment_deadline,
    }),
  };
}

const BidsQueries = {
  async transactionsByBuyer(_, { id }, context) {
    const user = await getIdentityCheck(context);
    const filter = {
      buyer: user.email,
    };
    const options = {};
    const result = await transactionService.getTransactionList(filter, options);
    return result.map((data) => convertTransaction(data));
  },

  async ordersByBuyer(_, args, context) {
    const user = await getIdentityCheck(context);
    const filter = {
      buyer: 'harshdeep0907@gmail.com',
      is_bid: false,
    };
    const options = {};
    const result = await Transaction.find(filter, options).sort({ ordered_at: -1 });
    return result.map((data) => convertTransaction(data));
  },

  async bidsByBuyer(_, { id }, context) {
    const user = await getIdentityCheck(context);

    await Bids.updateMany({ buyer: user.email, active: true, expiry: { $lte: new Date() } }, { $set: { active: false } });

    const result = await Bids.find({ buyer: user.email }).sort({ expiry: -1 });
    return result.map((data) => convertBids(data));
  },

  async bidsForSeller(_, { id }, context) {
    const seller = await getIdentityCheck(context);
    try {
      const products = await getSellerProducts(seller);
      const acceptedProducts = await getSellerAcceptedBids(seller);
      const productsNotAccepted = products.filter((product) => !acceptedProducts.includes(product));
      const bids = [];
      for (let i = 0; i < productsNotAccepted.length; i += 1) {
        const { slug, size } = productsNotAccepted[i];
        const filter = { slug, size, accepted: false, active: true, buyer: { $ne: seller } };
        const options = {};
        const newBids = await getBidsList(filter, options);
        bids.push(...newBids);
      }
      return bids.map((data) => convertBids(data));
    } catch (err) {
      throw new Error(`error: ${err.message} `);
    }
  },

  async acceptedBidsForSeller(_, { id }, context) {
    const seller = await getIdentityCheck(context);
    try {
      const filter = {
        seller: seller.email,
        accepted: true,
      };
      const options = {};
      const bids = await getBidsList(filter, options);
      return bids.map((data) => convertBids(data));
    } catch (err) {
      throw new Error(`error: ${err.message} `);
    }
  },

  async bidsByProduct(_, { slug }, context) {
    try {
      await updateManyBids({ active: true, expiry: { $lte: new Date() } }, { active: false });
      const bids = await getBidsList({ slug, active: true });
      bids.sort((p1, p2) => {
        if (p1.expiry > p2.expiry) {
          return -1;
        }
        if (p1.expiry < p2.expiry) {
          return 1;
        }
        return 0;
      });
      return bids.map((data) => convertBids(data));
    } catch (err) {
      throw new Error(`error: ${err.message} `);
    }
  },
};

module.exports = BidsQueries;
