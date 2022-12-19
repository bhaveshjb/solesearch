import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON } from 'models/plugins';

const ProductSchema = new mongoose.Schema(
  {
    /**
     * created By
     * */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    /**
     * updated By
     * */
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    /**
     * brand_name
     * */
    brand_name: {
      type: String,
    },
    /**
     * silhouette
     * */
    silhouette: {
      type: String,
    },
    /**
     * sku
     * */
    sku: {
      type: String,
    },
    /**
     * product details
     * */
    details: {
      type: String,
    },
    /**
     * color
     * */
    color: {
      type: String,
    },
    /**
     * release_year
     * */
    release_year: {
      type: String,
    },
    /**
     * story_html
     * */
    story_html: {
      type: String,
    },
    /**
     * name
     * */
    name: {
      type: String,
    },
    /**
     * nickname
     * */
    nickname: {
      type: String,
    },
    /**
     * size
     * */
    size: {
      type: String,
    },
    /**
     * price
     * */
    price: {
      type: Number,
    },
    /**
     * image_list
     * */
    image_list: {
      type: [String],
    },
    /**
     * product_type
     * */
    product_type: {
      type: String,
    },
    /**
     * main_picture_url
     * */
    main_picture_url: {
      type: String,
    },
    /**
     * slug
     * */
    slug: {
      type: String,
    },
    /**
     * product_id
     * */
    product_id: {
      type: String,
      unique: true,
    },
    /**
     * objectID
     * */
    objectID: {
      type: String,
      unique: true,
    },
    /**
     * gender
     * */
    gender: {
      type: [String],
    },
    /**
     * seller_email
     * */
    seller_email: {
      type: String,
    },
    product_listed_on_dryp: {
      type: Boolean,
      default: false,
    },
    customer_ordered: {
      type: Boolean,
      default: false,
    },
    /**
     * product_received_on_dryp
     * */
    product_received_on_dryp: {
      type: Boolean,
      default: false,
    },
    authenticity_check: {
      type: Boolean,
      default: false,
    },
    /**
     * product_shipped_to_customer
     * */
    product_shipped_to_customer: {
      type: Boolean,
      default: false,
    },
    /**
     * product_delivered
     * */
    product_delivered: {
      type: Boolean,
      default: false,
    },
    /**
     * reject_product
     * */
    reject_product: {
      type: Boolean,
      default: false,
    },
    /**
     * sold
     * */
    sold: {
      type: Boolean,
      default: false,
    },
    /**
     * inactive
     * */
    inactive: {
      type: Boolean,
      default: false,
    },
    /**
     * on_sale
     * */
    on_sale: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
ProductSchema.plugin(toJSON);
ProductSchema.plugin(mongoosePaginateV2);
const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);
module.exports = ProductModel;
