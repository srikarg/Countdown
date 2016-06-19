var saveCountdown = function(id, title, end) {
    chrome.storage.sync.get('countdowns', function(data) {
        if ($.isEmptyObject(data)) {
            var obj = {'countdowns': [{ 'id': id, 'title': title, 'date': end.toJSON() }]};
            chrome.storage.sync.set(obj);
            return;
        }
        data.countdowns.push({ 'id': id, 'title': title, 'date': end.toJSON() });
        chrome.storage.sync.set(data);
    });
};

var getCountdowns = function() {
    chrome.storage.sync.get('countdowns', function(data) {
        if ($.isEmptyObject(data)) {
            newMessage('Try adding some countdowns by clicking the button below!', 'blue');
        } else {
            $.each(data.countdowns, function(index, value) {
                createCountdown(value.id, value.title, new Date(value.date));
            });
        }
    });
};

var deleteCountdown = function(id) {
    chrome.storage.sync.get('countdowns', function(data) {
        var index;
        $.each(data.countdowns, function(i, v) {
            if (v.id === id) {
                index = i;
                return false;
            }
        });
        data.countdowns.splice(index, 1);
        $('#' + id).fadeOut();
        if (data.countdowns.length === 0) {
            chrome.storage.sync.remove('countdowns');
            return;
        }
        chrome.storage.sync.set(data);
    });
};

var getDateString = function(date) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var suffix;
    switch(date.getDate() % 10) {
        case 1:
            suffix = 'st';
        case 2:
            suffix = 'nd';
        case 3:
            suffix = 'rd';
        default:
            suffix = 'th'
    }
    return months[date.getMonth()] + ' ' + date.getDate() + suffix + ', ' + date.getFullYear();
};

var getSuffix = function(number) {
    return number === 1 ? '' : 's';
};

var createCountdown = function(id, title, end) {
    var countdowns = $('.countdowns');

    if (!$('#' + id).length) {
        countdowns.append('<li id="' + id + '" class="u-full-width"><span class="close">&times;</span><h1 class="title"></h1><p class="countdown"></p></li>');
    }

    var second = 1000;
    var minute = second * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var timer;

    update = function() {
        var now = new Date();
        var distance = end - now;
        if (distance < 0) {
            clearInterval(timer);
            deleteCountdown(id);
            newMessage('The countdown for ' + title + ' has just finished!', 'red');
            chrome.notifications.create('', {
                type: 'basic',
                iconUrl: '/icons/icon48.png',
                title: 'Trackr',
                message: 'The countdown for ' + title + ' has just finished!',
                priority: 2
            }, function() {});
            return;
        }
        var days = Math.floor(distance / day);
        var hours = Math.floor((distance % day) / hour);
        var minutes = Math.floor((distance % hour) / minute);
        var seconds = Math.floor((distance % minute) / second);

        var selector = $('#' + id);
        selector.find('.countdown').html(days + ' day' + getSuffix(days) + ', ' + hours + ' hour' + getSuffix(hours) + ', ' + minutes + ' minute' + getSuffix(minutes) + ', and ' + seconds + ' second' + getSuffix(seconds) + ' until <span class="date">' + getDateString(end) + '</span>');
        selector.find('.title').text(title);
    };

    update();

    timer = setInterval(update, 1000);
};

var newMessage = function(content, color) {
    var id = Math.floor(Math.random()*99999);
    $('.show-form').before('<p id="message-' + id + '" class="message message-' + color + '">' + content + '</p>');
    $('#message-' + id).delay(2000).fadeOut();
};

var resetForm = function() {
    $('.event-form, :input').not(':submit').val('').removeAttr('checked');
    $('.event-form').fadeOut();
    $('label[for="event-time"], #event-time').fadeOut();
    $('.show-form').text('Add Event!');
};

$(function() {
    getCountdowns();

    var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    var day = tomorrow.getDate();
    var month = tomorrow.getMonth() + 1;
    var year = tomorrow.getFullYear();

    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;

    $('#event-date').attr('min', year + '-' + month + '-' + day);

    var form = $('.event-form');

    $('.show-form').on('click', function() {
        if (!form.is(':visible')) {
            $('.show-form').text('Nevermind!');
            $('.event-form').fadeIn();
            $('#event-title').focus();
        } else {
            resetForm();
            $('.show-form').text('Add Event!');
            $('.event-form').fadeOut();
        }
    });

    $('#enterTime').on('click', function() {
        if ($(this).is(':checked')) {
            $('label[for="event-time"], #event-time').fadeIn();
        } else {
            $('label[for="event-time"], #event-time').fadeOut();
        }
    });

    $('.event-form').on('submit', function(e) {
        e.preventDefault();
        var title = $('#event-title').val();
        var date = $('#event-date').val();
        date = date.split('-');
        if ($('#enterTime').is(':checked')) {
            var time = $('#event-time').val();
            if (time) {
                time = time.split(':');
                date = new Date(date[0], date[1] - 1, date[2], time[0], time[1]);
            } else {
                newMessage('Please enter a time! If you don\'t want a time, uncheck the time checkbox', 'red');
            }
        } else {
            date = new Date(date[0], date[1] - 1, date[2]);
        }
        var id = '_' + Math.random().toString(36).substr(2, 9);
        saveCountdown(id, title, date);
        createCountdown(id, title, date);
        resetForm();
    });

    $(document).on('click', '.countdowns li .close', function() {
        var $this = $(this);
        deleteCountdown($this.parent().attr('id'));
    });
});
