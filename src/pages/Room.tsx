import { FormEvent, useState } from "react";
import { useParams } from "react-router";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";
import { Question } from "../components/Question";

import logoImg from "../assets/images/logo.svg";
import "../styles/room.scss";
import { useRoom } from "../hooks/useRoom";

type RoomParams = {
  id: string;
}

export function Room() {
  const params = useParams<RoomParams>();
  const roomId = params.id;
  
  const { questions, title } = useRoom(roomId);
  const { user } = useAuth();

  const [newQuestion, setNewQuestion] = useState("");

  async function handleCreateNewQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error("You must be logged in!");
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion("");
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="logo" />
          <RoomCode code={roomId} />
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {
            questions.length > 0 && <span>{questions.length} Perguntas</span>
          }
        </div>
        <form onSubmit={handleCreateNewQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          <div className="form-footer">
            { 
              user ?
              <div className="user-info">
                <img src={user.avatar} alt="avatar do usuário" />
                <span>{user.name}</span>
              </div> :
              <span>Para enviar uma pergunta,  <button>faça seu login</button>.</span> 
            }
            <Button disabled={!user} type="submit">Enviar Pergunta</Button>
          </div>
        </form>
        {
          questions.map(question => {
            return(
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              />
            );
          })
        }
      </main>
    </div>
  )
}