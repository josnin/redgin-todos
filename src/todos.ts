import { RedGin, getset, html, watch, event } from 'redgin';

interface ITodo {
  done: boolean;
  text: string;
}

export default class Todos extends RedGin {
  todos = getset<ITodo[]>([{ done: false, text: 'Iphone' }]);

  add() {
    const inputElement =
      this.shadowRoot?.querySelector<HTMLInputElement>('input');
    if (inputElement) {
      this.todos = [...this.todos, { text: inputElement.value, done: false }];
      inputElement.value = '';
    }
  }

  toggle(index: number) {
    this.todos = this.todos.map((todo, i) =>
      i === index ? { ...todo, done: !todo.done } : todo
    ); // Efficient in-place update using map
        // TODO: should we call forceUpdate here instead of doing this way?
  }


  

  // Render method using html template literals
  render() {
    return html`
      <h2>Todos</h2>
      <input/>
      <button ${event('click', () => this.add())} >Add</button>

      ${watch(
        ['todos'],
        () => `
          ${this.todos.map( (todo: ITodo, index: number) => html` 
              <p>
                <input 
                  type="checkbox" 
                  ${event('change', () => this.toggle(index))}  
                  ${todo.done ? 'checked' : ''}
                />
                    
                ${todo.done ? `<s>${todo.text}</s>` : `<span>${todo.text}</span>`}
              </p>
              
          `).join('')}
        `
      )}
    
    `;
  }
}

// Register custom element with the browser
customElements.define('sample-todos', Todos);

// Extend HTMLElementTagNameMap to include 'sample-todos'
declare global {
  interface HTMLElementTagNameMap {
    'sample-todos': Todos;
  }
}

