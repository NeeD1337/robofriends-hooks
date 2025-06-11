import React, { useState, useEffect } from "react";
import CardList from "../components/CardList.jsx";
import SearchBox from "../components/SearchBox.jsx";
import './App.css';
import Scroll from "../components/Scroll.jsx";
import Loader from "../components/Loader.jsx";
import { DarkModeProvider } from "@rbnd/react-dark-mode";

const App = () => {
  const [robots, setRobots] = useState([]);
  const [searchfield, setSearchfield] = useState('');
  const [error, setError] = useState(null);
  const [sortOrder,setSortOrder] = useState('asc'); // 'asc' or 'desc'

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => {
        if (!response.ok) {
          throw new Error("Eroare la incarcarea datelor");
        }
        return response.json();
      })
      .then(users => {
        setTimeout(() => {
          setRobots(users);
        }, 1000);
      })
      .catch(error => {
        console.error("Eroare API:", error);
        setError("API nu raspunde. Incearca mai tarziu.");
      });
  }, []);

  const onSearchChange = (event) => {
    setSearchfield(event.target.value);
  };

  const filteredRobots = robots.filter(robot =>
    robot.name.toLowerCase().includes(searchfield.toLowerCase())
  )
  .sort((a,b) => {
    if(sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
    } else {
        return b.name.localeCompare(a.name);
    }
  });

  if (error) {
    return (
      <div className="tc" style={{ paddingTop: '100px' }}>
        <h2>{error}</h2>
      </div>
    );
  }

  if (robots.length === 0) {
    return <Loader />;
  }

  return (
      <div className="tc fade-in">
        <h1 className="f1">RoboFriends</h1>
        <SearchBox searchChange={onSearchChange} />
        <button className="sort-button" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
            Sorteaza dupa nume ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
        </button>
        <Scroll>
          <CardList robots={filteredRobots} />
        </Scroll>
      </div>
  );
};

export default App;


// EXPLICATIE : Cand utilizatorul scrie ceva in SearchBox ul de pe pagina , in fisierul : SearchBox.js avem un input care este :
// : <input onChange={searchChange} /> , moment in care se declanseaza onChange si se apeleaza functia searchChange de aici din App.jsx adica <SearchBox searchChange ={this.onSearchChange}/>
// dupa care onSearchChange tot din App.jsx adica de aici , modifica state , mai exact "this.setState" modifica searchfield din state
// dupa care se detecteaza modificare si se apeleaza din nou render(prima data apelandu se la inceput cand se afiseaza toti robotii pentru ca nu avem nimic scris), intra in actiune filteredRobots care contine doar robotii care se potrivesc cu textul introdus
// si in final se reafiseaza CardList.jsx doar cu Robotii Potriviti

// props = informații transmise către o componentă de la componenta care o folosește
// 🔹 1. Componenta:
// function Buton(props) {
//   return <button>{props.text}</button>;
// }
// 🔹 2. Folosire:
// <Buton text="Trimite" />
// <Buton text="Anulează" />
// 🔹 3. Ce primește componenta:
// props = {
//   text: "Trimite"
// }
// și apoi:
// props = {
//   text: "Anulează"
// }
// 🔍 Afișarea finală:
// <button>Trimite</button>
// <button>Anulează</button>

