import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {

    // font
    --font-size-default: 14px;
    --font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;

    // width & height
    --max-width: 1770px;
    --header-height: 80px;
    --card-header-height: 70px;


    // font colours
    --font-color: rgba(17, 17, 25, 1);
    --text-placeholder: rgba(112, 112, 144, 1);
    
    // colours
    --primary-blue: rgb(23, 106, 229);
    --primary-orange: rgb(234, 84, 0);
    --background-color: rgba(238, 238, 242, 1);
    --background-color-section: rgba(246, 246, 248, 1); 
    --icon-background-transparent: rgba(255, 255, 255, 0.6);
    --icon-border-color: rgba(235, 235, 242, 1);
    --icon-background-color:rgba(235, 235, 242, 0.5);

    // radius
    --card-radius: 8px;
    --icon-bg-radius: 4px;


    // paddings
    --card-padding: 1.125rem 0.938rem; // 21px 15px

    // margins
    --header-margin-bottom: 23px;
    --header-icon-mr: 1rem;



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
