const jsx = `
  <div class="spinner">
    <img src="./favicon.svg">
    <style>
      @keyframes grow {
        0% { transform: scale(.5) }
        50% { transform: scale(1) }
        100% { transform: scale(.5) }
      }
      .spinner {
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }
      .spinner img {
        animation: grow 1s ease-in-out infinite;
      }
    </style>
  </div>
`;

const body = document.querySelector('body');
body.insertAdjacentHTML('afterbegin', jsx);
const spinner = document.querySelector('.spinner');
window.killSpinner = () => spinner.remove();
