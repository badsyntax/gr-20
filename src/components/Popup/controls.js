import ClosePopupControl from './ClosePopupControl';
import ZoomInControl from './ZoomInControl';
import NextPointControl from './NextPointControl';
import PrevPointControl from './PrevPointControl';

const button = title => {
  const newButton = document.createElement('button');
  newButton.setAttribute('title', title);
  return newButton;
};

export const closeControl = new ClosePopupControl({
  label: button('Close'),
});

export const zoomInControl = new ZoomInControl({
  label: button('Zoom to Point'),
});

export const prevPointControl = new NextPointControl({
  label: button('Previous Point'),
});

export const nextPointControl = new PrevPointControl({
  label: button('Next Point'),
});
