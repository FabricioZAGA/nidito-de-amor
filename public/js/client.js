const socket = io('http://localhost:3000');


var status = 'on';
const lightBulbCard = () => {
  return (
    '<div class="d-flex justify-content-center">' +
    '<img id="imgLight" src = "img/closed.png" style="height:20rem"></div>' +
    '<h3 align=center>HAY ALGUIEN A <label id="lblDisntance"></label> CM </h3>' +
    '<h3 align=center id="lblTimer" class="my-3">ESTO ESTA CERRADO</h3>' +
    '<input type="hidden" class="form-control" placeholder="PASSWORD" aria-label="Password" id="inPassword">' +
    '<input type="text" class="form-control mb-5" placeholder="PASSWORD" aria- label="Password" id="inPasswordC">' +
    '<button onclick="lightbulbOnClick()" id="btnSwitch" class=" w-100 btn btn-primary">ABRIR PUERTA</Button>' +
    '</div>'
  );
};

socket.on('doorOpen', (data) => {
  document.getElementById('imgLight').src = 'img/open.png';
  lblTimer.innerHTML = `TIENES ${data} PARA PASAR :D`;
  if (data == '00:00:01') {
    var url = 'http://localhost:3000/api/1';
    fetch(url,
      {
        method: "POST",
      }).then((res) => {
        return res.json()
      }).then((data) => {
        console.log(data);
      }).catch((err) => {
        console.log("ERROR: " + err);
      })
  }
})

socket.on('doorClosed', () => {
  imgLight.src = "./img/closed.png";
  lblTimer.innerHTML = "YOU SHALL NOT PASS";
  inPassword.value = "";
  inPasswordC.value = "";
})


const wrongpassword = () => {
  lblTimer.innerHTML = "VETE DE AQUI LADRON";
  inPassword.value = "";
  inPasswordC.value = "";
}

const lightbulbOnClick = () => {

  if (inPassword.value === '1234' || inPasswordC.value === '1234') {

    var tiempo = {
      horas: 0,
      minutos: 0,
      segundos: 10

    }

    socket.emit("startTimer", tiempo)

    inPassword.value = ''; inPasswordC.value = '';
    if (status === 'on') {
      status = 'off';
      document.getElementById('imgLight').src = 'img/closed.png';
      //document.getElementById('btnSwitch').innerHTML = 'on'; 
    }
    else {
      status = 'on';
      document.getElementById('imgLight').src = 'img/open.png';
    }
    socket.emit('statusChange', status);
  }
  else {
    wrongpassword();
  }
};

socket.on("wrongpassword", () => {
  wrongpassword();
})

socket.on('serialData', (data) => {
  var aux = data;
  inPasswordC.value = aux;
});

socket.on('serialDataDistance', (data) => {
  lblDisntance.innerHTML = data;
})
const bodyString = '<div class="container-fluid"><div class="row row-cols-1 row-cols-md-4" ><div class="col">' + lightBulbCard() + '</div></div></div>';

document.body.innerHTML = document.body.innerHTML + bodyString;