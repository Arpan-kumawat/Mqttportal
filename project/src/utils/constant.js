export const gridSpacing = 3;
export const drawerWidth = 250;

export const REPORT_URL = ''; //env.REPORT_URL;
export const SS_URL = ''; //env.SS_URL;


export const QRCODE_URL = 'https://webappqa.cyntra.ai/login'; 

//# Common Api for Status Update
export const STATUS_UPDATE = '/api/store/common-status/:service_name';

//# Integration
export const UPDATE_ONLINE_AVAILABILITY ='/api/integration/update-availability';

//# Urban Piper 
export const URBANPIPER_STORE_CREATE ='/api/urbanpiper/store-create-or-update';
export const URBANPIPER_CHANNEL_ACTION = '/api/urbanpiper/store-action';
export const URBANPIPER_CATALOG_PUBLISH ='/api/urbanpiper/catalogue-publish-through-api';
export const URBANPIPER_CATALOG_CATEGORY_TIMINGS ='/api/urbanpiper/catalogue-category-timings';

//# Channel
export const GET_CHANNEL_DETAILS = '/api/store/get-channel-details';
export const SAVE_CHANNEL_DETAILS = '/api/store/save-channel-details';


//# Membership
export const SAVE_MEMBERSHIP = '/api/customer/save-membership-plan';
export const GET_MEMBERSHIP = '/api/customer/get-membership-plan';


//# Auth
export const AUTH_USER = '/api/auth/login';
export const UPDATE_PWD = '/api/auth/update-password';
export const LOGOUT_SESSION = '/api/auth/logout';

//# Transaction
export const GET_TENDER_LIST = '/api/transaction/tenders';
export const CREATE_TENDER = '/api/transaction/add-tender';
export const CREATE_ORDER = '/api/transaction/add-order-type';
export const GET_ORDER_LIST = '/api/transaction/order-type';
export const UPDATE_ORDER_TYPE_STATUS = '/api/transaction/update-order-type-status';
export const UPDATE_TENDER_TYPE_STATUS = '/api/transaction/update-tender-type-status';


//# Clover API
export const GET_API_DETAILS = '/get-api-details';
export const GET_API_CLOVER = '/integration-api/:service_name';

//# Token API
export const CREATE_TOKEN = '/api/auth/save-token';
export const GET_TOKEN = '/api/auth/get-token';
export const DELETE_TOKEN = '/api/auth/delete-token';

//# Store
export const ADD_PAYMENT_GATEWAY = '/api/store/save-gateway';
export const GET_PAYMENT_GATEWAY = '/api/store/get-gateway';
export const GET_TERMINAL_LIST = '/api/store/terminal';
export const CREATE_TERMINAL = '/api/store/add-terminal';
export const SAVE_CHARGES = "/api/store/save-charges";
export const GET_CHARGES = "/api/store/get-charges";
export const CREATE_STORE = '/api/store/save';
export const SAVE_USER = '/api/employee/save-user';

export const CREATE_STORE_CONFIG = '/api/store/save-config';
export const CREATE_INVENTORY_RAW_MATERIAL = '/api/inventory/create-raw-material';
export const UPLOAD_PURCHASE_INVENTORY = "/api/inventory/upload-purchase-inventory";
export const ADD_SUPPLIER = "/api/inventory/add-supplier";
export const GET_SUPPLIER = "/api/inventory/get-supplier";
export const GET_RECIPE = "/api/inventory/get-recipe";
export const CREATE_RECIPE = "/api/inventory/create-recipe";
export const GET_PURCHASE = "/api/inventory/get-purchase";
export const GET_PURCHASE_REQUESTS = "/api/inventory/purchase-requests";
export const CREATE_PURCHASE = "/api/inventory/create-purchase";
export const GET_INVENTORY_RAW_MATERIAL = "/api/inventory/get-raw-material";
export const GET_TRANSFER_INVENTORY = "/api/inventory/transfer-inventory";
export const GE_RAW_MATERIAL_CATEGORY = "/api/inventory/raw-material-category";
export const GE_CURRENT_STOCK = "/api/inventory/current-stock";
export const UPDATE_AVAILABILITY_ON_DEVICES = "/api/inventory/update-availability-on-devices";

