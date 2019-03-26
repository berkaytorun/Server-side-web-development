
function startScript(page) {

    var request = new XMLHttpRequest();


    let currentPage = "currentPage=1"
    if (page) {
        currentPage = "currentPage=" + page
    }

    request.open("GET", "http://localhost:8080/api/books?" + currentPage);

    request.addEventListener("load", function () {
        if (request.status === 200) {

            let jsonObj = JSON.parse(request.responseText)

            initiateBook(jsonObj)
            initiatePaginatio(jsonObj)

        }
    });
    request.send("{hadsf: oiauffds}");
}

function initiatePaginatio(jsonObj) {

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
        let searchString = ""

        let classBundle = "pageNumber"
        if (jsonObj.searchString) {
            searchString = "&searchString=" + jsonObj.searchString
        }
        if (pageValue == "...") {
            classBundle = "isDisabled"
            anchorTag = "p"
        }

        txt += ' <li class="' + classBundle + '" ' + isCurrent + '">' +
            '    <' + anchorTag + ' href="/books?currentPage=' + pageValue + ' " ' + searchString + '" onclick=paginationcallback('+pageValue+') > ' + pageValue + '</' + anchorTag + '>' +
            '    </li>';
    }
    txt += ' </ul>       '
    document.getElementById("pagination").innerHTML = txt
}


function initiateBook(jsonObj) {
    console.log(jsonObj)
    document.getElementById("entirepage").innerHTML ='        <div id="pagination">' +
                                                    '' +
                                                    '        </div>' +
                                                    '';


    let txt = document.getElementById("entirepage").innerHTML
    const ourURL = "http://localhost:8080/books/"
    for (let i = 0; i < jsonObj.books.length; i++) {
        txt += '<div id="wrapper">' +
            '   <div id="book_info">' +
            '        <a href=' + ourURL + jsonObj.books[i].ISBN + '/>' +
            '            <div>ISBN: ' + jsonObj.books[i].ISBN + '</div>' +
            '            <div>Title: ' + jsonObj.books[i].title + '</div>' +
            '            <div>publicationYear: ' + jsonObj.books[i].publicationYear + '</div>' +
            '            <div>Pages: ' + jsonObj.books[i].pages + '</div>' +
            '        </a>' +
            '   </div>' +
            '</div>';
    }
    document.getElementById("entirepage").innerHTML = txt

}
function paginationcallback(pagevalue) {

    startScript(pagevalue)
}
startScript()