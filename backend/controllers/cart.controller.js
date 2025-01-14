import Product from "../models/product.model.js";

const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });
    // add quantity for each product
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });
    return res.json(cartItems);
  } catch (error) {
    console.log("Error in getCartProducts", error.message);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const addToCart = async (req, res) => {
  const { productId } = req.body;
  const user = req.user;
  try {
    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }

    await user.save();
    return res.status(200).json(user.cartItems);
  } catch (error) {
    console.log("Error in addToCart", error.message);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const removeAllFromCart = async (req, res) => {
  const { productId } = req.body;
  const user = req.user;
  try {
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    return res.status(200).json(user.cartItems);
  } catch (error) {
    console.log("Error in removeAllFromCart", error.message);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const updateQuantity = async (req, res) => {
  const { id: productId } = req.params;
  const { quantity } = req.body;
  const user = req.user;
  try {
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.json(user.cartItems);
      }
      existingItem.quantity = quantity;
      await user.save();
      return res.json(user.cartItems);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in updateQuantity", error.message);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export { addToCart, getCartProducts, removeAllFromCart, updateQuantity };
