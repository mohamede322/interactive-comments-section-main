let api = "data.json";
let container = document.querySelector(".container");

getUsers();
async function getUsers() {
  let res = await fetch(api);
  let data = await res.json();
  let users = data.comments;
  users.forEach((user) => {
    let comment = user.content;
    let date = user.createdAt;
    let score = user.score;
    let imgSrc = user.user.image.png;
    let username = user.user.username;
    appendComments("comment", comment, date, score, imgSrc, username);
    appendReplies();

    function appendReplies() {
      if (user.replies !== "") {
        let replies = user.replies;
        replies.forEach((reply) => {
          let repContent = reply.content;
          let repDate = reply.createdAt;
          let repTo = reply.replyingTo;
          let repScore = reply.score;
          let repImgSrc = reply.user.image.png;
          let repUsername = reply.user.username;
          appendComments(
            "reply",
            repContent,
            repDate,
            repScore,
            repImgSrc,
            repUsername,
            repTo
          );
        });
      }
    }
  });

  function appendComments(section, comment, date, score, imgSrc, username, to) {
    let commentContainer = document.createElement("div");
    commentContainer.className = `${section}-container`;
    let counter = document.createElement("div");
    counter.className = "counter";
    let content = document.createElement("div");
    content.className = "content";

    let addBtn = document.createElement("button");
    let count = document.createElement("p");
    let removeBtn = document.createElement("button");

    addBtn.className = "count-btn";
    addBtn.id = "add";
    addBtn.innerHTML = "+";
    count.innerHTML = +score;
    removeBtn.className = "count-btn";
    removeBtn.id = "remove";
    removeBtn.innerHTML = "-";

    counter.append(addBtn, count, removeBtn);

    let info = document.createElement("div");
    info.className = "info";
    let Comment = document.createElement("div");
    Comment.className = "comment";
    let commentTextarea = document.createElement("textarea");
    commentTextarea.id = "comment";
    commentTextarea.setAttribute("readonly", "");
    let commentP = document.createElement("p");
    commentP.id = "comment";
    commentP.setAttribute("readonly", "");

    let personInfo = document.createElement("div");
    personInfo.className = "person-info";
    let image = document.createElement("div");
    image.className = "image";
    let userName = document.createElement("div");
    userName.className = "name";
    let commentDate = document.createElement("div");
    commentDate.className = "date";
    let replyBtnContainer = document.createElement("div");
    replyBtnContainer.className = "reply-btn";

    let img = document.createElement("img");
    img.src = imgSrc;
    image.append(img);

    userName.append(username);

    commentDate.innerHTML = `<p>${date}</p>`;
    personInfo.append(image, userName, commentDate);

    let replyBtn = document.createElement("button");
    replyBtn.id = "reply-btn";
    replyBtn.innerHTML = `<i class = "fas fa-reply"></i> Reply`;

    replyBtnContainer.append(replyBtn);

    info.append(personInfo, replyBtnContainer);
    let towards = document.createElement("span");
    towards.innerHTML = `@${to}`;
    towards.style.cssText =
      "font-weight:bold; color:#4f4da0; margin-right:10px;";
    commentTextarea.append(comment);
    commentP.append(to ? towards : "", comment);
    Comment.append(commentP);

    if (username === data.currentUser.username) {
      commentContainer.className = `currentUser-${section}`;
      replyBtnContainer.remove();
      let youSpan = document.createElement("span");
      youSpan.innerHTML = "you";
      youSpan.className = "you";
      userName.append(youSpan);
      let btnS = document.createElement("div");
      btnS.className = "btns";
      let deleteBtnContainer = document.createElement("div");
      deleteBtnContainer.className = "delete-btn";
      let editBtnContainer = document.createElement("div");
      editBtnContainer.className = "edit-btn";
      let deleteBtn = document.createElement("button");
      deleteBtn.id = "delete-btn";
      deleteBtn.innerHTML = `<i class="fas fa-trash"></i> Delete`;
      let editBtn = document.createElement("button");
      editBtn.innerHTML = `<i class="fas fa-edit"></i> Edit`;
      editBtn.id = "edit-btn";
      deleteBtnContainer.append(deleteBtn);
      editBtnContainer.append(editBtn);
      btnS.append(deleteBtnContainer, editBtnContainer);
      info.append(btnS);

      BtnS();

      function BtnS() {
        editBtn.addEventListener("click", () => {
          if (editBtn.innerHTML === `<i class="fas fa-edit"></i> Edit`) {
            commentTextarea.removeAttribute("readonly");
            commentTextarea.focus();
            commentTextarea.style.cssText =
              "border-color: #a19fcf; color:black;";
            editBtn.innerHTML = `<i class="fas fa-check"></i> Done`;
            commentP.remove();
            commentP.innerHTML = "";
            Comment.append(commentTextarea);
          } else {
            editBtn.innerHTML = `<i class="fas fa-edit"></i> Edit`;
            commentTextarea.style.color = "hsl(211, 10%, 45%)";
            commentTextarea.setAttribute("readonly", "");
            commentTextarea.style.borderColor = "rgba(0, 0, 0, 0.2)";
            commentP.append(to ? towards : "", commentTextarea.value);
            commentTextarea.remove();
            Comment.append(commentP);
          }
        });
        deleteBtn.addEventListener("click", () => {
          commentContainer.remove();
        });
      }
    }
    content.append(info, Comment);

    commentContainer.append(counter, content);

    container.append(commentContainer);

    replyBtn.addEventListener("click", (e) => {
      let addedReplies = document.querySelectorAll(".add-reply");
      let comments = document.querySelectorAll(".comment-container");
      let replies = document.querySelectorAll(".reply-container");

      comments.forEach((comment) => {
        comment.style.marginBottom = "0";
      });
      replies.forEach((reply) => {
        reply.style.marginBottom = "0";
      });
      addedReplies.forEach((reply) => {
        reply.remove();
      });
      addReply("reply", username);
    });

    function addReply(x, to) {
      let addComment = document.createElement("div");
      addComment.className = `add-${x}`;
      let currentUserImage = document.createElement("div");
      currentUserImage.className = "image";
      let currentUserImg = document.createElement("img");
      currentUserImg.src = data.currentUser.image.png;
      currentUserImage.append(currentUserImg);
      let textarea = document.createElement("textarea");
      textarea.id = "comment";
      textarea.className = "textarea";
      textarea.placeholder = `Reply to ${to}...`;
      textarea.style.height = "50px";
      let sendBtn = document.createElement("button");
      sendBtn.id = `send`;
      sendBtn.innerHTML = `${x.toUpperCase()}`;
      addComment.append(currentUserImage, textarea, sendBtn);

      document.body.append(addComment);

      let currentUser = data.currentUser.username;
      commentContainer.style.marginBottom = `${addComment.clientHeight - 10}px`;
      addComment.style.top = `${
        commentContainer.offsetTop + commentContainer.clientHeight + 10
      }px`;

      textarea.focus();

      sendBtn.addEventListener("click", () => {
        if (textarea.value !== "") {
          appendComments(
            "reply",
            textarea.value,
            "Just now",
            0,
            currentUserImg.src,
            currentUser,
            username
          );
          commentContainer.style.marginBottom = "0";
          addComment.remove();
        }
      });
    }
    addBtn.addEventListener("click", () => {
      addScore();
    });
    function addScore() {
      count.innerHTML = score;
      removeBtn.classList.remove("active");
      removeBtn.style.cssText = "color:#c8c6eb; font-weight:normal";
      if (addBtn.classList.contains("active")) {
        addBtn.classList.remove("active");
        addBtn.style.cssText = "color:#c8c6eb; font-weight:normal";
      } else {
        count.innerHTML++;
        addBtn.classList.add("active");
        addBtn.style.cssText = "color:#6762b5; font-weight:bold;";
      }
    }

    removeBtn.addEventListener("click", () => {
      removeScore();
    });
    function removeScore() {
      count.innerHTML = score;
      addBtn.classList.remove("active");
      addBtn.style.cssText = "color:#c8c6eb; font-weight:normal";
      if (removeBtn.classList.contains("active")) {
        removeBtn.classList.remove("active");
        removeBtn.style.cssText = "color:#c8c6eb; font-weight:normal";
      } else {
        count.innerHTML--;
        removeBtn.classList.add("active");
        removeBtn.style.cssText = "color:#6762b5; font-weight:bold;";
      }
    }
  }

  addComment("send");

  function addComment(x) {
    let addComment = document.createElement("div");
    addComment.className = `add-comment`;
    let currentUserImage = document.createElement("div");
    currentUserImage.className = "image";
    let currentUserImg = document.createElement("img");
    currentUserImg.src = data.currentUser.image.png;
    currentUserImage.append(currentUserImg);
    let textarea = document.createElement("textarea");
    textarea.id = "comment";
    textarea.className = "textarea";
    textarea.placeholder = `Add a comment...`;

    let sendBtn = document.createElement("button");
    sendBtn.id = `send`;
    sendBtn.innerHTML = `${x.toUpperCase()}`;
    addComment.append(currentUserImage, textarea, sendBtn);
    document.body.append(addComment);

    sendBtn.addEventListener("click", () => {
      if (textarea.value !== "") {
        add(
          x === "comment" || x === "reply" ? x : "comment",
          textarea.value,
          "Just now",
          0,
          currentUserImg.src,
          data.currentUser.username
        );
      }
      textarea.value = "";
      textarea.focus();
      textarea.onfocus = () => {
        textarea.style.cssText = "border-color: #a19fcf; color: black;";
      };
    });
  }
  function add(section, text, date, rate, img, username) {
    appendComments(section, text, date, rate, img, username);
  }
}
