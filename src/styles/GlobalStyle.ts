import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {

    // font
    --font-size-default: 14px;
    --font-family: Inter, system-ui, Helvetica, Arial, sans-serif;

    // width & height
    --max-width: 1770px;
    --header-height: 80px;
    --card-header-height: 70px;


    // font colors
    --font-color: rgba(17, 17, 25, 1);
    --text-placeholder: rgba(112, 112, 144, 1);
    
    // colors
    // gray_background
    /* rgba(238, 238, 242,1) */


    // blue
    --primary-blue: rgb(23, 106, 229);
    --blue-gradient-start: rgba(13, 59, 127, 1);
    --blue-shadow: rgba(87, 137, 213, 0.787);
    --blue-drop-shadow: rgba(24, 102, 219, 0.7);
/* background: radial-gradient(50% 50% at 50% 50%, #0D3B7F 0%, #176AE5 100%); */


    // orange
    --primary-orange: rgb(234, 84, 0);
    --orange-gradient-start: rgba(229, 23, 147, 1);

    // various
    --background-color: rgba(238, 238, 242, 1); // #EEEEF2
    --background-color-section: rgba(246, 246, 248, 1); 
    --icon-background-transparent: rgba(255, 255, 255, 0.6);
    --icon-border-color: rgba(235, 235, 242, 1);
    --icon-background-color:rgba(235, 235, 242, 0.5);

    // radius
    --card-radius: 8px;
    --icon-bg-radius: 4px;


    // paddings
    --card-content-padding: 15px;
    --padding-s: 0.5rem;
    --padding-m: 40px;

    // margins
    --header-margin-bottom: 23px;
    --header-icon-mr: 1rem;
    --margin-s: 0.5rem; 
    --margin-m: 1rem;
    --margin-l: 22px;
    --margin-x: 2rem;



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
