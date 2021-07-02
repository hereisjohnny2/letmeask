import { useParams } from "react-router";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";
import { useHistory } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";

import "../styles/room.scss";

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const history = useHistory();

  const { questions, title } = useRoom(roomId);

  async function handleEndRoom() {
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  }

  async function handleDeleteQuestion(id: string) {
    if(window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${id}`).remove();
    }
  }
  
  async function handleCheckQuestionAsAnswered(id: string) {
    await database.ref(`rooms/${roomId}/questions/${id}`).update({
      isAnwsered: true,
    });
  }

  async function handleCheckQuestionAsHighlighted(id: string) {
    await database.ref(`rooms/${roomId}/questions/${id}`).update({
      isHighlighted: true,
    });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="logo" />
          <div>
            <RoomCode code={roomId} />
            <Button 
              isOutlined 
              onClick={handleEndRoom}
            >
              Encerrar Sala
            </Button>
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
                isAnwsered={question.isAnwsered}
                isHighlighted={question.isHighlighted}
              >
                { !question.isAnwsered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={answerImg} alt="Responder Pergunta" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsHighlighted(question.id)}
                    >
                      <img src={checkImg} alt="Check Pergunta" />
                    </button>
                  </>
                )}
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