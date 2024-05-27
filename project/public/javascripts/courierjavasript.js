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


  function loginParcel(parcelId) {
    const row = document.querySelector(`#row-${parcelId}`);
    const pickUpZoneCell = row.querySelector('.pickUpZone');
    const currentPickUpZone = pickUpZoneCell.textContent;

    pickUpZoneCell.innerHTML = `<input type='text' id='input-pickUpZone-${parcelId}' value='${currentPickUpZone}' />`;

    const loginButton = row.querySelector('.login-storage');
    loginButton.textContent = "Login";
    loginButton.onclick = () => updatePickUpZone(parcelId);

    const cancelButton = row.querySelector('.cancel-operation');
    cancelButton.onclick = () => cancelPickUpZoneEdit(parcelId, currentPickUpZone);
    cancelButton.style.display = 'inline-block';
}

function updatePickUpZone(parcelId) {
    const newPickUpZone = document.querySelector(`#input-pickUpZone-${parcelId}`).value;
    fetch(`/api/parcel/${parcelId}`, { 
        method: "PUT",
        body: JSON.stringify({ courierStationEmployee: userID, status:"At Station", pickUpZone: newPickUpZone }),
        headers: { "Content-Type": "application/json" }
    }).then(res => res.json()).then(() => {
        window.location.reload();
    });
}

function cancelPickUpZoneEdit(parcelId, oldPickUpZone) {
    const row = document.querySelector(`#row-${parcelId}`);
    const pickUpZoneCell = row.querySelector('.pickUpZone');
    pickUpZoneCell.textContent = oldPickUpZone;

    const loginButton = row.querySelector('.login-storage');
    loginButton.textContent = "Log in Storage";
    loginButton.onclick = () => loginParcel(parcelId);

    const cancelButton = row.querySelector('.cancel-operation');
    cancelButton.style.display = 'none';
}





function updateParcel(parcelId) {
  fetch(`api/parcel/${parcelId}`).then(res=>res.json()).then(res=>{
    if (res[0].status =="At Station"){
  const row = document.querySelector(`#row-${parcelId}`);
  const pickUpZoneCell = row.querySelector('.upickUpZone');
  const currentPickUpZone = pickUpZoneCell.textContent;

  pickUpZoneCell.innerHTML = `<input type='text' id='input-upickUpZone-${parcelId}' value='${currentPickUpZone}' />`;

  const updateButton = row.querySelector('.update-storage');
  updateButton.textContent = "Update";
  updateButton.onclick = () => uupdatePickUpZone(parcelId);

  const cancelButton = row.querySelector('.ucancel-operation');
  cancelButton.onclick = () => ucancelPickUpZoneEdit(parcelId, currentPickUpZone);
  cancelButton.style.display = 'inline-block';}else{
    alert("You can not update the status of comfirmed parcels!")
  }

})
  
}

function uupdatePickUpZone(parcelId) {
  const newPickUpZone = document.querySelector(`#input-upickUpZone-${parcelId}`).value;
  fetch(`/api/parcel/${parcelId}`, { 
      method: "PUT",
      body: JSON.stringify({ pickUpZone: newPickUpZone }),
      headers: { "Content-Type": "application/json" }
  }).then(res => res.json()).then(() => {
      window.location.reload();
  });
}

function ucancelPickUpZoneEdit(parcelId, oldPickUpZone) {
  const row = document.querySelector(`#row-${parcelId}`);
  const pickUpZoneCell = row.querySelector('.upickUpZone');
  pickUpZoneCell.textContent = oldPickUpZone;

  const updateButton = row.querySelector('.update-storage');
  updateButton.textContent = "Update Storage";
  updateButton.onclick = () => updateParcel(parcelId);

  const cancelButton = row.querySelector('.ucancel-operation');
  cancelButton.style.display = 'none';
}



    fetch("/api/parcel").then(res => res.json()).then(res => {
      console.log(res);
      var tbodySender = document.querySelector("#table5"); 
      var tbodyRecipient = document.querySelector("#table6");
      tbodySender.innerHTML = ''; 
      tbodyRecipient.innerHTML = ''; 
      res.forEach((item, index) => {
          if (item.status === 'Delivered') {
              tbodySender.innerHTML += `
              <tr id="row-${item._id}">
                      <td>${index + 1}</td>
                      <td>${item.trackingNumber}</td>
                      <td>${item.senderName}</td> 
                      <td>${item.recipientName}</td> 
                      <td>${item.logisticsCompanyStaffName}</td>
                      <td>${item.courierStationEmployeeName}</td>
                      <td>${item.status}</td>
                      <td class="pickUpZone">${item.pickUpZone}</td>
                      <td style="border:none"><button class="login-storage" onclick="loginParcel('${item._id}')">Log in Storage</button></td>
                      <td style="border:none;"><button class="cancel-operation" style="display:none">Cancel</button></td>
                  </tr>
              `;
          }
          if (item.status === 'At Station'||item.status === 'Confirmed Receipt') {
              tbodyRecipient.innerHTML += `
              <tr id="row-${item._id}">
                      <td>${index + 1}</td>
                      <td>${item.trackingNumber}</td>
                      <td>${item.senderName}</td>
                      <td>${item.recipientName}</td>
                      <td>${item.logisticsCompanyStaffName}</td>
                      <td>${item.courierStationEmployeeName}</td>
                      <td>${item.status}</td>
                      <td class="upickUpZone">${item.pickUpZone}</td>
                      <td style="border:none"><button class="update-storage" onclick="updateParcel('${item._id}')">Update Pickup Zones</button></td>
                      <td style="border:none;"><button class="ucancel-operation" style="display:none">Cancel</button></td>
                      </tr>
              `;
          }
      });
  });
  


  logout.onclick = ()=>{
    location.href = "/";
  }