import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --font-color: rgba(17, 17, 25, 1);
    --background-color: rgba(238, 238, 242, 1);
    --font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;


    // colours
    --text-placeholder: rgba(112, 112, 144, 1)
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  ol, ul {
    list-style: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
  }

  body {
    font-family: var(--font-family);
    color: var(--font-color);
    background-color: var(--background-color);
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    letter-spacing: 0.01em;
  }

  h4 {
    font-size: 1.375rem; // 22px;
    line-height: 1.788rem; // 28.6px;

  }


  h5 {
    font-size: 1rem;
    line-height: 1.3rem; // 20.8px
    font-weight: 700;
    margin-bottom: .5rem;
  
  }

  p {
    font-size: 13px;
    line-height: 0.975rem // 15.6px;
  }
`;

export default GlobalStyle;
