const io = require('socket.io')();
var SerialPort = require('serialport');
var ReadLine = SerialPort.parsers.Readline;
var parser = new ReadLine();
var auxPwd = '';
var status = 'off';
var serial_interface = "COM3";

var Timer = require("easytimer.js").Timer;

var timer_ = new Timer();

var port = new SerialPort(serial_interface, {
  baudRate: 9600
});
port.on('open', (err) => {
  if (err) {
    console.log('ERROR', err);
  }
  else {
    console.log('ARDUINO CONNECTED');
    port.pipe(parser);
  }
});

io.sockets.on('connection', (socket) => {
  console.log(`id CONNECTED: ${socket.id}`);
  socket.on("startTimer", function (data) {
    console.log("iniciar timer ", data);
    timer_.start({
      countdown: true,
      startValues: {
        hours: Number(data.horas),
        minutes: Number(data.minutos),
        seconds: Number(data.segundos)
      }
    })
  })
  socket.emit('updateStatus', status);
  socket.on('statusChange', (data) => {
    status = data;
    port.write(status, (err) => {
      if (err) {
        console.log('ERROR', err);
      }
      else {
        console.log('SUCCESS SENDING STATUS: ', status);
      }
    });
  });
});

parser.on('data', (serialData) => {
  if (serialData == 'ok') {
    console.log(auxPwd)
    if (auxPwd == '1234') {
      if (status === 'on') {
        status = 'off';
      }
      else {
        timer_.start({
          countdown: true,
          startValues: {
            hours: Number(0),
            minutes: Number(0),
            seconds: Number(10)
          }
        })
        status = 'on';
      }
      port.write(status, (err) => {
        if (err) {

          console.log('ERROR SENDING INFO', err);
        }
        else {
          io.sockets.emit('updateStatus', status);
        }
      });
    } else {
      console.log('WRONG PASSWORD');
      io.sockets.emit("wrongpassword");
    }
  }
  else {
    if (serialData.substring(0, 4) != 'sens') {
      console.log(serialData);
      auxPwd = serialData;
      io.sockets.emit('serialData', auxPwd);
    } else {
      console.log(serialData);
      io.sockets.emit('serialDataDistance', serialData.substring(4));
    }
  }
});


timer_.addEventListener('secondsUpdated', function () {
  console.log(timer_.getTimeValues().toString())
  var tiempo = timer_.getTimeValues().toString()

  io.sockets.emit('doorOpen', tiempo)
})

timer_.addEventListener('targetAchieved', function () {
  port.write("off", function (err) {
    if (err)
      console.log("ERROR", err)
  })
  console.log("FINISHED")
  io.sockets.emit('doorClosed')
})



module.exports = io;