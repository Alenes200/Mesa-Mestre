export function escapeHTML(str) {
  var element = document.createElement('div');
  if (str) {
    element.innerText = str;
    element.textContent = str;
  }
  return element.innerHTML;
}
