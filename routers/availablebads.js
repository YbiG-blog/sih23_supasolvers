const express = require("express");
const Hospital = require("../schemas/hospital");
const Bads = require("../schemas/bads");
const atob = require("atob");
const verify = require("../middleware/auth");
const router = new express.Router();

router.get("/totalnum/bads", async (req, res) => {
    try {
        const availableBads = await Bads.find({
            booking: false,
        }).countDocuments();

        console.log(availableBads);
        res.status(200).json({ availableBads });
        return;
    } catch (err) {
        res.sendStatus(500);
        return;
    }
});
router.get("/bads/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const findBad = await Bads.findById(id);
        const relatedHospital = await Hospital.findById(findBad.hospitalId);
        const name = relatedHospital.name;
        const email =  relatedHospital.email;
        const state = relatedHospital.state;
        const district = relatedHospital.district;
        const data = {findBad, name, email, state, district };
        res
            .status(200)
            .send(
                data
            );
        return;
    } catch (err) {
        res.status(400).send(`err ${err}`);
        return;
    }
});

// update bad
router.patch("/bads/:id", verify, async (req, res) => {
    try {
      const id = req.params.id;
      const isVerified = true;
      const token = req.body.cookie_token;
      const dec = token.split(".")[1];
      const decode = JSON.parse(atob(dec)); //contains hospitalid
    const findbad = await Bads.findById(id);
    console.log(decode._id);
     console.log(findbad.hospitalId);
      if(findbad.hospitalId == decode._id){
      const data = await Bads.findOneAndUpdate( {
        _id: id
      },{
        $set: req.body
      });
        res.status(200).send("Bad data Updated");
    }
    else{
        res.send("Ids mis match");
    }
  }catch (err) {
      res.status(400).send("err"+err);
    }
  });
  
  router.delete("/bads/:id", verify, async (req, res) => {
    try {
      const isVerified = true;
      const token = req.body.cookie_token;
      const dec = token.split(".")[1];
      const decode = JSON.parse(atob(dec)); //contains Userid
      console.log(dec);
  
      const id = req.params.id;
      const findbad = await Bads.findById(id);
    console.log(decode._id);
     console.log(findbad.hospitalId);
      if(findbad.hospitalId == decode._id){
      const data = await Bads.findByIdAndDelete({
        _id: id
      });
        res.status(200).send("Bad data deleted");
    }else{
    res.send("Ids mis match");   
    }
    } catch (err) {
      res.status(400).send(err);
    }
  });
  

router.get("/bads", async (req, res) => {
    try {
        const findBads = await Bads.find();
        //   console.log( findBads );
        res.status(200).send(findBads);
        return;
    } catch (err) {
        res.status(400).send(`err ${err}`);
        return;
    }
});

module.exports = router;