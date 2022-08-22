
import classes from './Footer.module.css';

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();

  return <>
    <footer className={classes.Footer}>
      <div className={classes.footerDetails}>

        <div className={classes.about}>
          <ul className={classes.info}>
            <h3>ABOUT ME</h3>
            <li>My Portfolio</li>
            <li > <a className={classes.links} href="https://github.com/Tanmoy2099" target="_blank" rel="noreferrer" > My Github</a></li>
            <li>Contact</li>
          </ul>

          <ul className={classes.info}>
            <h3>FOR TRAVELLERS</h3>
            <li>Community</li>
            <li>Developer</li>
            <li>Blog</li>
          </ul>
        </div>
        
      </div> 


      <div className={classes.bottomFooter}>
        <h4>Copyright &copy; 2020 - {year} All Rights reserved. </h4>
        <h5>made with <span> ❤ </span> by <strong>Tanmoy Nath</strong> </h5>
      </div>
    </footer>
  </>
}

export default Footer

