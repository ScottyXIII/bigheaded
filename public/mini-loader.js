const jsx = `
  <div class="overlay">
    <img src="./favicon.svg"/>
    <h2>LOADING</h2>
    <style>
      @keyframes grow {
        0% { transform: scale(.5) }
        50% { transform: scale(1) }
        100% { transform: scale(.5) }
      }
      .overlay {
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        flex-direction: column;
        gap: 8px;
      }
      .overlay img {
        animation: grow 2s ease-in-out infinite;
        width: 100px;
        height: 100px;
      }
    </style>
  </div>
`;

const body = document.querySelector('body');
body.insertAdjacentHTML('afterbegin', jsx);

const overlay = document.querySelector('.overlay');
window.addEventListener('load', () => overlay.remove());
