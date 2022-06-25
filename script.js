'use strict';

const table = document.querySelector('table');
const todo = document.getElementById('todo');
const priority = document.querySelector('select');
const deadline = document.querySelector('input[type="date"]');
const submit = document.getElementById('submit');
const rm = document.getElementById('rmbotton');
const idcheck = document.createElement('idcheck');



let list = [];
const storage = localStorage;

document.addEventListener('DOMContentLoaded', () => {
  const json = storage.todoList;
  if (json == undefined) {
    return;
  }
  list = JSON.parse(json);
  console.log(list)
  for (const item of list) {
    addItem(item);
  }
});
  //チェックボックス
const addItem = (item) => {
  const tr = document.createElement('tr');
  tr.id= 'tr-id'
  for (const prop in item) {
  if(prop != 'idcheck'){
  const td = document.createElement('td');
if (prop == 'done') {//完了欄の場合

      const checkbox = document.createElement('input');
      //
      checkbox.id='checkboxid'
      checkbox.type = 'checkbox';
      checkbox.checked = item[prop];//trueかfalse
      td.appendChild(checkbox);
      checkbox.addEventListener('change', checkBoxListener);
       
      //チェックした時に青くする
      checkbox.addEventListener('change',()=>{
        if(checkbox.checked==true){
          tr.style.backgroundColor = 'blue';
        }else{
          tr.style.backgroundColor = 'white';
        }
       });
      
        //チェックした時に青くする

        //期限切れ赤１
    const a=new Date().getDate();
    const b=new Date(item.deadline).getDate();
    if(a>b){
      tr.style.backgroundColor = 'red';
    }else{
      tr.style.backgroundColor = 'white'
    }

        //期限切れ赤１

        //削除ボタン
}else if(prop=='rm'){
  const button=document.createElement('button');
  button.textContent='削除';
  button.style.backgroundColor = 'Crimson';
  button.addEventListener('click', () => {
   tr.remove();
   
   console.log(tr);
   console.log(table)
   console.log(list)
   storage.todoList = JSON.stringify(list);
   const key=item.idcheck
   //時間のidで押した列を探す
   clearTable();
  list = list.filter((item) => item.idcheck != key);
  console.log(list)
  list.forEach((item) => addItem(item));
  storage.todoList = JSON.stringify(list);
});
td.appendChild(button);
       //削除ボタン
       //優先度の変更
}else if(prop=='priority'){
  const select=document.createElement('select');
  const z=['低','普','高'];
  for(const A of z){
  const option=document.createElement('option');
  option.textContent=A;
  select.appendChild(option);
}
    if(item[prop]==z[0]){//何が優先度選ばれたか調べる
      console.log('a');
      select.options[0].selected = true;
    }else if(item[prop]==z[1]){
      console.log('b');
      select.options[1].selected = true;
    }else if(item[prop]==z[2]){
      console.log('c');
      select.options[2].selected = true;
    }
//優先度変更
  select.onchange = () => 
  {console.log(select.selectedIndex);
  const x=select.selectedIndex
  if(x==0){
    item[prop]='低';
  }else if(x==1){
    item[prop]='普';
  }else if(x==2){
    item[prop]='高';
  }
  console.log(item[prop]);
  storage.todoList = JSON.stringify(list);
}
  

td.appendChild(select);
　　　　//優先度の変更
     //日付の変更
}else if(prop=='deadline'){
  const button=document.createElement('button');
  button.textContent=item[prop];
  button.addEventListener('click', () => {
  let newday = window.prompt('年-月-日を入力してください',`${item[prop]}`);
  if(newday==null){
    newday=item[prop];
  }else{
    console.log(newday)
  item[prop]=newday;
  console.log(item[prop])
  button.textContent=item[prop];
  }
  　　　　　     //期限切れ赤２
  const a=new Date().getDate();
  const b=new Date(item.deadline).getDate();
  if(a>b){
    tr.style.backgroundColor = 'red';
  }else{
    tr.style.backgroundColor = 'white'
  }
  storage.todoList = JSON.stringify(list);
  });

  td.appendChild(button);
}else {
      td.textContent = item[prop];
    }
    tr.appendChild(td);
  }
  table.append(tr);
};
}

const checkBoxListener= (ev) => {
  const currentTr = ev.currentTarget.parentElement.parentElement;
  const trList = Array.from(document.getElementsByTagName('tr'));
  const idx = trList.indexOf(currentTr) - 1;
  list[idx].done = ev.currentTarget.checked;
  storage.todoList = JSON.stringify(list);
};
//登録ボタン
submit.addEventListener('click', () => {
  const item = {};

  if (todo.value != '') {
    item.todo = todo.value;
  } else {
    item.todo = 'ダミーTODO';
  }
  item.priority = priority.value;
  if (deadline.value != '') {
    item.deadline = deadline.value;
  } else {
    item.deadline = new Date().toLocaleDateString().replace(/\//g, '-');
  }
  
  item.done = false;
  todo.value = '';
  priority.value = '普';
  deadline.value = '';
  rm.value= '';
  idcheck.value= `${new Date().getTime()}`;
  console.log(idcheck.value);
  item.rm=rm.value;
  item.idcheck=idcheck.value;
  addItem(item);

list.push(item);
  storage.todoList = JSON.stringify(list);
});
//登録ボタン


const filterButton = document.createElement('button');
filterButton.textContent = '優先度（高）で絞り込み';
filterButton.id = 'priority';
const main = document.querySelector('main');
main.appendChild(filterButton);

filterButton.addEventListener('click', () => {
  const newList = list.filter((item) => item.priority == '高');
  clearTable();
  newList.forEach((item) => addItem(item));
});//優先度高

const clearTable = () => {
  const trList = Array.from(document.getElementsByTagName('tr'));
  trList.shift();
  for (const tr of trList) {
    tr.remove();
  }
};
//完了したTODO削除
const remove = document.createElement('button');
remove.textContent = '完了したTODOを削除する';
remove.id = 'remove';
const br = document.createElement('br');
main.appendChild(br);
main.appendChild(remove);

remove.addEventListener('click', () => {
  clearTable();
  list = list.filter((item) => item.done == false);
  list.forEach((item) => addItem(item));
  storage.todoList = JSON.stringify(list);//ストレージに保存
});//削除
