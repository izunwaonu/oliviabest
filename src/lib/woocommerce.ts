import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

// Debugging log
console.log("🛠️ Loading WooCommerce API Credentials:");
console.log("🔹 WOOCOMMERCE_STORE_URL:", process.env.WOOCOMMERCE_STORE_URL);
console.log("🔹 WC_CONSUMER_KEY:", process.env.WC_CONSUMER_KEY ? "Loaded" : "Missing");
console.log("🔹 WC_CONSUMER_SECRET:", process.env.WC_CONSUMER_SECRET ? "Loaded" : "Missing");

// Use the correct variable names from .env
const WOOCOMMERCE_STORE_URL = process.env.WOOCOMMERCE_STORE_URL;
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

// Throw an error if any required environment variable is missing
if (!WOOCOMMERCE_STORE_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
  throw new Error("🚨 Missing WooCommerce API credentials in environment variables.");
}

// Initialize WooCommerce API
const WooCommerce = new WooCommerceRestApi({
  url: WOOCOMMERCE_STORE_URL,
  consumerKey: WC_CONSUMER_KEY,
  consumerSecret: WC_CONSUMER_SECRET,
  version: "wc/v3",
});

export default WooCommerce;
