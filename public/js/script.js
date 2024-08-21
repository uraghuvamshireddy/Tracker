const socket = io();
// console.log("hey")

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
    (position) => {
      const {latitude,longitude} = position.coords;
      socket.emit("send-location",{latitude,longitude});
    },
    (error)=>{
        console.log(error);
    },
    {
        enableHighAccuracy:true,
        maximumAge:0,
        timeout:1000

    }
);
}
const map=L.map("map").setView([0, 0], 15);
L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const markers={};
socket.on("receive-loaction",(data)=>{
    const {id,latitude,longitude}=data;
    console.log({latitude,longitude});
    map.setView([latitude,longitude],15);
    if(markers[id]){
        markers[id].setLatLong([latitude,longitude]);
    }
    else{
        markers[id]=L.marker([latitude,longitude]).addTo(map);
    }
});

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
