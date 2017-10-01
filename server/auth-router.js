/**
 * Import dependencies
 */
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./db');
const validations = require('../src/shared/validations');

// Create authentication router
const router = express.Router();

// Parse request body stream as json
router.use(bodyParser.json());

/**
 * Handle login
 */
router.post('/login', (req, res) => {
  // Extract email and password from body
  const { email, password } = req.body.formData;

  // If variables are empty, there was no input submitted
  if (!email) {
    res.status(400).json({ error: { email: 'Please enter a valid Email address.' } });
  } else if (!password) {
    res.status(400).json({ error: { password: 'Please enter a valid Password' } });
  }
  // Fetch user from database using email
  db.getUserByEmail(email).then((response) => {
    // If response is empty, no user was found
    if (!response) {
      res.status(404).json({ error: { email: 'Email is not registered' } });
    }
    // Check submitted password with saved hash
    bcrypt.compare(password, response.password_digest, (err, isValid) => {
      if (isValid) {
        // TODO: Refactor secret into seperate config file
        const token = jwt.sign({
          email: response.email,
          id: response._id,
          name: response.name,
          role: response.role,
          username: response.username,
        }, 'secretsecretsecretsecret');
        res.json({ token });
      } else {
        res.status(400).json({ error: { password: 'Password is not valid' } });
      }
    });
  });
});

router.post('/signup', (req, res) => {
  // Validate input
  const { errors, isValid } = validations.validateSignupInput(req.body);

  if (isValid) {
    // Extract email, password and username from request body
    const { email, password, username } = req.body;
    // Fetch users with email from database
    const emailPromise = db.getUsersByEmail(email);
    // Fetch users with username from database
    const usernamePromise = db.getUsersByUsername(username.toLowerCase());

    // Wait for database requests to finish 
    Promise.all([emailPromise, usernamePromise]).then((responses) => {
      // Check if email and username are already in use
      if (responses[0].length > 0) {
        errors.email = 'Email is already in use';
      }
      if (responses[1].length > 0) {
        errors.username = 'Username is already in use';
      }
      if (responses[0].length > 0 || responses[1].length > 0) {
        res.status(400).json(errors);
      } else {
        // Hash password
        bcrypt.hash(password, 10, (err, hash) => {
          // Create user
          db.createUser(email, hash, username.toLowerCase()).then((response) => {
            if (response != null) {
              res.json({ success: true });
            } else {
              res.json({ success: false });
            }
          });
        });
      }
    });
  } else {
    res.status(400).json(errors);
  }
});

/**
 * Export
 */
module.exports = router;
