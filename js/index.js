
let likeExists;

document.addEventListener("DOMContentLoaded", function() {
    const booksUrl = 'http://localhost:3000/books';
    const list = document.getElementById('list');
    const showPanel = document.getElementById('show-panel');
    fetchBooks();


    function fetchBooks() {
        fetch(booksUrl)
        .then(res => res.json())
        .then(obj => {
            console.log(obj);
            for (const element of obj) {
            const li = document.createElement('li');
            li.textContent = element.title;
            li.id = element.id;
            li.addEventListener('click', showBookPanel);
            list.appendChild(li);
            };
        });
    };

    function showBookPanel(e) {
        let bookUrl = booksUrl + `/${e.target.id}`;
        console.log(bookUrl);
        fetch(bookUrl)
        .then(res => res.json())
        .then(obj =>{
            console.log(obj.author);
            let thumbnail = document.createElement('img');
            thumbnail.src = obj.img_url;
            let description = document.createElement('p');
            description.textContent = obj.description;
            let usersThatHaveLiked = document.createElement('ul');
            for (const user of obj.users) {
                let li = document.createElement('li');
                li.textContent = user.username;
                usersThatHaveLiked.appendChild(li);
            };
            let likeBtn = document.createElement('button');
            likeBtn.textContent = 'Like';
            likeBtn.id = obj.id;
            likeBtn.addEventListener('click', likeBtnClickHandler);
            showPanel.replaceChildren(thumbnail, description, usersThatHaveLiked, likeBtn);
        });
    };

    function likeBtnClickHandler(e) {
        doesUserLikeExist(e);
        //isUserLikeInDom(); //don't need this, was only being used during troubleshooting. 
        console.log(doesUserLikeExist(e));
    };

    // function isUserLikeInDom() {
    //     let oldUsersThatHaveLiked = document.querySelector("#show-panel ul");
    //     let domUserLikeNodes = oldUsersThatHaveLiked.childNodes;
    //     console.log(domUserLikeNodes);
    //     for (const node of domUserLikeNodes) {
    //         console.log(node.textContent);
    //         if (node.textContent === "summerqueen98") {
    //             node.remove();
    //         };
    //     };
    // };
    
    function doesUserLikeExist(e) {
        likeExists = false; // has to reset otherwise will stay true forever after initial flip.  
        let event = e;
        let checkingBookLikesUrl = booksUrl + `/${e.target.id}`;
        fetch(checkingBookLikesUrl)
        .then(res => res.json())
        .then(obj => {
            console.log(obj.users);
            obj.users.forEach(user => {
                console.log(user.id);
                if (user.id === 7) {likeExists = true};
                console.log(likeExists);
            });
        })
        .then( () => { 
            if (likeExists) {removeUserLike(event);
            } else {addUserLike(event);
            };
        });
    };
    
    function addUserLike(e) {
        let updatingBookLikesUrl = booksUrl + `/${e.target.id}`;
        fetch(updatingBookLikesUrl)
        .then(res => res.json())
        .then(obj => {
            let users = obj.users;
            console.log(users);
            let newUserLike = {
                id: 7,
                username: "summerqueen98",
            };
    
            users.push(newUserLike);
            likeExists = true;
            console.log(users);
            console.log(JSON.stringify(users));
    
            let patchConfig = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    "users": users,
                }),
            };
    
            fetch(updatingBookLikesUrl, patchConfig)
            .then(res => res.json())
            .then(obj => {
                let li = document.createElement('li');
                console.log(obj.users[e.target.id]); //don't know why this was giving me a weird result. 
                li.textContent = obj.username;
                let oldUsersThatHaveLiked = document.querySelector("#show-panel ul");
                console.log(document.querySelector("#show-panel ul"));
                let usersThatHaveLiked = document.createElement('ul');
                for (const user of obj.users) {
                    let li = document.createElement('li');
                    li.textContent = user.username;
                    usersThatHaveLiked.appendChild(li);
                };
                oldUsersThatHaveLiked.replaceWith(usersThatHaveLiked);
            });
        });
    };
    
    function removeUserLike(e) {
        let updatingBookLikesUrl = booksUrl + `/${e.target.id}`;
        fetch(updatingBookLikesUrl)
        .then(res => res.json())
        .then(obj => {
            let users = obj.users;
    
            let existingUserLike = {
                id: 7,
                username: "summerqueen98",
            };
    
            let removeThisIndex = users.indexOf(existingUserLike);
            console.log(users.indexOf(existingUserLike));
            console.log(users);
            users.splice(removeThisIndex, 1);
            console.log(users);
            console.log(JSON.stringify(users));
    
            let patchConfig = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    "users": users,
                }),
            };
    
            fetch(updatingBookLikesUrl, patchConfig)
            .then(res => res.json())
            .then(obj => {
                let li = document.createElement('li');
                console.log(obj.users[e.target.id]);
                li.textContent = obj.username;
                let oldUsersThatHaveLiked = document.querySelector("#show-panel ul");
                console.log(document.querySelector("#show-panel ul"));
                let usersThatHaveLiked = document.createElement('ul');
                for (const user of obj.users) {
                    let li = document.createElement('li');
                    li.textContent = user.username;
                    usersThatHaveLiked.appendChild(li);
                };
                oldUsersThatHaveLiked.replaceWith(usersThatHaveLiked);
            });
        });
    };
});


/*

You will be using the following backend to get the list of books. The expectation here is that you will include the following features:

List Books
1. (done) When the page loads, get a list of books from http://localhost:3000/books and display their titles by creating a li for each book and adding each li to the ul#list element. 

Show Details
2. (done) When a user clicks the title of a book, display the book's thumbnail, description, and a list of users who have liked the book. This information should be displayed in the div#show-panel element.

Like a Book
A user can like a book by clicking on a button. 
3. (done) Display a LIKE button along with the book details. 
4. (done) When the button is clicked, send a PATCH request to http://localhost:3000/books/:id with an array of users who like the book, and add a new user to the list.

For example, if you are user 1 {"id":1, "username":"pouros"} and the previous array was "[{"id":2, "username":"auer"}, {"id":8, "username":"maverick"}], you should send as the body of your PATCH request:

{
  "users": [
    { "id": 2, "username": "auer" },
    { "id": 8, "username": "maverick" },
    { "id": 1, "username": "pouros" }
  ]
}

5. (done) After clicking the like button, the user's name should also be displayed along with the list of users who have liked the book in the book details section.

Bonus: Un-Like a Book
6. (done) If a user has already liked a book, clicking the LIKE button a second time should remove that user from the list of users who have liked the book.

7. (done) Make a second PATCH request with the updated array of users, removing your user from the list. 
8. (done) Also remove the user from the DOM.

*/