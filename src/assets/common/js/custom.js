$('body').delegate('.app-menu-item.grid-table>span:nth-child(1)>span:nth-child(2),.m-menu__link.m-menu__toggle.ng-star-inserted>i', 'click', function() {
    var childsElement = $(this).closest('li').find('.m-menu__submenu')[0];
    var arrowElement = $(this).closest('.m-menu__toggle').find('.m-menu__ver-arrow')[0];
    var childLengths = $(childsElement).find('>ul>*').length;
    var timeCollapse = childLengths * 40;
    if ($(childsElement).attr('data-collapse')) {
        $(arrowElement).removeClass('arrow-collapse');

        $(childsElement).animate({ height: childsElement.scrollHeight }, timeCollapse, function() {
            childsElement.style.height = null;
            $(childsElement).removeAttr('data-collapse');

        });
    } else {
        $(arrowElement).addClass('arrow-collapse');
        $(childsElement).animate({ height: 0 }, timeCollapse, function() {
            childsElement.style.height = 0;
            $(childsElement).attr('data-collapse', 'active');
        });
    }
});

$('body').delegate('input', 'keypress', function(evt) {
    if (evt.target.value.length >= 4000) {
        evt.preventDefault();
    }
});



window.parent['auto_grow'] = function(element) {

    this.setTimeout(() => {
        if ((element.value || '').length == (element.previouseValue || '').length) {
            return;
        }
        element.previouseValue = element.value;
        console.count('auto_grow');
        if (element.tagName != 'TEXTAREA') {
            return;
        }

        if ($(element).closest('editable-table').length) {
            return;
        }

        let heightValue = 0;

        let rows = $(element).attr('rows');
        if (!rows) {
            rows = 3;
        }
        heightValue = parseInt(rows) * 15;

        if (!element || !element.style || !element.offsetHeight) {
            return;
        }
        element.style.height = '0px';
        if (element.scrollHeight > heightValue) {
            heightValue = element.scrollHeight;
        }

        element.style.height = heightValue + "px";
    })
}

$('body').delegate('textarea', 'input change keyup cut paste', function(evt) {
    window.parent['auto_grow'](evt.target)
});

// $('body').on('textarea', 'ready', function(evt) {
//     if (evt.target.value) {
//         window.parent['auto_grow'](evt.target)
//     }
// });

// $('body').on('DOMNodeInserted', 'textarea', function() {
//     window.parent['auto_grow'](this)
// });

// $('body')[0].addEventListener("DOMNodeInserted", function(event) {
//     console.log(event.target.tagName);
//     if (event.target.tagName == 'TEXTAREA') {
//         window.parent['auto_grow'](event.target)
//     }
// }, false);


// document.addEventListener(
//     'load',
//     function(event) {
//         var elm = event.target;
//         if (elm.tagName === 'TEXTAREA') { // or any other filtering condition
//             window.parent['auto_grow'](evt.target)
//         }
//     },
//     true // Capture event
// );

// $('body').on('DOMNodeInserted ', 'textarea', function() {
//     window.parent['auto_grow'](this)
// })

// $('textarea').livequery(function() {
//     window.parent['auto_grow'](this)
// });

$('body').delegate('input', 'paste', function(evt) {
    clipboardData = evt.originalEvent.clipboardData || window.clipboardData;
    var pastedData = clipboardData.getData('Text');

    if ((pastedData.length + evt.target.value.length) >= 4000) {
        evt.preventDefault();
    }
});


$('body').delegate('input[type="number"]', 'focusout', function(evt) {

    var value = parseInt(evt.target.value);
    var min = parseInt(evt.target.min);
    var max = parseInt(evt.target.max);

    // remove redundant +-
    if (!value && value != 0) {
        evt.target.value = null;
        return;
    }

    if ((min || min == 0) && value < min) {
        $(evt.target).val(min);
        $(evt.target).trigger('input'); // Use for Chrome/Firefox/Edge
        $(evt.target).trigger('change'); // Use for Chrome/Firefox/Edge + IE11
    } else if ((max || max == 0) && value > max) {
        console.log(evt.target);
        $(evt.target).val(max);
        $(evt.target).trigger('input'); // Use for Chrome/Firefox/Edge
        $(evt.target).trigger('change'); // Use for Chrome/Firefox/Edge + IE11
    }
});

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

formatMoney = function(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

$('body').delegate('money-input>input', 'focusout', function(evt) {
    var value = parseInt(evt.target.value.replaceAll(',', ''));
    var min = parseInt($(evt.target).parent().attr('min'));
    var max = parseInt($(evt.target).parent().attr('max'));

    // remove redundant +-
    if (!value && value != 0) {
        evt.target.value = null;
        return;
    }

    if ((min || min == 0) && value < min) {
        evt.target.value = formatMoney(min);
    } else if ((max || max == 0) && value > max) {
        evt.target.value = formatMoney(max);
    }
});

// 46 : '.'; 48 : '0'; 57 : '9'

$('body').delegate('input[type="number"]:not(.allow-negative)', 'keypress', function(evt) {
    let dot = 46; // .
    let min = 48; // 0
    let max = 57; // 9
    if (evt.which != 0 && evt.which < min || evt.which > max) {
        if (evt.which == dot && evt.target.className.indexOf('decimal') >= 0) {
            if (evt.target.value.indexOf('.') >= 0) {
                evt.preventDefault();
            }
            return;
        }
        evt.preventDefault();
    }
});

$('body').delegate('input[type="number"]:not(.allow-negative)', 'paste', function(evt) {

    clipboardData = evt.originalEvent.clipboardData || window.clipboardData;
    var pastedData = clipboardData.getData('Text');

    if (!pastedData.match(/^[0-9]*$/)) {
        evt.preventDefault();
    }
});



// window.addEventListener('beforeunload', function (e) {

//     $.post(window.parent['api-route'] + '/api/Ultility/Delete_g_path', window.parent['guid_file'], function () {

//     })
//     // e.returnValue = '';
//     // if (FileUploaderComponent.g) {
//     //     scope.attachFileService.delete_g_path(FileUploaderComponent.g).subscribe(response => {
//     //         FileUploaderComponent.g = undefined;
//     //     });
//     // }
// });