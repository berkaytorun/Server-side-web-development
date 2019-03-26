
function startScript() {

    var request = new XMLHttpRequest();
    request.open("GET", "http://localhost:8080/api/books/");

    request.addEventListener("load", function () {
        if (request.status === 200) {

            let jsonObj = JSON.parse(request.responseText)

            console.log(jsonObj)

            var txt = document.getElementById("entirepage").innerHTML
            const ourURL = "http://localhost:8080/books/"
            for (let i = 0; i < jsonObj.pages.pageList.length; i++) {
                txt +=  '<div id="wrapper">' +
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
            /*        
        var myvar = ''+
        '        <a href="/books/{{this.ISBN}}">'+
        '            <div>ISBN: '+jsonObj.books[i].ISBN+'</div>'+
        '            <div>Title: '+jsonObj.books[i].title+'</div>'+
        '            <div>publicationYear: '+jsonObj.books[i].publicationYear+'</div>'+
        '            <div>Pages: '+jsonObj.books[i].pages+'</div>'+
        '        </a>'
        
        '        {{#if this.authors}}'+
        '            <div>'+
        '                <div>'+
        '                    Authors: '+
        '                </div>'+
        '                <hr>'+
        '                {{#each this.authors}}'+
        '                    <a href="/authors/{{this.Id}}">'+
        '                        <div>'+
        '                            First Name: {{this.firstName}}<br>'+
        '                            Last Name: {{this.lastName}}<br>'+
        '                        </div>'+
        '                    </a>'+
        '                    <hr>'+
        '                {{/each}}'+
        '        {{/if}}';
        	
        
                      
                 
        */

        }
    });
    request.send();
}

function runMyFunction(){

}


startScript()