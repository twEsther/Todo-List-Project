let section = document.querySelector("section")

let add = document.querySelector("form button");
add.addEventListener("click", e => {
    // 一開始要先避免 form 表單裡的值被提交出去
    e.preventDefault();

    // 取得 input 裡的所有 values(文字,月份,日期)，就是去抓他上一層的 element
    // console.log(e.target.parentElement);
    let form = e.target.parentElement;
    let todoText = form.children[0].value;
    let todoMonth = form.children[1].value;
    let todoDate = form.children[2].value;

    // 給一個判斷式，避免使用者在還沒有輸入文字的情況下就新增 item
    if (todoText === "") {
        alert("請輸入待辦事項。");
        return;  // 沒有加入 return 的話他就一樣會繼續執行下面的 Callback function，也就是會新增 item
    }


    // 新增建立一個 Todo item 到下面的 section
    let todo = document.createElement("div");  // 這個 div 裡面有很多東西
    todo.classList.add("todo");  // 首先先希望它有一個 class 叫做 todo

    let text = document.createElement("p");
    text.classList.add("todo-text");  // 這個 text 也給它一個 class
    text.innerText =  todoText;

    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = todoMonth + " / " + todoDate;

    todo.appendChild(text); // 把 text 放到 todo 裡面
    todo.appendChild(time); // 把 time 放到 todo 裡面

    
    // 新增建立 check box 及 垃圾桶的 icon
    let completeButton =  document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';

    completeButton.addEventListener("click" , e =>{  // 此行表示，當按下 complete button 時，該欄位會標示為完成
        let todoItem = e.target.parentElement;
        //todoItem.classList.add("done"); // 可將 add 改為 toggle，也就是根據當前的情況，來 ON / OFF done 的效果
        todoItem.classList.toggle("done");
    })


    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    trashButton.addEventListener("click", e => {  // 此行表示，當按下 trash button 時，該欄位會刪除、消失不見
        //console.log(e.target); //先確認有沒有抓到 trash button
        let todoItem = e.target.parentElement;  //是要讓整個 item 消失，所以看 F12 就知道，button 的上一層是 div.todo
        //console.log(todoItem); // 一樣確認有沒有出現 div class="todo"
        //todoItem.remove();

        todoItem.style.animation = "scaleDown 0.3s forwards";

        todoItem.addEventListener("animationend" , () =>{

            // 刪除某筆資料時，也要刪除 local storage 中的資料
            let text = todoItem.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            myListArray.forEach((item, index) => {
                if (item.todoText == text) {
                    myListArray.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(myListArray));
                }
            });

            todoItem.remove();
        })
    })

    todo.appendChild(completeButton); // 把 check勾勾 放到 todo 裡面
    todo.appendChild(trashButton); // 把 垃圾桶放到 todo 裡面

    todo.style.animation = "scaleUp 0.4s forwards"; // 這邊在 JS 中的 CSS 表示方法有兩種



    // 為那些使用者所新增的每一個代辦項目 建立一個 object
    let myTodo = {
        todoText: todoText,
        todoMonth: todoMonth,
        todoDate: todoDate
    };


    // 將資料儲存在 Local Storage（本機記憶體）
    // 單一個待辦項目其資料型態為 object
    // 若有很多個待辦項目的 objects，則資料型態為 array
    // 下面的程式碼邏輯，參考 Notion (CH 20-294)
    let myList = localStorage.getItem("list"); // 建立一個 List 先去獲取原先在 localStorage 裡的 List
    if (myList == null) { 
        localStorage.setItem("list", JSON.stringify([myTodo]));
    } else {
        let myListArray = JSON.parse(myList);
        myListArray.push(myTodo);
        localStorage.setItem("list", JSON.stringify(myListArray));
    }

    console.log(JSON.parse(localStorage.getItem("list")));




    form.children[0].value = ""; // 為了要把框框裡的文字清空
    section.appendChild(todo); // 再把 todo 放到 section 裡面
});

loadData();


