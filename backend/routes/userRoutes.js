const express = require("express");
const User = require("../models/userModel");
const Joi = require("joi");

const router = express.Router();

// Define a schema for input validation using Joi
const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  age: Joi.number().required(),
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users); // Send JSON response directly
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/users/create", async (req, res) => {
  const { name, email, age } = req.body;

  // Validate user input against the defined schema
  const { error } = userSchema.validate(
    { name, email, age },
    { abortEarly: false }
  );

  if (error) {
    const validationErrors = {};
    error.details.forEach((errorDetail) => {
      validationErrors[errorDetail.context.key] = errorDetail.message;
    });

    return res.status(400).json({ errors: validationErrors });
  }

  try {
    const userData = await User.create({
      name: name,
      email: email,
      age: age,
    });
    res.status(201).json(userData);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

router.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    res.json(user); // Send JSON response directly
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedUser); // Send JSON response directly
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
