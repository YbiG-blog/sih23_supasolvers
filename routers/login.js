const express = require("express");
const Patient = require("../schemas/patient");
const Hospital = require("../schemas/hospital");
const bcrypt = require("bcrypt");
const router = new express.Router();

// login route for patient
router.post("/loginpatient", async (req, res) => {
  try {
    const password = req.body.password;
    const email = req.body.email;

    const patientCheck = await Patient.findOne({ email: email });
    if (patientCheck) {
      const match_password = await bcrypt.compare(
        password,
        patientCheck.password
      );

      const cookie_token = await patientCheck.generateAuthToken();
      console.log(cookie_token);

      //add cookie
      res.cookie("jwt_shi23", cookie_token, {
        secure: true,
        expires: new Date(Date.now() + 864000000),
        httpOnly: false,
      });
    if (match_password) {
        res.status(200).send({
          message: "Patient logged in successfully",
          cookie_token: cookie_token,
        });
      } else {
        res.status(400).send({ msg: "Wrong Password" });
      }
    } else {
      res.status(400).send({ msg: "Invalid details" });
    }
  } catch (err) {
    console.log(err);
  }
});

// login route for hospital
router.post("/loginhospital", async (req, res) => {
    try {
      const password = req.body.password;
      const email = req.body.email;
  
      const hospitalCheck = await Hospital.findOne({ email: email });
      if ( hospitalCheck) {
        const match_password = await bcrypt.compare(
          password,
          hospitalCheck.password
        );
  
        const cookie_token = await  hospitalCheck.generateAuthToken();
        console.log(cookie_token);
  
        //add cookie
        res.cookie("jwt_shi23", cookie_token, {
          secure: true,
          expires: new Date(Date.now() + 864000000),
          httpOnly: false,
        });
      if (match_password) {
          res.status(200).send({
            message: " hospital logged in successfully",
            cookie_token: cookie_token,
          });
        } else {
          res.status(400).send({ msg: "Wrong Password" });
        }
      } else {
        res.status(400).send({ msg: "Invalid details" });
      }
    } catch (err) {
      console.log(err);
    }
  });
  
//logout router

router.post("/logout", async (req, res) => {});

module.exports = router;