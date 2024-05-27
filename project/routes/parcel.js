
var express = require('express');
const ParcelController = require('../controllers/ParcelController');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post("/parcel",ParcelController.addParcel)

router.put("/parcel/:id",ParcelController.updateParcel)

router.delete("/parcel",ParcelController.deleteParcels)

router.delete("/parcel/:id",ParcelController.deleteParcelById)

router.get("/parcel",ParcelController.getParcel)

router.get("/parcel/:id",ParcelController.getParcelById)

router.get("/parcel/name/:substring", ParcelController.getParcelByTrackingNumber);

module.exports = router;
