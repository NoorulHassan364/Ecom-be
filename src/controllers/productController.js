const userModel = require("../models/user");
const productModel = require("../models/productModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
      success_url: `${process.env.SUCCESS_PAYMENT_URL}/products`,
      cancel_url: `${process.env.CANCEL_PAYMENT_URL}/cartIems`,
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
  console.log("splitRefId", splitRefId);
  //   let user = await UserModel.findOne({ email: session.customer_email });
  //   if (splitRefId[1] == "shop") {
  //     let shopId = splitRefId[0];
  //     let shop = await shopModel.findByIdAndUpdate(shopId);

  //     let date = new Date();

  //     let lastRec = await shopPayments
  //       .find({ user: user?._id, IsPayed: true })
  //       .sort({ payedDate: -1 });
  //     if (lastRec?.length == 0) {
  //       lastRec = 1;
  //     } else {
  //       lastRec = parseInt(lastRec[0]?.invoiceNo) + 1;
  //     }

  //     await shopPayments.create({
  //       paymentName:
  //         splitRefId[2] === "buy"
  //           ? `${shop?.name} (Bought)`
  //           : `${shop?.name} (20%)`,
  //       IsPayed: true,
  //       payedDate: date,
  //       amount:
  //         splitRefId[2] === "buy"
  //           ? shop?.price
  //           : Math.round((parseInt(shop?.price) / 100) * 20),
  //       dueDate: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
  //       user: user,
  //       shop: shop?._id,
  //       invoiceNo: lastRec,
  //     });

  //     // await UserModel.findByIdAndUpdate(user?._id, {
  //     //   $push: { purchases: shopId },
  //     // });
  //   }
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
      "whsec_315ArVDJNnJd3H6SEaZYyOIQovSV0Duw"
    );
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }
  if (event.type === "checkout.session.completed") {
    createCheckoutBooking(event.data.object);
  }
  res.status(200).json({ received: true });
};
