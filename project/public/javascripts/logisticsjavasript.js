//Liujiacheng 2022110204
var create = document.querySelector("#create")
var senderID = document.querySelector("#senderID")
var recipientID = document.querySelector("#recipientID")

var update = document.querySelector("#update")
var updatediv = document.querySelector("#updatediv")
var msenderID = document.querySelector("#msenderID")
var mrecipientID = document.querySelector("#mrecipientID")

var vid;
var userID;

const token = localStorage.getItem('token');

var search = document.querySelector("#search")

var cancel = document.querySelector("#cancel")

var logout = document.querySelector("#logout");

if (token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(window.atob(base64));
  console.log(payload);

document.addEventListener('DOMContentLoaded', () => {
  const userInfoDisplay = document.getElementById('userInfo');
  if (payload && userInfoDisplay) {
    userID = payload.userID;
    userInfoDisplay.textContent = `Welcome, ${payload.username}! Your userID is: ${payload.userID}`;
      
  }
});
}

  function takeParcel(id){
      fetch(`/api/parcel/${id}`, { 
      method: "PUT",
      body:JSON.stringify({
        logisticsCompanyStaff: userID,
        status:"Delivering"
      }),
      headers:{
        "Content-Type":"application/json"
      }
          }).then(res=>res.json()).then(res=>{
            console.log(res)
          });
    window.location.reload();
        
  }


  
  function editStatus(parcelId) {

    fetch(`api/parcel/${parcelId}`).then(res=>res.json()).then(res=>{
      if (res[0].status!="Delivered" && res[0].status!="Confirmed Receipt" && res[0].status!="At Station"){
            const row = document.querySelector(`#row-${parcelId}`);
    const statusCell = row.querySelector('.status');
    const currentStatus = statusCell.textContent;

    const statusValue = currentStatus.split('delivering:')[1] || ''; 

    statusCell.innerHTML = `<input type='text' id='status-input-${parcelId}' value='${statusValue.trim()}' />`;

    const updateButton = row.querySelector('.update-logistics');
    updateButton.textContent = "Update";
    updateButton.onclick = () => updateStatus(parcelId, 'Delivering:');

    const cancelButton = row.querySelector('.mark-delivered');
    cancelButton.textContent = "Cancel";
    cancelButton.onclick = () => cancelEdit(parcelId, currentStatus);
      }else{
        alert("You can not update the status of delivered parcels!")
      }

  })
}

function updateStatus(parcelId, prefix) {
  const newStatusValue = document.querySelector(`#status-input-${parcelId}`).value;
  const formattedStatus = `${prefix}${newStatusValue}`;

  fetch(`/api/parcel/${parcelId}`, { 
      method: "PUT",
      body: JSON.stringify({ status: formattedStatus }),
      headers: { "Content-Type": "application/json" }
  }).then(res => res.json()).then(() => {
      window.location.reload(); 
  });
}

function cancelEdit(parcelId, oldStatus) {
    const row = document.querySelector(`#row-${parcelId}`);
    const statusCell = row.querySelector('.status');
    statusCell.textContent = oldStatus;

    const updateButton = row.querySelector('.update-logistics');
    updateButton.textContent = "Update Logistics";
    updateButton.onclick = () => editStatus(parcelId);

    const cancelButton = row.querySelector('.mark-delivered');
    cancelButton.textContent = "Mark as Delivered";
    cancelButton.onclick = () => finish(parcelId);
}


  

function finish(id){

    fetch(`/api/parcel/${id}`, { 
    method: "PUT",
    body:JSON.stringify({
      logisticsCompanyStaff: userID,
      status:"Delivered"
    }),
    headers:{
      "Content-Type":"application/json"
    }
        }).then(res=>res.json()).then(res=>{
          console.log(res)
        });
  window.location.reload();
      
}
  
    fetch("/api/parcel").then(res => res.json()).then(res => {
      console.log(res);
      var tbodySender = document.querySelector("#table3"); 
      var tbodyRecipient = document.querySelector("#table4");
      tbodySender.innerHTML = ''; 
      tbodyRecipient.innerHTML = ''; 
      res.forEach((item, index) => {
          if (item.status === 'Ordered') {
              tbodySender.innerHTML += `
                  <tr>
                      <td>${index + 1}</td>
                      <td>${item.trackingNumber}</td>
                      <td>${item.senderName}</td> 
                      <td>${item.recipientName}</td> 
                      <td>${item.logisticsCompanyStaffName}</td>
                      <td>${item.courierStationEmployeeName}</td>
                      <td>${item.status}</td>
                      <td>${item.pickUpZone}</td>
                      <td style="border:none"><button onclick="takeParcel('${item._id}')">Take Order</button></td>
                  </tr>
              `;
          }
          if (item.logisticsCompanyStaff === userID) {
            tbodyRecipient.innerHTML += `
                <tr id="row-${item._id}">
                    <td>${index + 1}</td>
                    <td>${item.trackingNumber}</td>
                    <td>${item.senderName}</td>
                    <td>${item.recipientName}</td>
                    <td>${item.logisticsCompanyStaffName}</td>
                    <td>${item.courierStationEmployeeName}</td>
                    <td class='status'>${item.status}</td>
                    <td>${item.pickUpZone}</td>
                    <td style="border:none"><button class='update-logistics' onclick="editStatus('${item._id}')">Update Logistics</button></td>
                    <td style="border:none"><button class='mark-delivered' onclick="finish('${item._id}')">Mark as Delivered</button></td>
                </tr>
            `;
        }
        
      });
  });
  


  logout.onclick = ()=>{
    location.href = "/";
  }