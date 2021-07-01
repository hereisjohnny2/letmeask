import { useParams } from "react-router";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import "../styles/room.scss";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const roomId = params.id;

  
  const { questions, title } = useRoom(roomId);

  async function handleDeleteQuestion(id: string) {
    if(window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${id}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="logo" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined >Encerrar Sala</Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {
            questions.length > 0 && <span>{questions.length} Perguntas</span>
          }
        </div>
        {
          questions.map(question => {
            return(
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover Pergunta" />
                </button>
              </Question>
            );
          })
        }
      </main>
    </div>
  )
}