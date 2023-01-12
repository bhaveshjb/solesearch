import { Bids, Flakers } from 'models';
import { getIdentityCheck } from '../../../config/authentication';
import { transactionService } from '../../../services';
import { logger } from '../../../config/logger';

const BidMutation = {
  async acceptBid(_, { id }) {
    // const user = await getIdentityCheck(context);
    const bid = await Bids.findById(id);
    if (bid.seller) {
      return { error: true };
    }

    const deadline = new Date();
    deadline.setHours(deadline.getHours() + 20);
    deadline.setMinutes(deadline.getMinutes() + 30);
    await bid.updateOne({
      $set: {
        payment_deadline: deadline,
        seller: bid.seller,
        accepted: true,
      },
    });

    try {
      // todo : add after we get smtp credential.
      // await Bids.sendAcceptedBidEmail(bid);
      await bid.updateOne({ buyer_notified: true });
    } catch (error) {
      logger.info(`${error}`);
    }
    return { error: false };
  },

  async createOrder(args, context) {
    const user = await getIdentityCheck(context);
    args.buyer = user.email;
    const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    if (args.expiry) {
      delete args.expiry;
    }
    const transaction = await transactionService.createTransaction(args);
    if (args.is_bid) {
      try {
        const flaker = await Flakers.findOne({ email: args.buyer });
        if (flaker.restricted_until > Date.now()) {
          throw new Error('Flaker detected.');
        }
      } catch (error) {
        if (!(error instanceof 'DoesNotExist')) {
          throw error;
        }
      }
      try {
        const bid = await Bids.create({
          order_id: transaction.order_id,
          name: args.name,
          price: args.price,
          slug: args.slug,
          size: args.size,
          buyer: args.buyer,
          expiry,
        });
        // todo : add after we get smtp credential.
        // ProductModel.sendBidEmailToBidder(args);
        // ProductModel.sendBidEmail(args);
        Bids.updateOne({ id: bid._id }, { $set: { seller_notified: true } });
      } catch (error) {
        console.error(`Bid failed: ${error}, args=${args}`);
      }
    }
    return { error: false, order_id: transaction.order_id };
  },
};

module.exports = BidMutation;
