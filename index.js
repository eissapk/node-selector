const box = document.querySelector("#box");
document.addEventListener("mouseup", e => manualDrag.dragEnd(e));
document.addEventListener("mousedown", e => manualDrag.dragStart(e));
document.addEventListener("mousemove", e => manualDrag.dragMove(e));
// get questions info + nodes
window.onload = () => {
  const boxes = document.querySelectorAll(".qa");
  boxes.forEach(item => {
    const rect = item.getBoundingClientRect();
    manualDrag.currentQuestionsBoxes.push({ id: genID(), elm: item, x: rect.x, y: rect.y, width: rect.width, height: rect.height });
  });
};

function genID() {
  return new Date().getTime() + "_" + Math.random().toString(36).slice(2);
}

var manualDrag = {
  isDown: null,
  startX: null,
  startY: null,
  currentX: null,
  currentY: null,
  walkX: null,
  walkY: null,
  margin: 0,
  currentQuestionsBoxes: [],
  store: [],
  dragStart(e) {
    e.stopPropagation(); // prevent ionic from overscroll
    this.isDown = true;
    e = e || window.event;

    // get initial x, y position of touched area
    this.startX = e.clientX - this.margin;
    this.startY = e.clientY - this.margin;
    console.warn("initial", { startX: this.startX, startY: this.startY });
    // position box
    box.style.left = this.startX + "px";
    box.style.top = this.startY + "px";

    // console.log(this.currentQuestionsBoxes);
  },
  dragEnd() {
    this.isDown = false;
    box.style.left = "auto";
    box.style.right = "auto";
    box.style.top = "auto";
    box.style.bottom = "auto";
    box.classList.add("hidden");

    this.showAnswer();
  },
  dragMove(e) {
    e = e || window.event;
    this.store = []; //reset
    if (this.isDown) {
      // get (x, y) position of touched area
      this.currentX = e.clientX - this.margin;
      this.currentY = e.clientY - this.margin;
      // detect how many px moved
      this.walkX = this.currentX - this.startX;
      this.walkY = this.currentY - this.startY;
      // handle -ve sign
      this.walkX = this.walkX < 0 ? this.walkX * -1 : this.walkX;
      this.walkY = this.walkY < 0 ? this.walkY * -1 : this.walkY;

      box.classList.remove("hidden");
      // update box position
      if (this.walkX < 0) {
        // reverse
        box.style.left = "auto";
        box.style.right = this.startX + "px";
        box.style.width = this.walkX + "px";
      } else {
        // normal
        box.style.right = "auto";
        box.style.left = this.startX + "px";
        box.style.width = this.walkX + "px";
      }
      if (this.walkY < 0) {
        // reverse
        box.style.top = "auto";
        box.style.bottom = this.startY + "px";
        box.style.height = this.walkY + "px";
      } else {
        // normal
        box.style.bottom = "auto";
        box.style.top = this.startY + "px";
        box.style.height = this.walkY + "px";
      }
      // console.warn("walk", { walkX: this.walkX, walkY: this.walkY });

      const selectionDimensions = { x: this.startX, width: this.walkX, y: this.startY, height: this.walkY };
      console.log({ qs: this.currentQuestionsBoxes, s: selectionDimensions });

      // this.currentQuestionsBoxes.forEach(questionBox => {
      //   // if elem in dom
      //   if (questionBox.elm) {
      //     if (this.isSelected(questionBox, selectionDimensions)) {
      //       const hasSameBox = this.store.find(item => item.id === questionBox.id);
      //       if (!hasSameBox) this.store.push(questionBox);
      //     }
      //   }
      // });
    }
  },

  showAnswer() {
    // console.log(this.store);
    // if (this.store && this.store.length) {
    //   this.store.forEach(item => {
    //     const placholder = item.elm.querySelector(".answerPlaceholder");
    //     const answer = item.elm.querySelector(".answer");
    //     placholder.style.display = "none";
    //     answer.style.display = "inline-block";
    //   });
    // }
  },

  // todo detect if the question is wrapped in the selection 
  isSelected(box1, box2) {
    var depth = 10;
    if (box1.y + depth > box2.y + box2.h) {
      // top > bottom
      return false;
    } else if (box1.x + box1.w + depth < box2.x) {
      // right < left
      return false;
    } else if (box1.y + box1.h + depth < box2.y) {
      // bottom < top
      return false;
    } else if (box1.x + depth > box2.x + box2.w) {
      // left > right
      return false;
    } else {
      // intersection
      return true;
    }
  },
};
