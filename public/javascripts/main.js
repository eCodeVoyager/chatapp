const socket = io();

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

document.getElementById("uploadBtn").addEventListener("click", function () {
  document.getElementById("fileInput").click();
});

document.getElementById("fileInput").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const formData = new FormData();
    formData.append("avatar", file);

    fetch("/user/upload-avatar", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.avatar) {
          alert("File uploaded successfully!");
          socket.emit("avatarUpdated", data.avatar);
        } else {
          alert("File upload failed.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("File upload failed.");
      });
  }
});

socket.on("avatarUpdated", (avatar) => {
  document.getElementById("mainAvatar").src = avatar;
});
