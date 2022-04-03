

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

createSlider = function (slider, options) {
    noUiSlider.create(slider, options);
    const origins = slider.getElementsByClassName('noUi-origin');
    origins[0].setAttribute('disabled', true);
    origins[1].setAttribute('disabled', true);
}
createSlider(slider, options);

var draggedHandle;
var enableDragDrop = true;
var draggedElement;
const draggableHandles = document.querySelectorAll('.drag-handle');


draggableHandles.forEach(handle => {

    handle.addEventListener('dragstart', (evt) => {
        evt.dataTransfer.setData('text/plain',null);
        draggedElement = evt.target;
        handle.classList.add('active-dragging');
        evt.target.style.opacity = 0.5;
    })

    handle.addEventListener('dragend', (evt) => {
        handle.classList.remove('active-dragging');
        dragState = false;
        evt.target.style.opacity = 1;
        draggedElement = null;
    })
    
    // touch workaround
    handle.addEventListener('touchstart', (evt) => {
        draggedElement = handle;
    })

    handle.addEventListener('touchmove', function (e) {
        handle.classList.add('active-dragging');
        var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
        var touch = evt.touches[0] || evt.changedTouches[0];
        touchTargetUnderneath = document.elementFromPoint(touch.pageX, touch.pageY);    
        handle.style.position = 'absolute';
        handle.style.left = touch.pageX - handle.offsetWidth + 'px';
        handle.style.top = touch.pageY - handle.offsetHeight/2 + 'px';
        
        if (touchTargetUnderneath.classList.contains('noUi-base')) {
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

            draggedElement = null;
        }
        
    })
    handle.addEventListener('touchend', function (e) {
        handle.style = '';
        handle.style.position = 'relative';
        handle.classList.remove('active-dragging');
        draggedElement = null;
    })
    
})

const dropzone = document.querySelector(".dropzone");
const highlightCol = "cyan";
const defaultCol = "lightgray";
lightSlider = function (slider, col) {
    connects = document.querySelectorAll('.noUi-connect');
    connects.forEach(element => {
        element.style.backgroundColor = col;
    })
};
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
    var newVal = slider.noUiSlider.calcPointToPercentage(evt.y)
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


// dropzone.addEventListener("dragenter", function (evt) {
//     console.log("target hit")
//     // evt.preventDefault();
    
//     if (!dragState)
//         return;
    
//     dragState = false;
    
//     var newVal = slider.noUiSlider.calcPointToPercentage(evt.y)
//     newVal = newVal >= 100 ? 99 : newVal;
//     newVal = newVal <= 0 ? 1 : newVal;

//     draggedHandle = document.querySelector('.active-dragging')
//     draggedHandle.remove()
    
//     var values = slider.noUiSlider.get(true);
//     values.push(newVal); // Your new handle start value
//     slider.noUiSlider.destroy();
//     options.start = values;
//     createSlider(slider, options);
// })
  