export default class Elements{
  constructor(){
    this.listArray = [];
    this.actualElement
  }
  init(){
    if (this.loadState()){
      this.listArray = this.loadState()
      this.listArray.forEach(element => {
        document.querySelector(`.${element.sector}`).querySelector('.item-list-wrap').insertAdjacentHTML('beforeend',element.li);
      })
    }
    [...document.querySelectorAll('.add-card')].forEach(element => {
      element.addEventListener('click', (e)=> {
      this.addElement(e.target.closest('.items'));
      });
    });
    [...document.querySelectorAll('.item .list-wrapper')].forEach(element => {
      this.subscribe(element,null);
      });
    
      let actualElement
      const onMouseOver = (e) => {
        actualElement.style.top = e.clientY +'px';
        actualElement.style.left= e.clientX +'px';
      } 
      const onMouseMove = (event) => {
        debugger
        actualElement.style.left = event.pageX - actualElement.offsetWidth / 2 + 'px';
        actualElement.style.top = event.pageY - actualElement.offsetHeight / 2 + 'px';
      }
      const onMouseUp = (e) => {
        const mouseUpItem = e.target.closest('li')
        debugger
        mouseUpItem.closest('ul').insertBefore(actualElement,mouseUpItem)
        actualElement.classList.remove('dragged');
        actualElement.style.top='0';
        actualElement.style.left='0';
        actualElement = undefined;
        document.documentElement.removeEventListener('mouseup',onMouseUp)
        document.documentElement.removeEventListener('mouseover',onMouseOver)
        document.documentElement.removeEventListener('mousemove',onMouseMove)
      }
      [...document.querySelectorAll('.item-list-wrap')].forEach(el=> {
            el.addEventListener('mousedown', (e) =>{
              if(actualElement = e.target.closest('li.filled')){
                e.preventDefault()
                actualElement = e.target.closest('li');
                actualElement.classList.add('dragged');
              document.documentElement.addEventListener('mousemove', onMouseMove);
              document.documentElement.addEventListener('mouseup',onMouseUp);
              document.documentElement.addEventListener('mouseover',onMouseOver);
              }
            })
      })
  }
  addElement(parent) {
    const list = document.createElement('li');
    const wrapper = document.createElement('div');
    wrapper.classList.add('list-wrapper')
    const crossWrap = document.createElement('div');
    const cross = document.createElement('div');
    const itemText = document.createElement('textarea');
    const id = performance.now();
    const btnAdd = document.createElement('button');
    list.classList.add("item");
    btnAdd.type ='submit';
    btnAdd.textContent= 'Add card';
    btnAdd.classList.add('add-cardText')
    const btnReject = document.createElement('button');
    btnReject.type = 'reset'
    btnReject.classList.add('reject-cardText');
    btnAdd.textContent= 'Add card';
    btnReject.innerHTML = "&#x2716";
    itemText.placeholder='write some deal...';
    itemText.classList.add("item-text");
    crossWrap.classList.add("cross");
    crossWrap.classList.add("close");
    cross.classList.add("close");
    cross.innerHTML = "&#x2716";
    crossWrap.append(cross);
    wrapper.append(crossWrap);
    wrapper.append(itemText);
    list.dataset.id = id;
    list.insertAdjacentElement('beforeend',btnAdd);
    list.insertAdjacentElement('beforeend',btnReject);
    list.insertAdjacentElement('afterbegin',wrapper)
    parent.querySelector('.item-list-wrap').insertAdjacentElement('beforeend',list);
    this.subscribe(parent.querySelector(`[data-id = '${id}'] div`), parent);
  }
  subscribe(element,parentElement){
    element.addEventListener('mouseover', (e)=> {
      e.preventDefault()
      element.querySelector('.cross').classList.remove('deactive');
    });
    element.addEventListener('mouseout', ()=> {
      element.querySelector('.cross').classList.add('deactive');
    });
    element.closest('.item').addEventListener('click', (event)=> {
      if(event.target.classList.contains('add-cardText')){
        if(element.querySelector('textarea').value==='') {
          return alert('Write smth or delete this card')
        }
        element.querySelector('textarea').outerHTML = `
        <div class="item-text">${element.querySelector('textarea').value}</div>`;
        event.target.classList.add('deactive');
        event.target.nextSibling.classList.add('deactive');
        element.closest('.item').classList.add('filled')
        this.listArray.push({
          sector:[...parentElement.classList][1],
          id:element.closest('.item').dataset.id,
          li:element.closest('.item').outerHTML
        })
        this.saveState(this.listArray)
      }
    });
    element.closest('.item').addEventListener('click', (event)=> {
      if(event.target.classList.contains('reject-cardText')){
        element.querySelector('textarea').value = '' ;
      }
      
    });

    element.addEventListener('click', (event)=> {
      if(event.target.classList.contains('close')){
        this.removeElement(event.target.closest('li.item'));
      }
    });
  }
  removeElement(element){
    this.listArray = this.listArray.filter((item) => {
      item.sector;
      return item.id !== element.dataset.id;
    })
    element.remove()
    this.saveState(this.listArray)
  }
  saveState(state) {
    localStorage.setItem('state', JSON.stringify(state));
  }

  loadState() {
    try {
      return JSON.parse(localStorage.getItem('state'));
    } catch (e) {
      throw new Error('Invalid state');
    }
  }
  onMouseUp(){
    debugger

  }
}