export const GET_STORE_CONFIG = "/api/store/config";
export const GET_STORE_LIST = "/api/store/list";
export const GET_STORE_LIST_DROPDOWN = "/api/store/dropdown";
export const GET_STORE_DETAILS = "/api/store/details";
export const UPDATE_STORE_STATUS = "/api/store/update-status";
export const UPDATE_COUPON_STATUS = "/api/store/update-coupon-status";
export const GET_COUPON_DETAILS = "/api/store/get-all-coupon-details";
export const SET_COUPON_DETAILS = "/api/store/create-coupon";
export const GET_COUPON = "api/store/get-coupon";
export const STORE_DAY_OFF = "/api/store/sod-eod";
export const STORE_DAY_STATUS = "/api/store/status";
export const POST_BANNERS = "/api/store/upload-banner-details";
export const POST_POS_MEDIA = "/api/store/add-pos-media";
export const GET_POS_MEDIA = "/api/store/get-pos-media";
export const POST_STICKERS = "/api/store/upload-sticker-details";
export const POST_FRAMES = "/api/store/upload-frame-details";
export const GET_BANNERS = "/api/store/get-banner-details";
export const GET_STIKCERS_AND_FRAMES = "/api/store/get-sticker-frame-details";
export const GET_ADD_ON_LIST = "/api/store/items-addon-list";
export const GET_SUBSCRIPTION_LIST = "/api/store/subscription-plan";
export const ASSOCIATED_STORE = "/api/store/associated-store";
export const POST_BREEZ_VIDEO = "/api/store/upload-video";
export const GET_BREEZ_VIDEO = "/api/store/get-video";
export const DELETE_IMAGES = "/api/store/delete-images";

//# Discount
export const SAVE_DISCOUNT = '/api/discount/save-discount';
export const DISCOUNT_LIST = '/api/discount/discount-list';
export const GET_DISCOUNT_DETAILS = '/api/discount/discount-details';
export const OFFER_PRODUCT_LIST = '/api/discount/offer-product-list'; 
export const REMOVE_OFFER_PRODUCT = '/api/discount/remove-offer-term-product';
export const UPDATE_DISCOUNT_STATUS = '/api/discount/update-discount-status';

//# Employee
export const CREATE_ROLE = '/api/employee/add-role';
export const CREATE_EMP = '/api/employee/save';
export const GET_EMP_LIST = '/api/employee/list';
export const GET_ROLE_LIST = '/api/employee/role-list';
export const GET_CASHIER_COLLECTION = '/api/employee/cashier-collection';
export const UPDATE_CASHIER_COLLECTION = '/api/employee/update-cashier-collection';
export const CREATE_POSITION = '/api/employee/add-position';
export const GET_STOCK = '/api/report/current-stock';
export const GET_POSITION_LIST = '/api/employee/position-list';
export const GET_POSITION_DROPDOWN = '/api/employee/position-dropdown';
export const GET_POSITION_ACCESS = '/api/employee/get-position-access'
// export const CREATE_EMP = "/api/employee/save";
// export const GET_EMP_LIST = "/api/employee/list";

