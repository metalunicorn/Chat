import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';

const SERVER_URL = 'http://localhost:5050';

interface Msg {
  _id:string, 
  message:string, 
  user:string, 
  createAt:Date, 
  color:string
}
interface UserOnline {
  name: string; socket: string;
}

interface AllUsers {
 id:string, name:string, admin:boolean, mute:boolean, ban:boolean
}

interface ChatData{
  showAllUsers: AllUsers[],
  ban:(_id: string) => void,
  disconnect: () => void,
  messages: Msg[],
  mute:(_id: string) => void,
  sendMessage: (messageText:string)=>void,
  usersOnline: UserOnline[],
}


const useChat = ():ChatData => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [usersOnline, setUsersOnline] = useState<UserOnline[]>([]);
  const [showAllUsers, setShowAllUsers] = useState<AllUsers[]>([]);
  const socketRef = useRef<Socket|null>(null);
  const history = useHistory();

  
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const token = localStorage.getItem('authToken');
    if (token) {
      socketRef.current = io(SERVER_URL, {
        auth: {
          // eslint-disable-next-line no-undef
          token: localStorage.getItem('authToken'),
        },
      });
    }
    if (!socketRef.current) {
      history.push('/auth');
      return;
    }

    socketRef.current.on('connect', () => {
      // do nothing.
      console.log("socket connected")
    });

    socketRef.current.on('UsersOnline', (users:{[users:string]:{
      name:string,
      socket:string
    }}) => {
      const ShowUserOnline = [];
      // eslint-disable-next-line no-restricted-syntax
      console.log(users)
      for (const user in users) {
        if (user) {
          ShowUserOnline.push(users[user]);
        }
      }
      setUsersOnline(ShowUserOnline);
    });

    socketRef.current.on('disconnect', () => {
      socketRef.current?.disconnect();
      // eslint-disable-next-line no-undef
      localStorage.removeItem('authToken');
      history.push('/auth');
    });

    socketRef.current.on('ShowAllUsers', async (allUsers:[{id: string,
      name: string,
      admin: boolean,
      mute: boolean,
      ban: boolean,}]) => {
      setShowAllUsers(allUsers);
    });

    socketRef.current.on('Messages', (prevMessages:{prevMessages:[{_id:string, message:string, user:string, createAt:Date, color:string}]}) => {
      setMessages(prevMessages.prevMessages.reverse());
    });
    socketRef.current.on('newMessage', (message:{message:string, user:string, color:string, userId:string}) => {
      // eslint-disable-next-line
      setMessages((prevState:any) => [...prevState, message]);
    });

    // eslint-disable-next-line consistent-return
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = (messageText:string):void => {
    socketRef.current?.emit('Message', {
      message: messageText,
    });
  };

  const mute = (_id:string) => {
    socketRef.current?.emit('Mute', {
      _id,
    });
  };

  const ban = (_id:string) => {
    socketRef.current?.emit('Ban', {
      _id,
    });
  };

  const disconnect = ():void => {
    socketRef.current?.disconnect();
    // eslint-disable-next-line no-undef
    localStorage.removeItem('authToken');
    history.push('/auth');
    // eslint-disable-next-line no-undef
    window.location.reload();
  };

  return {
    showAllUsers,
    ban,
    disconnect,
    messages,
    mute,
    sendMessage,
    usersOnline,
  };
};

export default useChat;
