class Wordle {
  constructor(parent = document.body, words = ["mamaw", "chile", "slide"], grid = {rows: 5, columns: 7}) {
    this.columns = grid.columns;
    this.rows = grid.rows;
    this.container = parent;
    this.size = Math.min((window.innerWidth / grid.rows) - 10, 135);
    this.wordle_id = this.container.classList.length > 0 ? '.'+this.container.classList[0]:'#'+this.container.id;
    try {
      if(!words.every(item => item.length === this.rows)) throw "Word must the same length as the inputs"   
      this.greens = []; 
      console.log(this.size)
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
    console.log(this.guess) //cheater
    for(let y = 0; y < this.columns; y++) {
      const col = document.createElement("div");
      col.setAttribute("class", "column");
      for(let x = 0; x < this.rows; x++) {
        const row = document.createElement("input");
        row.setAttribute("class", "row");
        row.setAttribute("enterkeyhint", "enter");
        row.setAttribute("maxlength", "1");
        row.style.width = this.size+"px";
        row.style.height = this.size+"px";
        row.style.fontSize = (this.size*0.5)+"px";
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
          //console.log(e)
          const prev = e.target.previousElementSibling;
          const next = e.target.nextElementSibling;
          const value = e.target.value;
          const parent = e.target.parentNode;
          const nextCol = parent.nextElementSibling;
          
          if(e.key === "Backspace" && prev && value.length <= 0) prev.focus();
          if(e.key === "Enter" && !next && value.length > 0) {
            if(nextCol && nextCol.classList.contains("column")) {
              this.setColor(parent);
              nextCol.firstElementChild.focus();
            }
            else if(nextCol && nextCol.className === "newGame" && this.greens.length < 5) {
              this.setColor(parent);
              this.gameOver();
            }
            console.log(this.greens)
          }
        });
        
      }
      this.container.appendChild(col);
      
    }
    const newGame = document.createElement("button");
    newGame.setAttribute("class", "newGame");
    newGame.innerText = "new game";
    newGame.style.fontSize = (this.size*0.3)+"px";
    newGame.addEventListener("click", () => this.newGame);
    this.container.appendChild(newGame);

    
  }
  setColor(parent) {
    const children = [...parent.children];
    this.greens = [];
    let yellows = [];
    for(let index = 0; index < children.length; index++) {
      const value = children[index].value;
      const guess = this.guess;
      for(let sub_index = 0; sub_index < guess.length; sub_index++) {
        const greenFound = this.greens.some(sub_found => sub_found === sub_index);
        const yellowFound = yellows.some(sub_found => sub_found.to === sub_index);

        
        if(index === sub_index && value === guess[sub_index]) {
          children[index].classList.add("green");
          if(yellowFound) {
            const yellowIndex = yellows.find(item => item.to === sub_index);
            children[yellowIndex.from].classList.remove("yellow");
          }
          if(!this.greens.some(item => item === sub_index)) this.greens.push(sub_index);
        }
        else if(index !== sub_index && value === guess[sub_index] && !greenFound && !yellowFound) {
          children[index].classList.add("yellow");
          yellows.push({
            from: index,
            to: sub_index
          });
        }
        else children[index].classList.add("none");
      }
      children[index].setAttribute("disabled", "true");
      children[index].style.animationName = "scale-bounce";
      children[index].style.animationDuration = "0.5s";
      children[index].style.animationDelay = `0.${index}s`
    }
    
    if(this.greens.length == this.rows) {
      const allRows = document.querySelectorAll(`${this.wordle_id} .row`);
      console.log(this.container.classList)
      allRows.forEach(items => items.setAttribute("disabled", "true"));
      this.guess = this.getRandom().split("");
      this.greens = [];
    }
  }
  gameOver() {
    const gameOverContainer = document.createElement("div");
    gameOverContainer.setAttribute("class", "game-over");
    const title = document.createElement("h2");
    title.innerText = "The word is";
    const theGuess = document.createElement("p");
    theGuess.setAttribute("id", "wd-reveal")
    theGuess.innerText = this.guess.join("");
    gameOverContainer.appendChild(title);
    gameOverContainer.appendChild(theGuess);
    this.container.appendChild(gameOverContainer);
    this.greens = [];
  }
  getRandom() {
    return this.words[Math.floor(Math.random()*this.words.length)];
  }
        }