//# ITEM LIST
export const Download_Item_Price = '/api/inventory/download-item-plu';
export const COPY_ITEM_PLU = '/api/inventory/copy-item-plu';
export const SAVE_ITEM_PLU = '/api/inventory/save-item-plu';
export const SAVE_CHANNEL_PLU = '/api/inventory/save-channel-plu';
export const Export_Item = '/api/inventory/export-items';
export const GET_ALL_ITEMS = '/api/inventory/all-item';
export const GET_ALL_ADDON = '/api/inventory/items-addon-list';
export const GET_CATEGORY = '/api/inventory/catagory';
export const GET_CATEGORY_DAY_SLOT = '/api/inventory/catagory-day-slot';
export const SAVE_NUTRITION = '/api/inventory/save-item-nutrition';
export const GET_NUTRITION = '/api/inventory/get-item-nutrition';
export const SAVE_CATEGORY_DAY_SLOT = '/api/inventory/save-catagory-slot';
export const GET_ITEM_LABEL = '/api/inventory/all-item-label';
export const GET_MODIFIER_GROUP = '/api/inventory/modifier-group';
export const ACTIVE_CASHIER = '/api/employee/active-cashier';
export const SAVE_ITEMS = '/api/inventory/save-item';
export const UPLOAD_ITEMS_PLU = '/api/inventory/upload-item-plu';
export const UPLOAD_ITEMS = '/api/inventory/upload-items';
export const SAVE_CATEGORY = '/api/inventory/save-category';
export const SAVE_MODIFIER = '/api/inventory/save-modifier-group';
export const UPDATE_ITEM_STATUS = '/api/inventory/update-item-status';
export const UPDATE_MODIFIER_STATUS = '/api/inventory/update-modifier-status';
export const UPDATE_CATEGORY_STATUS = '/api/inventory/update-category-status';
export const GET_TAX = '/api/inventory/tax-list';
export const SAVE_TAX = '/api/inventory/save-tax';
export const GET_UNIT = '/api/inventory/get-unit';
export const SAVE_UNIT = '/api/inventory/create-unit';
export const VARIANT_LIST = '/api/inventory/get-item-variants';
export const VARIANT_LIST2 = '/api/inventory/variant-list';
export const ADD_ADDON = '/api/inventory/save-add-ons';
export const SAVE_ITEM_LABEL = '/api/inventory/save-item-label';
export const UPDATE_ADDON = '/api/inventory/update-add-on-group-status';
export const SAVE_PRINTER_LABEL = '/api/inventory/save-printer-label';
export const PRINTER_LABEL = '/api/inventory/printer-label';
export const NOTIFY_CATALOG_UPDATES = '/api/notification/catalog-updates';
export const TAX_IGNORE_UPDATES = '/api/inventory/update-tax-ignore';
export const REMOVE_ITEM_IMAGE = '/api/inventory/remove-items-image';
export const SAVE_INVENTORY_TRANSFER = '/api/inventory/save-inventory-transfer';

//# Report
export const GET_DAILY_SALES = '/api/report/dailly-sale';
export const GET_ORDERWISE_SALE = '/api/report/order-wise-sale';

export const GET_DASHBOARD_REPORT = '/api/report/dashboard-report';
export const GET_DASHBOARD_DAYWISE = '/api/report/days-wise';
export const GET_TOP_BOTTOM_ITEM_REPORT = '/api/report/top-bottom-item-report';
export const GET_EMPLOYEE_WISE_SALES = '/api/report/employee-wise-sale';



export const GET_CUSTOMER_SALE = '/api/report/customer-report';
export const GET_PAYMENT_TYPE_SALE = '/api/report/payment-type-wise';
export const GET_PRODUCT_SALE = '/api/report/pmix-report';
export const GET_TENDER_SALES = '/api/report/tender-wise-sale';
export const GET_ORDER_TYPE_SALES = '/api/report/order-type-wise';
export const GET_HOURLY_SALES = '/api/report/get-hourly-sale';

export const GET_HOURLY_SKU = '/api/report/hourly-sale-with-sku';
export const GET_VOID_SALES = '/api/get-void-sale';
export const GET_INBOUND_SALES = '/api/report/inbound-data';
export const GET_OUTBOND_SALES = '/api/report/outbound-sale';
export const SET_DEAL_AVAILABILITY = REPORT_URL + 'v2/setDealAvailability';
export const GET_PRINT_REPORT = REPORT_URL + 'v2/getPrintReport';
export const GET_DISCOUNT_SALE = REPORT_URL + 'v2/get_discount_sale';
export const GET_BARCODE_REPORT = REPORT_URL + 'v2/getBarCodeReport';
export const GET_CATEGORY_SALE = REPORT_URL + 'v2/get_category_sale';
export const GET_SUB_CATEGORY_SALE = REPORT_URL + 'v2/get_sub_category_sale';
// export const GET_DAILY_SALES = REPORT_URL + "v2/getDaillySales";
// export const GET_ORDERWISE_SALE = REPORT_URL + "v2/getOrderWiseSales";
export const GET_MASTERCATEGORY_SALE = REPORT_URL + 'v2/getMasterCategorySales';
export const GET_MIS_REPORT = REPORT_URL + 'v2/getMisReport';
export const GET_STAFF_SALE_REPORT = REPORT_URL + 'v2/getStaffSaleReport';
export const GET_PROMOTIONS_SALES = REPORT_URL + 'v2/get_promotions_sale';
export const GET_STORE_SALES = REPORT_URL + 'v2/getStoreSales';
// export const GET_HOURLY_SALES = REPORT_URL + "v2/get_hourly_sale";
export const GET_ITEMS_SALES = REPORT_URL + 'v2/get_items_sale';
export const GET_WEEK_AND_WEEKEND_SALES = REPORT_URL + 'v2/getWeekANDWeekendSale';
export const GET_CAT_ITEMS_SALES = REPORT_URL + 'v2/get_cat_items_sale';
export const GET_BEST_SELLERS = REPORT_URL + 'v2/get_bast_sellers';
export const GET_DAY_PART_SALES = REPORT_URL + 'v2/get_day_part_sale';
// export const GET_VOID_SALES = REPORT_URL + "v2/get_void";
export const GET_CASHIER_SALES = REPORT_URL + 'v2/get_cashier_sale_details';
export const GET_DEVICE_SALES = REPORT_URL + 'v2/get_device_sale_details';
export const GET_AUDIT_TRAIL = REPORT_URL + 'v2/getAuditTrailData';
export const EXCEPTION_REPORT = REPORT_URL + 'v2/get_exception_report';
export const ACTIVE_DEVICE = REPORT_URL + 'v2/getActiveDevice';
export const FEEDBACK_URL = SS_URL + 'api/send-feedback';

