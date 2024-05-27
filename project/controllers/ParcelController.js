
const ParcelService = require("../services/ParcelService")


const ParcelController = {
  
  addParcel: async (req, res) => {
    const { sender, recipient, logisticsCompanyStaff, courierStationEmployee, status, pickUpZone } = req.body;
    try {
        await ParcelService.addParcel(sender, recipient, logisticsCompanyStaff, courierStationEmployee, status, pickUpZone);
        res.send({ ok: 1 });
    } catch (error) {
        res.status(500).send({ error: 'Error adding parcel', message: error.message });
    }
},


      updateParcel:async (req,res)=>{
        console.log(req.body,req.params.id)
        const { sender, recipient, logisticsCompanyStaff,courierStationEmployee,status,pickUpZone} = req.body
        await ParcelService.updateParcel(req.params.id, sender, recipient, 
          logisticsCompanyStaff,courierStationEmployee,status,pickUpZone)
        res.send({
            ok:1
          })
        
      },

      deleteParcels:async (req,res)=>{
        await ParcelService.deleteParcels()
        res.send({
          ok:1
        })
      },

      deleteParcelById:async (req,res)=>{

        await ParcelService.deleteParcelById(req.params.id)

        res.send({
            ok:1
          })
      },

      getParcel:async (req,res)=>{
        console.log(req.query)
        const {page,limit} = req.query
        const data = await ParcelService.getParcel(page,limit)      
        res.send(data);
      },

      getParcelById:async (req,res)=>{
        console.log(req.query)
        const data = await ParcelService.getParcelById(req.params.id)
        res.send(data);
      },
      
      getParcelByTrackingNumber: async (req, res) => {
        try {
            const substring = req.params.substring;
            const data = await ParcelService.getParcelByName(substring);
            res.send(data);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
      },

      getLastParcelId: async (req, res) => {
        try {
            const lastParcel = await Parcel.findOne().sort({ createdAt: -1 });
            const lastId = lastParcel ? lastParcel.id + 1 : 1; 
            res.json({ lastId });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching last parcel ID', error });
        }
      },

      
}

module.exports = ParcelController