



function startScript(page, searchStringValue) {

    var request = new XMLHttpRequest();


    let currentPage = "currentPage=1"
    if (page) {
        currentPage = "currentPage=" + page
    }

    let searchString =  ""
    if(searchStringValue) {
        searchString = "&searchString=" + searchStringValue
    }

    
    //request.open("GET", "http://librarytool-env.jhdg9ip35x.eu-central-1.elasticbeanstalk.com/api/books?" + currentPage + searchString);
    request.open("GET", "http://localhost:8080/api/books?" + currentPage + searchString);

    request.addEventListener("load", function () {
        if (request.status === 200) {

            let jsonObj = JSON.parse(request.responseText)

            let oldSearch = ""
            if (document.getElementById("search").getAttribute("latestSearch")) {
                oldSearch = document.getElementById("search").getAttribute("latestSearch").toString()
                
            }
            initiateBook(jsonObj)
            initiatePagination(jsonObj,searchStringValue)
            initiateSearch(jsonObj, oldSearch)
        }
        else if (request.status === 404){
            document.getElementById("search").setAttribute("latestSearch", "")
            document.getElementById("sb1").value = ""
            alert("No match found")
        }
        else{
            alert("Unknown Error")
        }
    });
    request.send("");
}

function initiatePagination(jsonObj) {

    let txt = document.getElementById("pagination").innerHTML
    txt += '<ul class="pagination justify-content-center"> '
    for (let i = 0; i < jsonObj.pages.pageList.length; i++) {
        const page = jsonObj.pages.pageList[i]
        let pageValue = page.value;
        let isCurrent = ""
        let anchorTag = "p"
        if (page.isCurrent) {
            isCurrent = "id=\"pageCurrent\""
        }

        let classBundle = "pageNumber"
        if (pageValue == "...") {
            classBundle = "isDisabled"
            anchorTag = "p"
        }

        txt += ' <li class="' + classBundle + '" ' + isCurrent + '">' +
            '    <' + anchorTag + ' href="#"'+ ' id="test" onclick=paginationcallback(' + pageValue + ') >' + pageValue + '</' + anchorTag + '>' +
            '    </li>';
    }
    txt += ' </ul>       '
    document.getElementById("pagination").innerHTML = txt
}


function initiateBook(jsonObj) {

    document.getElementById("entirepage").innerHTML ='<div id="pagination">' +
                                                    '' +
                                                    '        </div>' +
                                                    '   <div id="search">'+
                                                    '        </div>'+
                                                    '';


    let txt = document.getElementById("entirepage").innerHTML
    //const ourURL = "http://librarytool-env.jhdg9ip35x.eu-central-1.elasticbeanstalk.com/api/books/"
    const ourURL = "http://localhost:8080/api/books/"
    
    for (let i = 0; i < jsonObj.books.length; i++) {
        txt += '<div id="wrapper">' +
            '   <div id="book_info">' +
            '        <a href=' + escapeString(ourURL) + escapeString(jsonObj.books[i].ISBN) + '/>' +
            '            <div>ISBN: ' + escapeString(jsonObj.books[i].ISBN) + '</div>' +
            '            <div>Title: ' + escapeString(jsonObj.books[i].title) + '</div>' +
            '            <div>publicationYear: ' + escapeString(jsonObj.books[i].publicationYear) + '</div>' +
            '            <div>Pages: ' + escapeString(jsonObj.books[i].pages) + '</div>' +
            '        </a>' +
            '   </div>' +
            '</div>';
    }
    document.getElementById("entirepage").innerHTML = txt
}

function paginationcallback(pagevalue) {

    const searchBar = document.getElementById("search")
    const theSearchString = searchBar.getAttribute("latestSearch").toString()

    startScript(pagevalue, theSearchString)

}

function initiateSearch(jsonObj, oldSearch){

    let txt = document.getElementById("search").innerHTML
     txt =
'       <div>' +
'            <input type="search" name="searchString" id="sb1" placeholder="' + jsonObj.placeholder + '" value=' + jsonObj.searchString + '>' +
'            <p id="searchButton" onClick="searchCallback()"><i class="fa fa-search"> </i>' +
'       </div>'
    
    document.getElementById("search").innerHTML = txt

    document.getElementById("search").setAttribute("latestSearch", oldSearch)
}

function searchCallback() {
    
    let searchText = document.getElementById("sb1").value

    const searchBar = document.getElementById("search")
    searchBar.setAttribute("latestSearch", searchText);
    
    startScript("1", searchText)
}

function escapeString(value) {
    if (!value) {
        return value
    }
    for (let i = 0; i < value.length; i++) {
        if (value[i] === "<") {
            const endString = i === value.length - 1 ? "" : value.substring(i + 1)
            value = value.substring(0, i) + "&lt" + endString
        }
        else if (value[i] === ">") {
            const endString = i === value.length - 1 ? "" : value.substring(i + 1)
            value = value.substring(0, i) + "&gt" + endString
        }
        else if (value[i] === "'") {
            const endString = i === value.length - 1 ? "" : value.substring(i + 1)
            value = value.substring(0, i) + "/'" + endString
        }
        else if (value[i] === '"') {
            const endString = i === value.length - 1 ? "" : value.substring(i + 1)
            value = value.substring(0, i) + '/"' + endString
        }
        else if (value[i] === '´') {
            const endString = i === value.length - 1 ? "" : value.substring(i + 1)
            value = value.substring(0, i) + '/´' + endString
        }
        else if (value[i] === "(") {
            const endString = i === value.length - 1 ? "" : value.substring(i + 1)
            value = value.substring(0, i) + "/(" + endString
        }
        else if (value[i] === ")") {
            const endString = i === value.length - 1 ? "" : value.substring(i + 1)
            value = value.substring(0, i) + "/)" + endString
        }
        else if (value[i] === "[") {
            const endString = i === value.length - 1 ? "" : value.substring(i + 1)
            value = value.substring(0, i) + "/[" + endString
        }
        else if (value[i] === "]") {
            const endString = i === value.length - 1 ? "" : value.substring(i + 1)
            value = value.substring(0, i) + "/]" + endString
        }
    }
    return value
}

startScript()