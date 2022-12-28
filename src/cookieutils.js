
function getCookie(nameOfCookie){
    let nameToFind = nameOfCookie +"=";
    let cleanedCookie = decodeURIComponent(document.cookie)
    let listOfCookies = cleanedCookie.split(";")

    for (let i = 0; i<listOfCookies.length; i++){
        let thisCookie = listOfCookies[i];
        console.log(listOfCookies)
        console.log(thisCookie)
        while(thisCookie.charAt(0) === ' '){
            thisCookie = thisCookie.substring(1)
        }
        console.log(thisCookie)
        if (thisCookie.indexOf(nameToFind) === 0){
            return thisCookie.substring(nameToFind.length, thisCookie.length)
        }
    }
}

export default getCookie;