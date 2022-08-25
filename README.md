# printing-node-module
Custom node module to support printing offline

Example of generating the print data is -

const { generatePrintData } = require('printing-module/printData');

generatePrintData(
  order_details = [{}],           // * order detail(s) list
  rest_details = {},              // * restaurant details
  type = 0,                       // * printing type out of counter only (0), receipt only (1), counter && receipt (2), counter, receipt && master order list (4), table change (6)
  itr = 1,                        // * iteration of order 
  kitchen_counter_details = {},   // kitchen counter details for items
  subcat_counters = {},           // subcategory kitchen counter details for items
  bill_details = {},              // bill details for provided orders
  counter_id = '',                // counter id for print (applicable only for type=0)  
);
