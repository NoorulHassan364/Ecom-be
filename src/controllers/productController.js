//Importing the user model
const userModel = require("../models/user");
//Importing the productModel model
const productModel = require("../models/productModel");
//Importing the bookingModal model
const bookingModal = require("../models/bookingModal");
//Importing the stripe for payments
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// function will run when user will go to their history page
exports.getBookings = async (req, res) => {
  try {
    // finding user history and sending the frontend
    let bookings = await bookingModal
      .find({ user: req.params.id })
      .populate({ path: "prod" });
    res.status(201).json({
      status: "success",
      data: bookings,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};
// creating the stripe form and for the payment
exports.getCheckOutSession = async (req, res, next) => {
  try {
    // structuring all the products user added in the cart
    let url = "";
    let price = 0;
    let title = "";
    let items = req.body.items;

    for (let i = 0; i < items.length; i++) {
      title += `${items[i].name}(${items[i].quantity}) `;
      price += parseInt(items[i].price * items[i].quantity);
      url += `${items[i]._id}-${items[i].quantity}|`;
    }

    // let sPayment = await productModel.findById(req.params.paymentId);
    let user = await userModel.findById(req.params.userId);
    // stripe creating their checkout form
    const session = await stripe.checkout.sessions.create({
      // declaring payment method
      payment_method_types: ["card"],
      // declaring currency and total products prices
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(price) * 100,
            product_data: {
              name: title,
              // description: 'Comfortable cotton t-shirt',
              images: [],
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // after successfull paymnet stripe will redirect us to this url
      success_url: `${process.env.SUCCESS_PAYMENT_URL}/bookings`,
      // if we cancel the payment stripe will redirect to this url
      cancel_url: `${process.env.CANCEL_PAYMENT_URL}/products`,
      // customer email will show to the checkout form
      customer_email: user?.email,
      client_reference_id: url,
    });

    res.status(200).json({
      status: "success",
      session,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
    });
  }
};

// function will run when user will fill the checoout form and click on submit
const createCheckoutBooking = async (session) => {
  // we are getting the products with strip referec id that user added in their cart
  let splitRefId = session.client_reference_id.split("|");
  console.log("splitRefId.length-1", splitRefId[splitRefId.length - 1]);
  let user = await userModel.findOne({ email: session.customer_email });
  // in the following lines we are calculating the current week so that we can track the analytics ?
  var weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var d = new Date();
  var dayName = weekdays[d.getDay()];

  let currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  let startDate = new Date(currentDate.getFullYear(), 0, 1);
  let days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  let weekNumber = Math.ceil(days / 7);
  // creating user booking one by one with product
  for (let i = 0; i < splitRefId.length - 1; i++) {
    let sp = splitRefId[i].split("-");
    await bookingModal.create({
      prod: sp[0],
      quantity: sp[1],
      user: user?._id,
      addedDate: `${dayName}-${weekNumber}`,
    });
  }
};
// function will run when user will click procced to checkout button in the cart page
exports.webhookCheckout = (req, res, next) => {
  let event;
  try {
    // configuring stripe
    const signature = req.headers["stripe-signature"];
    console.log("signature", signature);
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      "whsec_DMVAkO2ZAmdrXzIdNP4pYxnQeYAsauTd"
    );
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }
  // creating and sending the checkout page to the fronted
  if (event.type === "checkout.session.completed") {
    createCheckoutBooking(event.data.object);
  }
  res.status(200).json({ received: true });
};
