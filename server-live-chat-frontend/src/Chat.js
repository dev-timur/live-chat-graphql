import { ApolloClient, InMemoryCache, useMutation, useSubscription, gql, useQuery} from '@apollo/client';
import { WebSocketLink } from "@apollo/client/link/ws";
import {Container, Chip, Grid, TextField, Button} from '@material-ui/core';
import { useEffect, useState } from 'react';

const link = new WebSocketLink({
    uri: `ws://localhost:4000/graphql`,
    options: {
      reconnect: true,
    },
});

export const client = new ApolloClient({
    link, 
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache(),
  });


const GET_ALL_MESSAGES = gql`
  query messages {
    messages(room: "64416a5ea3080a002877dc42") {
      content,
      id,
      author{
        name
      }
    }
  }
  `

const GET_MESSAGES = gql`
  subscription messageSent {
    messageSent(room: "64416a5ea3080a002877dc42") {
      id,
      content
      author{
          id,
        name
      }
    }
  }
`;


const POST_MESSAGE = gql`
mutation message($content:String!, $author: ID!)  {
    message(content:$content, author:$author ) {
      id,
      content
      author {
        id,
        name
      }
    }
  }
`;


const users = [
    {   
    id: "64416a6aa3080a002877dc44",
    name: "Timur"},
    {
    id: "64416a64a3080a002877dc43",
    name: "Vlad",
    }
]

export const Chat = () =>{
    return(
      <div>
         <Messages/> 
      </div>
    )
}

const Messages = () => {

    const {data: messagesData, loading, refetch } = useQuery(GET_ALL_MESSAGES);
    const { data: newMessage} = useSubscription(GET_MESSAGES);

    const [messages, setMessages] = useState([]);

    const [user, setUser] = useState("Timur"); 
    const [text, setText] = useState("");

    const [postMessage] = useMutation(POST_MESSAGE)

    const sendMessage=()=>{
      if(text.length>0 && user.length >0){

        const userId = users.find(el => el.name === user);

        console.log('userid', userId)

        postMessage({
          variables:{  content: text, author: userId.id }
        })
        setText("");
      }else{
        alert("Missing fields!")
      }
    }


    useEffect(() => {
        if(!loading){        
            setMessages(messagesData?.messages);
        }
        if(newMessage){
            setMessages((t) => [...t, newMessage?.messageSent]);
            refetch();
        }
    },[newMessage, loading ])

    if (!messages) {
      return null;
    }

    return (
  
      <div style={{ marginBottom: '5rem' }}>
        {messages.map(({ id, author, content }, index) => {
          return (
            <div key={index} style={{ textAlign: user === author.name ? "right":"left", paddingBottom: "5px" }}>
              <p style={{ marginBottom: '0.3rem' }}>{author.name}</p>
              <Chip style={{ fontSize: '0.9rem' }} color={user === author.name ? "primary": "secondary"} label={content} />
            </div>
          );
        })}
          <Grid style={{marginTop: "50px"}} container spacing={2}>
            <Grid item xs={3}>
              <TextField onChange={(e)=>{
                setUser(e.target.value)}} value={user} size="small" fullWidth variant="outlined" required  label="Enter name" />
            </Grid>
            <Grid item xs={8}>
              <TextField onChange={(e)=>{
                setText(e.target.value)}} value={text} size="small" fullWidth variant="outlined" required  label="Enter message here" />
            </Grid>
            <Grid item xs={1}>
              <Button onClick={sendMessage} fullWidth  variant="contained" style={{backgroundColor:"#60a820", color:"white"}}>Send</Button>
            </Grid>
          </Grid>
      </div>
    );
  };