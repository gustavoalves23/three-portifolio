import React, { Component } from 'react';
import photo from "../Files/photo.jpeg";

class About extends Component {
  render() {
    return (
      <div className="about-me">
      <div className="content">
          <h1 className="name">Gustavo Miyazaki</h1>
          <h2 className="job">Desenvolvedor Web Full Stack</h2>
          <p className="about-page">
            Bem vindo ao meu site, aqui você poderá encontrar informações sobre mim, 
            assim como meus projetos e trabalhos.
            Atualmente estou buscando trabalho como desenvolvedor web full stack.
          </p>
          <h2>Deseja trabalhar comigo?
            Entre em contato, vai ser um prazer te conhecer.</h2>
          <div className="social">
            <a target="_blank" href="https://github.com/gustavoalves23">GitHub</a>
            <a target="_blank" href="https://www.linkedin.com/in/gumiyazaki/">Linkedin</a>
            <a target="_blank" href="https://drive.google.com/file/d/11uiHYwQHC0fZPyTjo6jMkzUiuTCDn8Yk/view?usp=sharing">Currículo</a>
            <a href="mailto:gustavo.alves388@gmail.com">E-mail</a>
          </div>
          <h2 className="tel">Telefone: (+55) 11 93414-8279</h2>
        </div>
        <div className="photo">
          <img  className="photo" src={photo} alt="Gustavo Miyazaki"/>
          </div>
      </div>
    );
  }
}

export default About;