//### DIGITAL SIGNAGE
export const GET_DS_MEDIA = '/api/digital-signage/get-ds-details';
export const UPSERT_BANNERS_XIBO = '/api/digital-signage/upload-banners';
export const UPLOAD_DS_DATA = '/api/digital-signage/post-ds-details';
export const UPDATE_DS_STATUS = '/api/digital-signage/update-ds-status';
export const UPDATE_DATASET_XIBO = '/api/digital-signage/upload-dataset';
export const GET_LAYOUTS = '/api/digital-signage/get-layouts';

 
export const GET_SIGNA_DATA = "/api/signa/get-signa-data";
export const CREATE_SIGNA_DATA = "/api/signa/upload-signage-data"
export const UPDATE_SIGNA_DATA = "/api/signa/update-metadata";
export const DELETE_SIGNA_DATA = "/api/signa/delete-signa"
export const GENERATE_LICENSE = "/api/signa/generate-license"
export const UPDATE_ACCESS = "/api/signa/upsert-access"
export const USER_ACCESS = "/api/signa/get-signa-access"
export const UPDATE_LICENSE = "/api/signa/update-data"

//#TABLE DINE IN 

export const CREATE_UPDATE_FLOOR = "/api/store/restaurant-table/create-update";
export const GET_ALL_FLOORS = "/api/restaurant-table/get-all-floors"
export const UPDATE_TABLE_STATUS = "/api/restaurant-table/update-table-status"
export const MAKE_RESERVATION = "/api/restaurant-table/make-reservation";
export const NOTIFY_TABLE_CLICK = "/api/restaurant-table/send-event";

 

//### VALUE CONSTANTS
export const Constant = {
	currencySign: '$',
	storeName: 'CYNTRA STORE',
	storeCode: '114',
	HomeBtn: 'Dashboard',
	OrderStatus: {
		accept: 1,
		ready: 2,
		readyTopay: 3,
		cancel: 4,
		paid: 5,
		refund: 6,
	},
	OrderType: {
		dine: 0,
		takeaway: 1,
		delivery: 2,
		pickup: 3,
	},
	PaymentMode: {
		Cash: 1,
		Card: 2,
		online: 3,
	},
	OrderTypeEnum: {
		Self_Pickup: 'SELF',
		At_Table: 'TABLE',
	},
	IntegrtaionEnum: {
		UrbanPiper: 'UrbanPiper',
		Cyntra: "Cyntra"
	},
	ChannelUsEnum : {
		Ubereats: "Ubereats",
		doordash: "doordash",
	},
	ChannelIndiaEnum : {
		ZOMATO: "zomato",
		SWIGGY: "swiggy",
	},
	TableStateEnum : {
		VACANT : {key :"vacant" , tablecolor : "#4CAF50"},
		OCCUPIED : {key : "occupied" , tablecolor : "#F44336"},
		RESERVED : {key : "reserved" , tablecolor : "#FFC107"}
	}

};