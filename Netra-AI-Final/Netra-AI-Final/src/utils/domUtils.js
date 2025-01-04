export const getElement = (id) => document.getElementById(id);

export const updateElement = (id, content) => {
  const element = getElement(id);
  if (element) {
    element.textContent = content;
  }
};

export const toggleDisplay = (element, show) => {
  if (element) {
    element.style.display = show ? 'block' : 'none';
  }
};

export const toggleFlexDisplay = (element, show) => {
  if (element) {
    element.style.display = show ? 'flex' : 'none';
  }
};