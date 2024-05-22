document.getElementById("searchInput").addEventListener("input", function () {
  const query = this.value;
  fetch(`/user/search?q=${query}`)
    .then((response) => response.json())
    .then((data) => {
      const userList = document.getElementById("userList");
      userList.innerHTML = "";
      data.forEach((user) => {
        const userElement = document.createElement("li");
        userElement.className = "user";
        userElement.innerHTML = `
          <img src="${user.avatar}" alt="${user.name}">
          <div class="user-info">
            <span class="user-name">${user.name}</span>
            <span class="user-status">${user.status}</span>
          </div>
        `;
        userElement.addEventListener("click", () => {
          startChat(user);
        });
        userList.appendChild(userElement);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

document.getElementById("searchInput").addEventListener("blur", function () {
  setTimeout(() => {
    document.getElementById("userList").innerHTML = "";
  }, 200);
});

function startChat(user) {
  const chatHeaderName = document.querySelector(".chat-user-name");
  const chatAvatar = document.getElementById("chatAvatar");
  chatHeaderName.textContent = user.name;
  chatAvatar.src = user.avatar;
  chatAvatar.hidden = false;

  socket.emit("joinRoom", { username: user.name, room: "general" });

  socket.on("message", (message) => {
    outputMessage(message);
  });

  document.getElementById("sendMessageBtn").addEventListener("click", () => {
    const msg = document.querySelector(".chat-input input").value;
    socket.emit("chatMessage", msg);
    document.querySelector(".chat-input input").value = "";
  });
}

function outputMessage(message) {
  const chatBox = document.querySelector(".chat-box");
  const div = document.createElement("div");

  // Determine if the message is sent or received
  const messageClass = message.userId === 1 ? "sent" : "received";
  div.classList.add("chat-message", messageClass);

  div.innerHTML = `
    <span class="message">${message.text}</span>
    <span class="time">${message.time}</span>
  `;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
}
