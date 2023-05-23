const socket = io();

const welcome = document.getElementById("welcome");
const roomNameForm = document.getElementById("roomname");
const room = document.getElementById("room");
const nickNameForm = welcome.querySelector("#name");
const msgForm = room.querySelector("#msg");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function showRoomStatus(userCount) {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} : ${userCount}`;
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = msgForm.querySelector("input");
  const value = input.value;
  socket.emit("message", value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = nickNameForm.querySelector("input");
  socket.emit("nickname", input.value);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = roomNameForm.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

roomNameForm.addEventListener("submit", handleRoomSubmit);
nickNameForm.addEventListener("submit", handleNicknameSubmit);
socket.on("welcome", (newUser, newCount) => {
  showRoomStatus(newCount);
  addMessage(`${newUser} joined!`);
});

socket.on("bye", (leftUser, newCount) => {
  showRoomStatus(newCount);
  addMessage(`${leftUser} Left.. : (`);
});

socket.on("message", addMessage);

socket.on("room_count", showRoomStatus);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
