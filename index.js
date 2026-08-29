class Wordle {
  constructor(parent, words = ["chain", "lanes", "chile", "slide"], grid = {rows: 5, columns: 7}) {
    this.columns = grid.columns;
    this.rows = grid.rows;
    this.container = parent;
    try {
      if(!words.every(item => item.length === this.rows)) throw "Word must the same length as the inputs"   
      this.words = words;
      this.isWarn = false;
      this.guess = this.getRandom().split("");
      this.guesses = [];
      
    } catch (err) {
      this.isWarn = true
      this.message = err;
      console.warn(err)
    }
    
  }
  get newGame() {
    this.guess = this.getRandom().split("");
    this.container.innerText = "";
    this.render();
  }
  render() {
    if(this.isWarn) {
      const warn = document.createElement("div");
      warn.style.width = "300px";
      
      warn.style.backgroundColor = '#fff5c2';
      warn.style.padding = "16px";
      warn.style.borderRadius = "5px";
      const text = document.createElement("p");
      text.innerText = this.message;
      warn.appendChild(text);
      this.container.appendChild(warn);
      return;
    } 
    console.log(this.guess)
    for(let y = 0; y < this.columns; y++) {
      const col = document.createElement("div");
      col.setAttribute("class", "column");
      for(let x = 0; x < this.rows; x++) {
        const row = document.createElement("input");
        row.setAttribute("class", "row");
        row.setAttribute("enterkeyhint", "enter");
        row.setAttribute("maxlength", "1");
        col.appendChild(row);
        row.addEventListener("input", (e) => {
          //console.log(e)
          const next = e.target.nextElementSibling;
          if(e.inputType === "insertText" && next) {
            e.target.blur();
            next.focus();
          }
          
        });
        row.addEventListener("keydown", (e) => {
          console.log(e)
          const prev = e.target.previousElementSibling;
          const next = e.target.nextElementSibling;
          const value = e.target.value;
          const parent = e.target.parentNode;
          const nextCol = parent.nextElementSibling;
          
          if(e.key === "Backspace" && prev && value.length <= 0) prev.focus();
          if(e.key === "Enter" && !next && value.length > 0) {
            console.log(this.setColor(parent))
            if(nextCol) nextCol.firstElementChild.focus();
          }
        });
        
      }
      this.container.appendChild(col);
      
    }
    const newGame = document.createElement("button");
    newGame.setAttribute("class", "newGame");
    newGame.innerText = "new game";
    newGame.addEventListener("click", () => this.newGame);
    this.container.appendChild(newGame);
  }
  setColor(parent) {
    const children = [...parent.children];
    let greens = [], yellows = [];
    for(let index = 0; index < children.length; index++) {
      const value = children[index].value;
      const guess = this.guess;
      for(let sub_index = 0; sub_index < guess.length; sub_index++) {
        const greenFound = greens.some(sub_found => sub_found === sub_index);
        const yellowFound = yellows.some(sub_found => sub_found === sub_index);
        if(index === sub_index && value === guess[sub_index]) {
          children[index].classList.add("green");
          greens.push(sub_index);
        }
        else if(index !== sub_index && value === guess[sub_index] && !greenFound && !yellowFound) {
          children[index].classList.add("yellow");
          yellows.push(sub_index);
        }
        else children[index].classList.add("none");
      }
      children[index].setAttribute("disabled", "true");
      children[index].style = `animation-name: scale-bounce; animation-duration: 0.5s; animation-delay: 0.${index}s;`
    }
    if(greens.length == this.rows) {
      const allRows = document.querySelectorAll("input.row");
      allRows.forEach(items => items.setAttribute("disabled", "true"));
      this.guess = this.getRandom().split("");
      
    }
  }
  getRandom() {
    return this.words[Math.floor(Math.random()*this.words.length)];
  }
}
