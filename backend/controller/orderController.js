import orderModel from '../models/orderModel.js';
import productModel from '../models/productModel.js';
import userModel from '../models/userModel.js';
import nodemailer from 'nodemailer';

export const createOrder = async (req, res) => {

  try {
    const { totalPrice, cart, address, userId, paymentStatus, quantity, paymentId } = req.body;

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
      }
    })

    let user = await userModel.findOne({ _id: userId });


    if (cart[0].productId) {
      let productIdandQauntity = [];
      if (cart.length >= 1) {
        let cartArr = cart.map((item) => {
          productIdandQauntity.push({ id: item.productId._id, quantity: item.quantity });
          return ({
            productId: item.productId._id,
            productName: item.productId.productName,
            productDesc: item.productId.productDesc,
            productPrice: item.productId.productPrice,
            productImagesurl: item.productId.productImagesurl[0],
            quantity: item.quantity
          });
        })

        // removing products from cart

        productIdandQauntity.forEach(async (item) => {
          user.cartData = user.cartData.filter(items => items.productId._id != item.id);
        })
        await user.save();

        // creating order 
        let newOrder = await orderModel.create({
          totalPrice,
          Products: cartArr,
          userId,
          paymentStatus,
          paymentId,
          address: {
            addressId: address._id,
            name: address.name,
            pincode: address.pincode,
            landmark: address.landmark,
            street: address.street,
            houseno: address.houseno,
            phoneno: address.phoneno
          }
        })


        // after ordering decrease the stock
        productIdandQauntity.forEach(async (item) => {
          let findProduct = await productModel.findOne({ _id: item.id });
          findProduct.stock = findProduct.stock - item.quantity;
          await findProduct.save();
        })

        // const emailBody = {
        //   from: process.env.AUTH_EMAIL,
        //   to: user.email,
        //   subject:'Order',
        //   html: `
        //   <h1>Order Confirmation</h1>
        //   <p>Hi ${address.name},</p>
        //   <p>Thank you for your order! Your order has been successfully placed with the following details:</p>
        //   <ul>
        //     ${cartArr.map(item => `
        //       <li>${item.productName} - Quantity: ${item.quantity}</li>
        //     `).join('')}
        //   </ul>
        //   <p><b>Total Price:</b> ₹${totalPrice}</p>
        //   <p>Status: <b>${paymentStatus}</b></p>
        //   <p>We will notify you once your order is shipped.</p>
        // `};

        const emailBody = {
          from: process.env.AUTH_EMAIL,
          to: user.email,
          subject: 'Order Confirmation',
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
              <h1 style="text-align: center; color: #4CAF50;">Order Confirmation</h1>
              <p style="font-size: 16px;">Hi <b>${address.name}</b>,</p>
              <p style="font-size: 16px;">Thank you for your order! Your order has been successfully placed with the following details:</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                  <tr style="background-color: #f9f9f9; text-align: left;">
                    <th style="padding: 10px; border: 1px solid #ddd;">Product Image</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Product Name</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  ${cartArr.map(item => `
                    <tr>
                      <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
                        <img src="${item.productImagesurl}" alt="${item.productName}" style="width: 100px; height: auto; border-radius: 4px;">
                      </td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${item.productName}</td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <p style="font-size: 16px; margin-top: 20px;"><b>Total Price:</b> ₹${totalPrice}</p>
              <p style="font-size: 16px;"><b>Status:</b> ${paymentStatus}</p>
              <p style="font-size: 16px;">We will notify you once your order is shipped.</p>
              <div style="text-align: center; margin-top: 20px;">
                <p style="font-size: 14px; color: #777;">Thank you for shopping with us!</p>
              </div>
            </div>
          `
        };

        transport.sendMail(emailBody);


        return res.json({ success: true, message: newOrder });
      }
    }

    else {
      let newCart = {
        productId: cart[0]._id,
        productName: cart[0].productName,
        productDec: cart[0].productDesc,
        productPrice: cart[0].productPrice,
        productImagesurl: cart[0].productImagesurl[0],
        quantity: quantity
      }

      let newOrder = await orderModel.create({
        totalPrice,
        Products: [newCart],
        userId,
        paymentStatus,
        paymentId,
        address: {
          addressId: address._id,
          name: address.name,
          pincode: address.pincode,
          landmark: address.landmark,
          street: address.street,
          houseno: address.houseno,
          phoneno: address.phoneno
        }
      });

      let findProduct = await productModel.findOne({ _id: cart[0]._id });
      findProduct.stock = findProduct.stock - quantity;
      await findProduct.save();

      const emailBody = {
        from: process.env.AUTH_EMAIL,
        to: user.email,
        subject: 'Order Confirmation',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
            <h1 style="text-align: center; color: #4CAF50;">Order Confirmation</h1>
            <p style="font-size: 16px;">Hi <b>${address.name}</b>,</p>
            <p style="font-size: 16px;">Thank you for your order! Your order has been successfully placed with the following details:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <thead>
                <tr style="background-color: #f9f9f9; text-align: left;">
                  <th style="padding: 10px; border: 1px solid #ddd;">Product Image</th>
                  <th style="padding: 10px; border: 1px solid #ddd;">Product Name</th>
                  <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
                    <img src="${newCart.productImagesurl}" alt="${newCart.productName}" style="width: 100px; height: auto; border-radius: 4px;">
                  </td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${newCart.productName}</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${newCart.quantity}</td>
                </tr>
              </tbody>
            </table>
            <p style="font-size: 16px; margin-top: 20px;"><b>Total Price:</b> ₹${totalPrice}</p>
            <p style="font-size: 16px;"><b>Status:</b> ${paymentStatus}</p>
            <p style="font-size: 16px;">We will notify you once your order is shipped.</p>
            <div style="text-align: center; margin-top: 20px;">
              <p style="font-size: 14px; color: #777;">Thank you for shopping with us!</p>
              <a href="#" style="text-decoration: none; color: #4CAF50;">Visit our store</a>
            </div>
          </div>`
      };

      transport.sendMail(emailBody);

      return res.json({ success: true, message: newOrder });
    }

  } catch (error) {
    return res.json({ success: false, msg: error.message });
  }
}


export const getOrders = async (req, res) => {
  try {
    let userId = req.user.id;
    let orders = await orderModel.find({ userId });
    return res.json({ msg: orders });
  }
  catch (er) {
    return res.json({ msg: er.message });
  }
}


export const checkOrder = async (req, res) => {
  try {
    let { productId } = req.body;
    let userId = req.user.id;

    if (!userId) return res.json({ success: false, message: "You Haven't logged in yet.." });

    const order = await orderModel.find({ userId }).select('Products');

    let checkOrder = order.some(item => item.Products.some(item => item.productId == productId));

    if (checkOrder == false) return res.json({ success: false, message: "You Haven't buy this product" });

    let product = await productModel.findOne({ _id: productId });
    let hasReviewd = product.reviews.some(item => item.userId == userId);

    return res.json({ success: true, hasReviewd: hasReviewd });
  }
  catch (er) {
    return res.json({ success: false, msg: er.message });
  }
}



// admin functions
export const allOrders = async (req, res) => {
  try {

    let allOrders = await orderModel.find({});
    return res.json({ success: true, orders: allOrders });

  }
  catch (er) {
    return res.json({ success: false, message: er.message });
  }
}

export const updateStatus = async (req, res) => {
  try {
    let { status, id } = req.body;
    let updateStatus = await orderModel.findOne({ _id: id });
    let userId = updateStatus.userId;
    updateStatus.orderStatus = status;
    await updateStatus.save();

    let user = await userModel.findOne({ _id: userId });

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
      }
    })

    const mail = {
      from: process.env.AUTH_EMAIL,
      to: user.email,
      subject: 'Order status changed',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #4CAF50;">Order Status Update</h2>
          <p>Dear ${user.name},</p>
          <p>We wanted to let you know that the status of your order with <strong>Order ID: ${id}</strong> has been updated to <strong>${status}</strong>.</p>
          <p>If you have any questions, feel free to contact our support team.</p>
          <p>Thank you for shopping with us!</p>
          <br>
          <p>Best regards,</p>
          <p><strong>Ecom</strong></p>
          <p style="font-size: 0.9em; color: #999;">This is an automated email. Please do not reply directly to this email.</p>
        </div>
      `,
    }

    transport.sendMail(mail);

    return res.json({ success: true, message: "Status updated" });
  } catch (er) {
    return res.json({ success: false, message: er.message });
  }
}