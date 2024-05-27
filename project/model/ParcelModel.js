
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Parcel = {
    parcelID:String,
    trackingNumber:String,
    sender:String,
    recipient : String,
    logisticsCompanyStaff: String,
    courierStationEmployee: String,
    status:String,
    pickUpZone:String

}

const ParcelModel = mongoose.model("parcel",new Schema(Parcel),"parcel")
module.exports = ParcelModel