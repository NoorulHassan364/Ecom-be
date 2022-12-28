const userModel = require("../models/user");
const productModel = require("../models/productModel");
const bookingModal = require("../models/bookingModal");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getBookings = async (req, res) => {
  try {
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

exports.getCheckOutSession = async (req, res, next) => {
  try {
    console.log("req", req.body);
    let url = "";
    let price = 0;
    let title = "";
    let items = req.body.items;

    for (let i = 0; i < items.length; i++) {
      title += `${items[i].name}(${items[i].quantity}) `;
      price += parseInt(items[i].price * items[i].quantity);
      url += `${items[i]._id}-${items[i].quantity}|`;
    }
    console.log(url, "url");
    console.log(price, "price");
    console.log(title, "title");
    // let sPayment = await productModel.findById(req.params.paymentId);
    let user = await userModel.findById(req.params.userId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
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
      success_url: `${process.env.SUCCESS_PAYMENT_URL}/bookings`,
      cancel_url: `${process.env.CANCEL_PAYMENT_URL}/products`,
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

const createCheckoutBooking = async (session) => {
  let splitRefId = session.client_reference_id.split("|");
  console.log("splitRefId.length-1", splitRefId[splitRefId.length - 1]);
  let user = await userModel.findOne({ email: session.customer_email });
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

exports.webhookCheckout = (req, res, next) => {
  console.log("inside webhookCheckout", req.body);
  let event;
  try {
    const signature = req.headers["stripe-signature"];
    console.log("signature", signature);
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      "whsec_Wlh89FmIF3KbYvKn4X4Xew6DD5hABhNF"
    );
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }
  if (event.type === "checkout.session.completed") {
    createCheckoutBooking(event.data.object);
  }
  res.status(200).json({ received: true });
};
