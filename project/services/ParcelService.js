
const ParcelModel = require("../model/ParcelModel")
const ParcelService = {
    updateParcel:(_id, sender, recipient, 
        logisticsCompanyStaff,courierStationEmployee,status,pickUpZone)=>{
        return ParcelModel.updateOne({_id},{
             sender, recipient, logisticsCompanyStaff, courierStationEmployee, status, pickUpZone
          })
    },

    deleteParcels:()=>{
        return ParcelModel.deleteMany({})
    }, 

    deleteParcelById:(_id)=>{
        return ParcelModel.deleteOne({
            _id:_id
          })
    },
    
    getParcel:async (page, limit) => {
    const parcels = await ParcelModel.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "sender",  
                foreignField: "userID",  
                as: "senderInfo" 
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "recipient",
                foreignField: "userID",
                as: "recipientInfo"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "recipient",
                foreignField: "userID",
                as: "recipientInfo"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "logisticsCompanyStaff",
                foreignField: "userID",
                as: "logisticsInfo"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "courierStationEmployee",
                foreignField: "userID",
                as: "courierInfo"
            }
        }
    ]);
    return parcels.map(parcel => {
        parcel.senderName = parcel.senderInfo[0] ? parcel.senderInfo[0].username : "---";
        parcel.recipientName = parcel.recipientInfo[0] ? parcel.recipientInfo[0].username : "---";
        parcel.logisticsCompanyStaffName = parcel.logisticsInfo[0] ? parcel.logisticsInfo[0].username : "---";
        parcel.courierStationEmployeeName = parcel.courierInfo[0] ? parcel.courierInfo[0].username : "---";
        delete parcel.senderInfo; 
        delete parcel.recipientInfo;
        delete parcel.logisticsInfo; 
        delete parcel.courierInfo;
        return parcel;
    });
},


    getParcelById: (_id) => {
        return ParcelModel.find({_id:_id})
    },
    
    getParcelByTrackingNumber: (substring) => {
        const search = new RegExp(substring, 'i');
        return ParcelModel.find({ TrackingNumber: { $regex: search } });
    },
    getLastParcelId: async () => {
        const result = await ParcelModel.findOne().sort({ parcelID: -1 });
        return result ? result.parcelID + 1 : 1; 
    },
    generateUniqueTrackingNumber: async () => {
        let isUnique = false;
        let trackingNumber;
        while (!isUnique) {
            trackingNumber = Math.floor(1000 + Math.random() * 9000); 
            const existingParcel = await ParcelModel.findOne({ trackingNumber: trackingNumber });
            if (!existingParcel) {
                isUnique = true;
            }
        }
        return trackingNumber;
    },
    addParcel: async (sender, recipient, logisticsCompanyStaff, courierStationEmployee, status, pickUpZone) => {
        const parcelID = await ParcelService.getLastParcelId();
        const trackingNumber = await ParcelService.generateUniqueTrackingNumber();
        return ParcelModel.create({
            parcelID, trackingNumber, sender, recipient, 
            logisticsCompanyStaff, courierStationEmployee, status, pickUpZone
        });
    },   
}


module.exports = ParcelService;