// 當使用者重新開啟瀏覽器，系統將取出本機記憶體中的資料，並列於 section
function loadData() {
    let myList = localStorage.getItem("list");
    if (myList !== null) {
        let myListArray = JSON.parse(myList);
        myListArray.forEach(item => {
            
            // 將 todo 建立出來
            let todo = document.createElement("div");
            todo.classList.add("todo");
            let text = document.createElement("p");
            text.classList.add("todo-text");
            text.innerText = item.todoText;
            let time = document.createElement("p");
            time.classList.add("todo-time");
            time.innerText = item.todoMonth + " / " + item.todoDate;
            todo.appendChild(text);
            todo.appendChild(time);


            // 新增建立 check box icon
            let completeButton =  document.createElement("button");
            completeButton.classList.add("complete");
            completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';

            completeButton.addEventListener("click" , e =>{  // 此行表示，當按下 complete button 時，該欄位會標示為完成
                let todoItem = e.target.parentElement;
                //todoItem.classList.add("done"); // 可將 add 改為 toggle，也就是根據當前的情況，來 ON / OFF done 的效果
                todoItem.classList.toggle("done");
            })
        
            //  垃圾桶的按鈕
            let trashButton = document.createElement("button");
            trashButton.classList.add("trash");
            trashButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        
            trashButton.addEventListener("click", e => {  // 此行表示，當按下 trash button 時，該欄位會刪除、消失不見
                //console.log(e.target); //先確認有沒有抓到 trash button
                let todoItem = e.target.parentElement;  //是要讓整個 item 消失，所以看 F12 就知道，button 的上一層是 div.todo
                //console.log(todoItem); // 一樣確認有沒有出現 div class="todo"
                //todoItem.remove();
        
                todoItem.style.animation = "scaleDown 0.3s forwards";
        
                todoItem.addEventListener("animationend" , () =>{

                    // 刪除某筆資料時，也要刪除 local storage 中的資料
                    let text = todoItem.children[0].innerText;
                    let myListArray = JSON.parse(localStorage.getItem("list"));
                    myListArray.forEach((item, index) => {
                        if (item.todoText == text) {
                            myListArray.splice(index, 1);
                            localStorage.setItem("list", JSON.stringify(myListArray));
                        }
                    });

                    todoItem.remove();
                })
            })

            todo.appendChild(completeButton);
            todo.appendChild(trashButton);

            section.appendChild(todo);
        })
    }
}

// 排序演算法（CH 297）(從189~235行)
function mergeTime(arr1, arr2) {
    let result = [];
    let i = 0;
    let j = 0;

    while (i < arr1.length && j < arr2.length){
        if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
            result.push(arr2[j]);
            j++;
        } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
            result.push(arr1[i]);
            i++;
        } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
            if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
                result.push(arr2[j]);
                j++;
            } else {
                result.push(arr1[i]);
                i++
            }
        }
    }

    while (i < arr1.length) {
        result.push(arr1[i]);
        i++;
    }
    while (j < arr2.length) {
        result.push(arr2[j]);
        j++
    }

    return result;

}


function mergeSort(arr) {
    if (arr.length === 1) { // 去確認看他的長度是否等於 1，也就是是否只有一個 element，如果是，就直接回傳該 array
        return arr;
    } else {
        let middle = Math.floor(arr.length / 2);
        let right = arr.slice(0, middle);
        let left = arr.slice(middle, arr.length);
        return mergeTime(mergeSort(right), mergeSort(left));
    }
}

// 驗證此演算法是否正確
// 把 list parse 成 array 之後，再執行 mergeSort 這個 function
// console.log(mergeSort(JSON.parse(localStorage.getItem("list"))));


// 按下 Sort By Time 之後，就會依時間排序
let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
    // sort data
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortedArray));

    
    // remove data
    let len = section.children.length; //children 會回傳一個 HTMLCollection
    // 因為是 HTMLCollection，所以沒辦法使用 forEach(), 只能使用 for loop
    for (let i = 0; i < len; i++) {
        section.children[0].remove();
    }


    // load data
    loadData();
})