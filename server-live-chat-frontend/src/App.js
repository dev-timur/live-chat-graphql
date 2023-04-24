import './App.css';
import { ApolloProvider } from '@apollo/client';
import {client, Chat} from './Chat'

function App() {
  return (
    <ApolloProvider client={client}>
      <div className = "App">
        <div className='header'>
        <h2> CHAT</h2>
        </div>

        <Chat/>
      </div>
    </ApolloProvider>
  );
}

export default App;
