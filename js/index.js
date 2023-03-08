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
        console.log('I\'m in showbookpanel');
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
        console.log(e.target.id);
        let updatingBookLikesUrl = booksUrl + `/${e.target.id}`;
        console.log(updatingBookLikesUrl);
        fetch(updatingBookLikesUrl)
        .then(res => res.json())
        .then(obj => {
            console.log(obj);
            let users = obj.users;
            console.log(users);
            let newUserLike = {
                id: 7,
                username: "summerqueen98",
            };

            users.push(newUserLike);
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
            
            console.log(patchConfig);
            console.log(updatingBookLikesUrl);
            fetch(updatingBookLikesUrl, patchConfig)
            .then(res => res.json())
            .then(obj => {
                console.log(obj);
                let id = e.target.id;
                // let button = document.querySelector(`button#${id}`);
                // console.log(button);
                let li = document.createElement('li');
                console.log(obj.users[e.target.id]);// here
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
A user can like a book by clicking on a button. 3. (done) Display a LIKE button along with the book details. 
When the button is clicked, send a PATCH request to http://localhost:3000/books/:id with an array of users who like the book, and add a new user to the list.

For example, if you are user 1 {"id":1, "username":"pouros"} and the previous array was "[{"id":2, "username":"auer"}, {"id":8, "username":"maverick"}], you should send as the body of your PATCH request:

{
  "users": [
    { "id": 2, "username": "auer" },
    { "id": 8, "username": "maverick" },
    { "id": 1, "username": "pouros" }
  ]
}
After clicking the like button, the user's name should also be displayed along with the list of users who have liked the book in the book details section.

Bonus: Un-Like a Book
If a user has already liked a book, clicking the LIKE button a second time should remove that user from the list of users who have liked the book.

Make a second PATCH request with the updated array of users, removing your user from the list. Also remove the user from the DOM.

*/