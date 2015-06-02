import EventEmitter from './event';

export default class CompilerSelect extends EventEmitter {
  constructor({el,btn}) {
    super();
    this.button = btn;
    this.el = el;

    this.bindEventHandlers();
  }

  bindEventHandlers() {
    this.button.addEventListener('click',this.toggle.bind(this));
    let buttons = this.el.querySelectorAll('li');
    for( let i = 0; i < buttons.length; i++ ) {
      buttons[i].addEventListener('click',this.select.bind(this));
    } 
  }

  toggle() {
    this.el.classList.toggle('visible');
  }

  hide() {
    this.el.classList.remove('visible');
  }

  select(e) {
    this.trigger("load",e.target.dataset.value);
    this.toggle();
  }
}
