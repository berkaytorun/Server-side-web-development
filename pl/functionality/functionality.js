
exports.generatePageNumbers = function(totalPages, currentPage) {
    currentPage = Number(currentPage)

    totalPages = Math.ceil(totalPages)

    const pagination = {
        pageList: []
    }
    const pagesClip = 5

    const firstPage = 1 
    const lastPage = totalPages
    
    let start = currentPage <= pagesClip ? firstPage : currentPage - pagesClip
    let end = currentPage <= pagesClip ? (pagesClip * 2) + 1 : currentPage + pagesClip 
    if (end > lastPage) {
        end = lastPage
        start = end - (pagesClip * 2)
        start = start < 1? 1 : start
    }

    pagination.firstPage = start != firstPage ? firstPage : false
    
    for (let i = start; i <= end; i++) {
        if (i == currentPage) {
            pagination.pageList.push({value: i, isCurrent: true})
        }
        else {
            pagination.pageList.push({value: i, isCurrent: false})
        }
    }

    pagination.lastPage = end != lastPage ? lastPage : false

    if (pagination.lastPage) {
        pagination.pageList[pagination.pageList.length - 1].value = "..."
    }
    if (pagination.firstPage) {
        pagination.pageList[0].value = "..."
    }

    return pagination
}
