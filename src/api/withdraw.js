const { Router } = require("express");
const Withdraw = require("../persistence/withdraw");

const router = new Router();

router.get("", async (request, response) => {
  try {
    const withdraws = await Withdraw.list();
    return response.status(200).json(withdraws);
  } catch (error) {
    console.error(`Withdraw List >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

router.get("", async (request, response) => {
  try {
    const withdraws = await Withdraw.list();
    return response.status(200).json(withdraws);
  } catch (error) {
    console.error(`Withdraw List >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

router.post("", async (request, response) => {
  const userId = request.userId;
  try {
    const { amount } = request.body;
    if(!amount)
      return response.status(400).json({ message: `Missing ${key}` });
    if(parseInt(amount, 10) < 10000)
      return response.status(400).json({ message: `Withdraw amount too small, please try a bigger one` });
    const wd = await Withdraw.create({userId, status: 0, amount});
    if (!wd) {
      return response.status(400).json({ message: "Create withdraw error" });
    }

    return response.status(200).json(wd);
  } catch (error) {
    console.error(`Withdraw from user ${userId} >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

module.exports = router;
