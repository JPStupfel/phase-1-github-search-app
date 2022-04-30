//select form
const subForm = document.querySelector('#github-form')
let searchCrit = 'user'
//add event listener to prevent default and handle search
subForm.addEventListener('submit',(event)=>{
        //prevent default
        event.preventDefault();
        console.log(event)
        //go ahead and clear the user list in case it's a new search
        let userList = document.querySelector('#user-list')
        while (userList.firstChild) {
            userList.removeChild(userList.firstChild);
        }
        let repoList = document.querySelector('#repos-list')
        while (repoList.firstChild) {
            repoList.removeChild(repoList.firstChild);
        }


        //handle search using search input value
        if (searchCrit === 'user') {handleUserSearch(event.target.querySelector('#search').value);}
        if (searchCrit === 'repo'){handleRepoSearch(event.target.querySelector('#search').value);}
        
        //clear the search input value

         event.target.querySelector('#search').value = ''

        })

//add event listener to the toggle button that modifies searchCrit and changes button text
document.querySelector('#toggle-button').addEventListener('click', ()=>{
        if (searchCrit === 'user'){
            searchCrit = 'repo';
            document.querySelector('[name="submit"]').value = `search by ${searchCrit}`;
            document.querySelector('#toggle-button').value = `search instead by user`
            }
        else {
            searchCrit = 'user'
            document.querySelector('[name="submit"]').value = `search by ${searchCrit}`;
            document.querySelector('#toggle-button').value = `search instead by repo`
            }


    })

function handleUserSearch(search){
    fetch(`https://api.github.com/search/users?q=${search}`, {Accept: 'application/vnd.github.v3+json' }).then(res=>res.json()).then(data=>{ 

    //for all the results, run createNameCard()
        for (let i = 0; i<data['items'].length; i++)
            {
            createNameCard( data['items'][i]['login'],data['items'][i]['avatar_url'],data['items'][i]['repos_url'] )
            }
        })
    }

function createNameCard(name, image, repoUrl){
    //create card elements
    let nameCard = document.createElement('li')
    let nameHeader = document.createElement('h1')
    let avatar = document.createElement('img')
    let repoButton = document.createElement('button')
    repoButton.className = 'button'
    repoButton.textContent = 'view repos';
    let repoList = document.createElement('ul')
    

    //repo button event listener, air function with condition that alternates to display list of repos or removes that list by toggling listShown  variable
    let listShown = false;
    nameCard.addEventListener('click',()=>{
        //if the repo list isn't shown, fetch repo clones and display below button and change button text to 'hide'
        if (!listShown) {
            fetch(repoUrl, {Accept: 'application/vnd.github.v3+json' }).then(res=>res.json()).then(data=>{
             for (let i = 0; i<data.length; i++)
            {
                //console.log(data[i][`clone_url`]);
                let listItem = document.createElement('li')
                let cloneUrl = document.createElement('a')
                cloneUrl.textContent = data[i][`clone_url`]
                cloneUrl.href = data[i][`clone_url`]
                listItem.appendChild(cloneUrl)
                repoList.appendChild(listItem)
                repoButton.textContent = 'hide repos';
                listShown = true
            }
            })
            }
        //if you've already clicked and list of repo is shown, then remove it and turn list show back to false 
        if (listShown){
    
            while (repoList.firstChild) {
                repoList.removeChild(repoList.firstChild);
            }
            listShown = false
            repoButton.textContent = 'view repos';
            }
         })
    
    nameHeader.textContent = name
    avatar.src = image

    //do the appending
    nameCard.appendChild(nameHeader)
    nameCard.appendChild(avatar)
    nameCard.appendChild(repoButton)
    nameCard.appendChild(repoList)
    document.querySelector('#user-list').appendChild(nameCard)
}


//separate search function for repos
function handleRepoSearch(search){
    fetch(`https://api.github.com/search/repositories?q=${search}`, {Accept: 'application/vnd.github.v3+json' }).then(res=>res.json()).then(data=>{ console.log(data['items']); 

        // for all the results, 
            for (let i = 0; i<data['items'].length; i++)
                {


                 let listItem = document.createElement('li')
                let cloneUrl = document.createElement('a')
                cloneUrl.textContent = data['items'][i][`clone_url`]
                cloneUrl.href = data['items'][i][`clone_url`]
                listItem.appendChild(cloneUrl)
                document.querySelector('#repos-list').appendChild(listItem)
                


                }
             })
        
}