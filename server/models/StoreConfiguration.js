const mongoose = require("mongoose");
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const generalConfigSchema = {
  order_auto_accept: Boolean,
  order_auto_ready: Boolean,
  item_price_contains_tax: String,
  primary_color: String,
  secondary_color: String,
  is_inventory_count: Boolean,
  is_sms_notification: Boolean,
};

const posSettingSchema = {
  order_void_reason4_pos: String,
  order_void_reason3_pos: String,
  order_void_reason2_pos: String,
  order_void_reason1_pos: String,
  order_edit_reason4_pos: String,
  order_edit_reason3_pos: String,
  order_edit_reason2_pos: String,
  order_edit_reason1_pos: String,
  default_screen_to_display: String,
  idle_screen_postime: String,
  dining_preference_pos: String,
  idle_screen_pos: Boolean,
  screen_lock_pos: Boolean,
  auto_add_items_billing_screen_pos: Boolean,
  tip_option_pos: Boolean,
  tax_exempt_pos: Boolean,
  split_setting_pos: Boolean,
  dual_display_pos: Boolean,
  cash_drawer_pos: Boolean,
  denominator_amnount_pos: Array,
  no_of_orders_pos: String,
  default_order_type: String,
  default_payment_type: String,
  manager_override_pos: String,
  printer_label_pos: String,
  bill_printer_pos: Boolean,
  is_kot: Boolean,
  discount_level_pos: { type: Array },
};

const kioskSettingSchema = {
  order_void_reason4_kiosk: String,
  order_void_reason3_kiosk: String,
  order_void_reason2_kiosk: String,
  order_void_reason1_kiosk: String,
  order_edit_reason4_kiosk: String,
  order_edit_reason3_kiosk: String,
  order_edit_reason2_kiosk: String,
  order_edit_reason1_kiosk: String,
  dining_preference_kiosk: String,
  idle_screen_kiosktime: String,
  idle_screen_kiosk: Boolean,
  tip_option_kiosk: Boolean,
  printer_label_kiosk: Boolean,
  bill_printer_kiosk: Boolean,
  is_kot_kiosk: Boolean,
  allergies: String,
  manager_override_kiosk: String,
  whatsapp_receipt_kiosk: Boolean,
  discount_level_kiosk: { type: Array },
};

const storeConfigSchema = new mongoose.Schema(
  {
    general_config: generalConfigSchema,
    store_id: String,
    pos_setting: posSettingSchema,
    kiosk_setting: kioskSettingSchema,
  },
  { collection: "store_configuration", versionKey: false }
);

module.exports = mongoose.model("store_configuration", storeConfigSchema);
