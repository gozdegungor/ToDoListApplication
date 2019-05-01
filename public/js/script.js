var items = [];

var list = document.querySelector('#main-list');
var listUpcoming = document.querySelector('#upcoming-list');
var listDone = document.querySelector('#done-list');
var addingPage = document.querySelector('#adding-page');
var upcomingPage = document.querySelector('#upcoming-page');
var donePage = document.querySelector('#done-page');

function prepareLists() {



    list.innerHTML = '';
    listUpcoming.innerHTML = '';
    listDone.innerHTML = '';

    items.forEach(function (item) {
            //main-list
            if (!item.hidden) {
                var li = document.createElement('li');
                li.innerText = item.name;
                list.appendChild(li);
                if (item.checked === true) {
                    li.classList.add('checked');
                }

                // listedeki elemanlar için X işareti yaratma
                var spanDel = document.createElement('spanDel');
                var text = document.createTextNode('\u00D7');
                spanDel.className = 'close';
                spanDel.appendChild(text);
                li.appendChild(spanDel);

                spanDel.onclick = function () {
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: "/hideitem",
                        data: JSON.stringify(item),
                        dataType: 'json',
                        success: function (status) {
                            if (status === true) {
                                item.hidden = true;
                                prepareLists();
                            }
                        },
                        error: function (error) {
                            console.log("An error is occured");
                            console.log(error);
                        }
                    });


                }

                //listedeki elemanlar için check mark işareti yaratma
                var spanCheck = document.createElement('spanCheck');
                var text = document.createTextNode('\u2713');
                spanCheck.className = 'checkBtn';
                spanCheck.appendChild(text);
                li.appendChild(spanCheck);

                spanCheck.onclick = function () {

                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: "/checkitem",
                        data: JSON.stringify(item),
                        dataType: 'json',
                        success: function (status) {
                            if (status === true) {
                                if (item.checked === false) {
                                    item.checked = true;
                                    prepareLists();
                                }
                            }
                        },
                        error: function (error) {
                            console.log("An error is occured");
                            console.log(error);
                        }
                    });


                };

                //listedeki elemanlar için zaman işareti yaratma

                var upcomingDate = new Date(item.date);
                var currentDate=new Date();

                Date.daysBetween = function( date1, date2 ) {
                    //Get 1 day in milliseconds
                    var one_day=1000*60*60*24;

                    // Convert both dates to milliseconds
                    var date1_ms = date1.getTime();
                    var date2_ms = date2.getTime();

                    // Calculate the difference in milliseconds
                    var difference_ms = date2_ms - date1_ms;

                    // Convert back to days and return
                    return Math.floor(difference_ms/one_day);
                }
                var remainingDay=Date.daysBetween(currentDate,upcomingDate);

                if(remainingDay<=1 && item.checked===false){
                    var spanTiming = document.createElement('spanTiming');
                    var text = document.createTextNode('\u231B');
                    spanTiming.className = 'timeBtn';
                    spanTiming.appendChild(text);
                    li.appendChild(spanTiming);
                }




                //upcoming-list

                if (item.checked === false) {

                    var upcomingDate = new Date(item.date);
                    var currentDate=new Date();

                    Date.daysBetween = function( date1, date2 ) {
                        //Get 1 day in milliseconds
                        var one_day=1000*60*60*24;

                        // Convert both dates to milliseconds
                        var date1_ms = date1.getTime();
                        var date2_ms = date2.getTime();

                        // Calculate the difference in milliseconds
                        var difference_ms = date2_ms - date1_ms;

                        // Convert back to days and return
                        return Math.floor(difference_ms/one_day);
                    }
                    var remainingDay=Date.daysBetween(currentDate,upcomingDate);

                    if(remainingDay>=-1){
                        var liUpcoming = document.createElement('li');
                        liUpcoming.innerText = item.name;

                        var upcomingDate=new Date(item.date);

                        var spanDate = document.createElement('spanDate');
                        spanDate.innerText=upcomingDate.toLocaleDateString();
                        spanDate.className = 'itemDate';
                        liUpcoming.appendChild(spanDate);

                        listUpcoming.appendChild(liUpcoming);
                    }







                }

                //done-list
                if (item.checked === true) {
                    var liDone = document.createElement('li');
                    liDone.innerText = item.name;
                    listDone.appendChild(liDone);
                }
            }
        }
    );

    if (listUpcoming.innerHTML == '') {
        listUpcoming.innerText = 'There is no upcoming task';
    }

    if (listDone.innerHTML == '') {
        listDone.innerText = 'There is no done task';
    }


};

function closeAll() {
    addingPage.classList.add('hide');
    upcomingPage.classList.add('hide');
    donePage.classList.add('hide');
}


//save butonunu aktifleştirme
document.querySelector('#btnCreate').onclick = function () {
    var itemName = document.querySelector('#txtItem').value;
    var dueDate= new Date(document.querySelector('#dateItem').value) ;


    if (itemName === '') {
        alert('Lütfen bir değer giriniz.');
        return;
    }
    var newItem = {
        name: itemName,
        date: dueDate,
        checked: false,
        hidden: false
    };
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/additem",
        data: JSON.stringify(newItem),
        dataType: 'json',
        success: function (status) {
            if (status === true) {
                items.push(newItem);
                prepareLists();
                document.getElementById('txtItem').value = '';
                closeAll()
            }
        },
        error: function (error) {
            console.log("An error is occured");
            console.log(error);
        }
    });
};


var adding = document.getElementById('adding');
adding.addEventListener('click', function () {
    closeAll();
    addingPage.classList.remove('hide');

});

var upcoming = document.getElementById('upcoming');
upcoming.addEventListener('click', function () {
    closeAll();
    upcomingPage.classList.remove('hide');

});

var done = document.getElementById('done');
done.addEventListener('click', function () {
    closeAll();
    donePage.classList.remove('hide');

});


//db veri çekme
function loadItems() {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/loaditem",
        data: null,
        dataType: 'json',
        success: function (status) {
            if (status === false) {
                console.log("An error is occured");
            } else {
                for (item of status) {
                    items.push(item);
                    prepareLists();
                }
            }
        },
        error: function (error) {
            console.log("An error is occured");
            console.log(error);
        }
    });
}


$(document).ready(function () {
    loadItems();
});
