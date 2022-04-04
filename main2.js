

var slider = document.getElementById('slider');
options = {
    start: [0, 100],
    connect: true,
    behaviour: 'unconstrained',
    orientation: 'vertical',
    range: {
        'min': 0,
        'max': 100
    }
}
var connects;
createSlider = function (slider, options) {
    noUiSlider.create(slider, options);
    const origins = slider.getElementsByClassName('noUi-origin');
    origins[0].setAttribute('disabled', true);
    origins[1].setAttribute('disabled', true);
    connects = document.querySelectorAll('.noUi-connect');
}
createSlider(slider, options);


var draggedHandle;
var draggedElement;
const draggableHandles = document.querySelectorAll('.drag-handle');
const dropzone = document.querySelector(".dropzone");

const highlightCol = "cyan";
const defaultCol = "lightgray";
lightSlider = function (slider, col) {
    connects = document.querySelectorAll('.noUi-connect');
    connects.forEach(element => {
        element.style.backgroundColor = col;
    })
};

touchMoveListener = function (e) {
    console.log("touchMoveListener");
    e.preventDefault();
    var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
    var touch = evt.touches[0] || evt.changedTouches[0];
    const touchTargetUnderneath = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset);
    this.style.top = touch.pageY - this.offsetHeight / 2 + 'px';
    this.style.left = touch.pageX - this.offsetWidth + 'px';

    console.log(touchTargetUnderneath)
    if (!touchTargetUnderneath) {
        connects.forEach(el => {
            if (el.classList.contains('connect-active')) {
                el.classList.remove('connect-active');
            }
        })
        return;
    }

    if (
        touchTargetUnderneath.classList.contains('noUi-base') ||
        touchTargetUnderneath.classList.contains('dropzone')
    ) {

        connects.forEach(el => {
            if (!el.classList.contains('connect-active')) {
                el.classList.add('connect-active');
            }
        })
    } else {
        connects.forEach(el => {
            if (el.classList.contains('connect-active')) {
                el.classList.remove('connect-active');
            }
        })
    }
}

draggableHandles.forEach(handle => {

    handle.addEventListener('dragstart', (evt) => {
        console.log("dragstart");
        evt.dataTransfer.setData('text/plain', null);
        draggedElement = evt.target;
        handle.classList.add('active-dragging');
        evt.target.style.opacity = 0.5;
    })

    handle.addEventListener('dragend', (evt) => {
        console.log("dragend");
        evt.target.style.opacity = 1;
        draggedElement = null;

    })

    // touch workaround
    handle.addEventListener('touchstart', (evt) => {
        console.log("touchstart");
        handle.style.position = 'absolute';
        draggedElement = handle;
    })

    handle.addEventListener('touchmove', touchMoveListener)

    handle.addEventListener('touchend', function (e) {
        console.log("touchend");
        var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
        var touch = evt.touches[0] || evt.changedTouches[0];
        const touchTargetUnderneath = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset);


        if (dropzone.classList.contains('dropzone-active')) {
            dropzone.classList.remove('dropzone-active');
        }

        if (!touchTargetUnderneath) {
            connects.forEach(el => {
                if (el.classList.contains('connect-active')) {
                    el.classList.remove('connect-active');
                }
            })
            console.log("reset")
            handle.style = '';
            handle.style.position = 'relative';
            return;
        }

        if (
            touchTargetUnderneath.classList.contains('noUi-base') ||
            touchTargetUnderneath.classList.contains('dropzone')
        ) {
            console.log(draggedElement.dataset)
            var newVal = slider.noUiSlider.calcPointToPercentage(touch.pageY)
            newVal = newVal >= 100 ? 99 : newVal;
            newVal = newVal <= 0 ? 1 : newVal;

            draggedElement.remove()

            var values = slider.noUiSlider.get(true);
            values.push(newVal); // Your new handle start value
            slider.noUiSlider.destroy();
            options.start = values;
            createSlider(slider, options);
            this.removeEventListener('touchmove', touchMoveListener);
            draggedElement = null;
        } else {
            console.log("reset")
            handle.style = '';
            handle.style.position = 'relative';
        }






    })

    handle.addEventListener('touchcancel', function (e) {
        console.log("touchcancel");
        var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
        var touch = evt.touches[0] || evt.changedTouches[0];
        touchTargetUnderneath = document.elementFromPoint(touch.pageX, touch.pageY);

        if (dropzone.classList.contains('dropzone-active')) {
            dropzone.classList.remove('dropzone-active');
        }

        if (
            touchTargetUnderneath.classList.contains('noUi-base') ||
            touchTargetUnderneath.classList.contains('dropzone')
        ) {
            console.log(draggedElement.dataset)
            var newVal = slider.noUiSlider.calcPointToPercentage(touch.pageY)
            newVal = newVal >= 100 ? 99 : newVal;
            newVal = newVal <= 0 ? 1 : newVal;

            draggedElement.remove()

            var values = slider.noUiSlider.get(true);
            values.push(newVal); // Your new handle start value
            slider.noUiSlider.destroy();
            options.start = values;
            createSlider(slider, options);
            this.removeEventListener('touchmove', touchMoveListener);
            draggedElement = null;
        } else {
            handle.style = '';
            handle.style.position = 'relative';
        }






    })

})



dropzone.addEventListener("dragenter", function (evt) {
    lightSlider(slider, highlightCol);
    evt.preventDefault();
})

dropzone.addEventListener("dragover", function (evt) {
    lightSlider(slider, highlightCol);
    evt.preventDefault();
})

dropzone.addEventListener("dragleave", function (evt) {
    lightSlider(slider, defaultCol);
    evt.preventDefault();
})

dropzone.addEventListener("drop", function (evt) {
    console.log("drop")
    evt.preventDefault();

    console.log(draggedElement)
    var newVal = slider.noUiSlider.calcPointToPercentage(evt.y + window.pageYOffset)
    newVal = newVal >= 100 ? 99 : newVal;
    newVal = newVal <= 0 ? 1 : newVal;

    draggedHandle = document.querySelector('.active-dragging')
    draggedHandle.remove()

    var values = slider.noUiSlider.get(true);
    values.push(newVal); // Your new handle start value
    slider.noUiSlider.destroy();
    options.start = values;
    createSlider(slider, options);

    draggedElement = null;
})

