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

create.onclick = ()=>{
    console.log(senderID.value,recipientID.value);
    if (userID === senderID.value){
    fetch("/api/parcel",{
      method:"POST",
      body:JSON.stringify({
        sender:senderID.value,
        recipient:recipientID.value,
        logisticsCompanyStaff:"",
        courierStationEmployee:"",
        status:"Ordered",
        pickUpZone:""
      }),
      headers:{
        "Content-Type":"application/json"
      }
    }).then(res=>res.json()).then(res=>{
      console.log(res);
      window.location.reload();
    });
    }else{
      alert("You can only create orders as the sender.")
    }
  }


  function deleteParcel(id) {
    fetch(`api/parcel/${id}`).then(res=>res.json()).then(res=>{
      if (res[0].status =="Ordered"){
            fetch(`/api/parcel/${id}`, { 
      method: "DELETE"
    })
    .then(res => res.json())
    .then(res => {
      console.log(res);
    })
    .catch(error => {
      console.error("Error deleting parcel:", error);
    });
    window.location.reload();
      }else{
        alert("You can only cancel the orders that have not been dispatched yet!")
      }
    })
  }
  

  function modifyParcel(id) { 

    fetch(`api/parcel/${id}`).then(res=>res.json()).then(res=>{
      console.log(res)
      if (res[0].status==="Ordered"){
        document.getElementById("updatediv").style.display = "inherit";
    msenderID.value = res[0].sender;
    mrecipientID.value = res[0].recipient;
    vid = id; }else{
      alert("You can only modify the orders that have not been dispatched yet!")
    }
  })
  }

  update.onclick = ()=>{
    var id = vid;
    if (userID === msenderID.value){
      fetch(`/api/parcel/${id}`, { 
      method: "PUT",
      body:JSON.stringify({
        sender:msenderID.value,
        recipient:mrecipientID.value
      }),
      headers:{
        "Content-Type":"application/json"
      }
          }).then(res=>res.json()).then(res=>{
            console.log(res)
          });
          document.getElementById("updatediv").style.display = "none";
    window.location.reload();
        }else{alert("You can only create orders as the sender.")}}

    cancel.onclick = ()=>{
        document.getElementById("updatediv").style.display = "none";
      }

      function confirmReceipt(id) {
        fetch(`api/parcel/${id}`).then(res => res.json()).then(res => {
          if (res.length > 0 && res[0].status === "At Station") {
            fetch(`/api/parcel/${id}`, {
              method: "PUT",
              body: JSON.stringify({
                status: "Confirmed Receipt" 
              }),
              headers: {
                "Content-Type": "application/json"
              }
            }).then(response => response.json())
              .then(data => {
                console.log(data);
                alert("Receipt confirmed successfully!");
                window.location.reload();
              })
              .catch(error => {
                console.error('Error updating status:', error);
                alert("Failed to confirm receipt.");
              });
          } else {
            alert("You can only confirm the orders that have been delivered to Courier Station!");
          }
        }).catch(error => {
          console.error("Error fetching parcel:", error);
        });
      }
      
  

    fetch("/api/parcel").then(res => res.json()).then(res => {
      console.log(res);
      var tbodySender = document.querySelector("#table1"); 
      var tbodyRecipient = document.querySelector("#table2");
      tbodySender.innerHTML = ''; 
      tbodyRecipient.innerHTML = ''; 
      res.forEach((item, index) => {
          if (item.sender === userID) {
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
                      <td style="border:none"><button onclick="modifyParcel('${item._id}')">Modify Info</button></td>
                      <td style="border:none"><button onclick="deleteParcel('${item._id}')">Cancel Order</button></td>
                  </tr>
              `;
          }
          if (item.recipient === userID) {
              tbodyRecipient.innerHTML += `
                  <tr>
                      <td>${index + 1}</td>
                      <td>${item.trackingNumber}</td>
                      <td>${item.senderName}</td>
                      <td>${item.recipientName}</td>
                      <td>${item.logisticsCompanyStaffName}</td>
                      <td>${item.courierStationEmployeeName}</td>
                      <td>${item.status}</td>
                      <td>${item.pickUpZone}</td>
                      <td style="border:none"><button onclick="confirmReceipt('${item._id}')">Confirm Receipt</button></td>
                  </tr>
              `;
          }
      });
  });


  logout.onclick = ()=>{
    location.href = "/";
  }