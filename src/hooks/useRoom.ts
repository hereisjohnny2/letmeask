import { useEffect, useState } from "react";
import { database } from "../services/firebase";

type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string,
  },
  content: string;
  isAnwsered: boolean;
  isHighlighted: boolean;
}>;

type QuestionType = {
  id: string;
  author: {
    name: string,
    avatar: string,
  },
  content: string;
  isAnwsered: boolean;
  isHighlighted: boolean;
}

export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room => {
      const firebaseQuestions: FirebaseQuestions = room.val().questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnwsered: value.isAnwsered
        }
      });
      setTitle(room.val().title);
      setQuestions(parsedQuestions);      
    })
  }, [roomId]);

  return { questions, title }
}