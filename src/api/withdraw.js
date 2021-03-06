const { Router } = require("express");
const Withdraw = require("../persistence/withdraw");
const User = require("../persistence/users");
const adminMiddleware = require("../middleware/admin-middleware");
const router = new Router();
const headerMiddleware = require("../middleware/header-middleware"); 
router.use(headerMiddleware);

router.get("", async (request, response) => {
  try {
    const withdraws = await Withdraw.list();
    return response.status(200).json(withdraws);
  } catch (error) {
    console.error(`Withdraw List >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

router.delete("/:withdrawId", adminMiddleware, async (request, response) => {
  const { withdrawId } = request.params;
  try {
    const withdraw = await Withdraw.delete(withdrawId);
    if (!withdraw) return response.status(404).json({message: "withdraw not exist"});
    return response.status(200).json(withdraw);
  } catch (error) {
    console.error(`Withdraw delete >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

router.get("/:withdrawId", async (request, response) => {
  const userIdRequester = request.userId;
  const is_admin = request.is_admin;

  const { withdrawId } = request.params;
  try {
    const withdraw = await Withdraw.findById(withdrawId);
    if (!withdraw) return response.status(404).json({message: "withdraw not exist"});
    else {
      if (!is_admin && userIdRequester !== withdraw.user_id)
        return response
          .status(403)
          .json({ message: "Can not get withdraw of others" });
    }
    return response.status(200).json(withdraw);
  } catch (error) {
    console.error(`Withdraw List >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

router.post("/:withdrawId/cancel", async (request, response) => {
  const userIdRequester = request.userId;
  const is_admin = request.is_admin;
  const { withdrawId } = request.params;
  try {
    const withdraw = await Withdraw.findById(withdrawId);
    if (!withdraw) return response.status(404).json({message: "Withdraw not exist"});
    else if (!is_admin && userIdRequester !== withdraw.user_id)
      return response
        .status(403)
        .json({ message: "Can not update withdraw of others" });
    if(withdraw.status !== "0") 
    return response
    .status(400)
    .json({ message: "This withdraw is processed, can not be processed anymore" });
    const user = await User.findById(withdraw.user_id); 
    const newUserBalance = parseInt(user.balance, 10) + parseInt(withdraw.amount, 10);
    const updateWd = await Withdraw.update(withdrawId, 2);
    const updateUs = await User.update({id: withdraw.user_id, balance: newUserBalance});
    if(!updateWd || !updateUs) return response.status(400).json({message: "Error in update withdraw or user"})
    return response.status(200).json(updateWd);
  } catch (error) {
    console.error(`Withdraw Cancel >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

router.post(
  "/:withdrawId/accept",
  adminMiddleware,
  async (request, response) => {
    const { withdrawId } = request.params;
    try {
      const withdraw = await Withdraw.update(withdrawId, 1);
      if (!withdraw) return response.status(404).json({message: "withdraw not exist"});
      return response.status(200).json(withdraw);
    } catch (error) {
      console.error(`Withdraw List >> Error: ${error.stack}`);
      response.status(500).json();
    }
  }
);

router.post("", async (request, response) => {
  const userId = request.userId;
  try {
    const { amount } = request.body;
    const wdAmount = parseInt(amount, 10);
    console.log("???? ~ file: withdraw.js ~ line 94 ~ router.post ~ wdAmount", wdAmount)
    if (!wdAmount)
      return response.status(400).json({ message: `Missing ${key}` });
    if (wdAmount < 10000)
      return response.status(400).json({
        message: `Withdraw amount too small, please try a bigger one`,
      });
    const user = await User.findById(userId);
    const userBalance = parseInt(user.balance, 10);
    if (userBalance < wdAmount)
      return response.status(400).json({
        message: `Insufficient funds, please consider withdraw with smaller amount`,
      });
    const newUserBalance = userBalance - wdAmount;
    const wd = await Withdraw.create( userId, 0, wdAmount );
    const us = await User.update({ id: userId, balance: newUserBalance });
    if (!wd || !us) {
      return response.status(400).json({ message: "Create withdraw error" });
    }

    return response.status(200).json(wd);
  } catch (error) {
    console.error(`Withdraw from user ${userId} >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

module.exports = router;
