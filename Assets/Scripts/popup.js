window.onload = function() {
    if(chrome.extension.getBackgroundPage().bookmarks.pageInfo.isIncognito) {
        document.getElementById('mainHeader').style.backgroundColor = "#191919";
        document.getElementsByTagName('footer')[0].style.backgroundColor = "#191919";
        var menuElements = document.getElementsByClassName('main-menu');
        document.get
        console.log(menuElements);
        //TODO: Need to figure out a way to get all the elements and
        //for(var i = 0; i < menuElements.length; i++) {
        //    menuElements[i].className = "main-menu-incognito";
        //}
    }
};